import { defineStore } from 'pinia'
import { ref, computed,reactive} from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { loadSongs, saveSong, saveDirSong, loadDirSongs, delDirSong, delDirSongsByDir, loadDirs, saveDirs, delSong } from '@/modules/player/utils/db'
import { parseName } from '@/modules/player/utils/format'

export interface Song {
  id: string
  signature: string
  name: string
  artist: string
  originalFileName: string
  file: File
}
export interface Dir {
  id: string
  name: string
  cover?: string
}
export interface DirSong {
  dirId: string
  songId: string
}
interface FilteredSong extends Song {
  _globalIdx: number
  _dirNames: string
}
export const useLibraryStore = defineStore('library', () => {
  const library = ref<Song[]>([])
  const dirs = ref<Dir[]>([])
  const curDir = ref<string>('all')
  const dirSongs = ref<DirSong[]>([])
  const kw = ref<string>('')
  const filteredList = computed<FilteredSong[]>(() => {
    var list: FilteredSong[] = library.value.map((song, idx) => ({
      ...song,
      _globalIdx: idx,
      _dirNames: ''
    }))

    if (curDir.value !== 'all') {
      const songIds = new Set(
        dirSongs.value.filter(ds => ds.dirId === curDir.value).map(ds => ds.songId)
      )
      list = list.filter(s => songIds.has(s.id))
    }

    if (kw.value.trim()) {
      const w = kw.value.trim().toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(w) ||
        s.artist.toLowerCase().includes(w)
      )
    }

    if (curDir.value === 'all') {
      list.forEach(s => {
        const dirIds = dirSongs.value.filter(ds => ds.songId === s.id).map(ds => ds.dirId)
        const names = dirIds
          .map(did => dirs.value.find(d => d.id === did)?.name)
          .filter(Boolean)
        s._dirNames = names.join(', ')
      })
    }

    return list
  })

  const countDir = (dirId: string): number =>{
    return dirSongs.value.filter(ds => ds.dirId === dirId).length
  }


  //library增添方法
  async function addSongs(files:File[] | FileList) {
    const valid = Array.from(files).filter(f => f.type.includes('audio') || /\.(mp3|flac|wav|aac|ogg)$/i.test(f.name))
    const target = curDir.value === 'all' ? 'default' : curDir.value
    for(const file of valid){
      const sign = `${file.name}_${file.size}`
      if(library.value.some(s => s.signature === sign)) continue;
      const {artist,title} = parseName(file.name)
      const song: Song= {
        id: String(Date.now() + Math.random()),
        signature: sign,
        name: title,
        artist:artist,
        file,
        originalFileName: file.name,
      }
      library.value.push(song)
      await saveSong(song)
      if (curDir.value !== 'all') {
        const ds: DirSong = { dirId: curDir.value, songId: song.id }
        dirSongs.value.push(ds)
        await saveDirSong(ds.dirId, ds.songId)
      }
    }
  }


  const playCounts = reactive<Record<string, number>>({})

  function incrementPlayCount(songId: string) {
  playCounts[songId] = (playCounts[songId] || 0) + 1
  }

  function getTotalPlayCount(): number {
    return Object.values(playCounts).reduce((sum, c) => sum + c, 0)
  }
async function removeSong(id: string) {
    const idx = library.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      library.value.splice(idx, 1)
      dirSongs.value = dirSongs.value.filter(ds => ds.songId !== id)
      await delSong(id)  
    }
    return idx
}

  async function addDir(name: string, cover?: string) {
    const id = 'dir_' + Date.now();
    dirs.value.push({ id, name, cover})
    await saveDirs(JSON.parse(JSON.stringify(dirs.value)))
    return id
  }

async function removeDir(dirId: string): Promise<void> {
    dirs.value = dirs.value.filter(d => d.id !== dirId)
    await saveDirs(JSON.parse(JSON.stringify(dirs.value)))

    dirSongs.value = dirSongs.value.filter(ds => ds.dirId !== dirId)
    await delDirSongsByDir(dirId)

    if (curDir.value === dirId) {
      curDir.value = 'all'
    }
}


async function loadDate(): Promise<void> {
    const loadedDirs = await loadDirs()
      dirs.value = loadedDirs.filter(d => d.id !== 'default');
      const loadedDirSongs = await loadDirSongs()
      dirSongs.value = loadedDirSongs.map(ds => ({ dirId: ds.dirId, songId: ds.songId }))
      if (dirSongs.value.length === 0) {
        const loadedSongs = await loadSongs()
        const oldMappings = (loadedSongs as any[]).filter(s => s.directoryId && s.directoryId !== 'default')
         if (oldMappings.length > 0) {
            for (const s of oldMappings) {
                const ds: DirSong = { dirId: s.directoryId, songId: s.id }
                dirSongs.value.push(ds)
                await saveDirSong(ds.dirId, ds.songId)
            }
        }
      }
  }


  return {library, dirs, curDir, kw, filteredList,  playCounts, incrementPlayCount, getTotalPlayCount,countDir,
        addSongs, removeSong, addDir, removeDir, loadDate}
})
