import { defineStore } from 'pinia'
import { ref, computed,reactive} from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { loadSongs, saveSong, updateSongDir, loadDirs, saveDirs, delSong } from '@/modules/player/utils/db'
import { parseName } from '@/modules/player/utils/format'

export interface Song {
  id: string
  signature: string
  name: string
  artist: string
  originalFileName: string
  directoryId: string
  file: File
}
export interface Dir {
  id: string
  name: string
  cover?: string
}
interface FilteredSong extends Song {
  _globalIdx: number
  _dirName?: string
}
export const useLibraryStore = defineStore('library', () => {
  const library = ref<Song[]>([])
  const dirs = ref<Dir[]>([])
  const curDir = ref<string>('all')
  const kw = ref<string>('')
  const filteredList = computed<FilteredSong[]>(() => {
    var list: FilteredSong[] = library.value.map((song, idx) => ({
      ...song,
      _globalIdx: idx,
      _dirName: ''
    }))

    if (curDir.value !== 'all') {
      list = list.filter(s => s.directoryId === curDir.value)
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
        const d = dirs.value.find(dir => dir.id === s.directoryId)
        s._dirName = d ? d.name : ''
      })
    }

    return list
  })

  const countDir = (dirId: string): number =>{
        return (library.value.filter((s: Song) => s.directoryId === dirId)).length;
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
        directoryId: target
      }
      library.value.push(song)
      await saveSong(song)
    }
  }


  const playCounts = reactive<Record<string, number>>({})

  function incrementPlayCount(songId: string) {
  playCounts[songId] = (playCounts[songId] || 0) + 1
  }

  function getTotalPlayCount(): number {
    return Object.values(playCounts).reduce((sum, c) => sum + c, 0)
  }
  async function removeSong(id:string) {
    const idx = library.value.findIndex(s => s.id === id)
    if(idx != -1)
    {
      library.value.splice(idx,1)
      await delSong(id)
    }
    return idx
  }
  async function moveSong(songId:string,newDirId:string): Promise<void> {
    const song = library.value.find(s => s.id === songId)
    if(song)
    {
      song.directoryId = newDirId
      await updateSongDir(songId,newDirId)
    }
  }

  async function addDir(name: string, cover?: string) {
    const id = 'dir_' + Date.now();
    dirs.value.push({ id, name, cover})
    await saveDirs(JSON.parse(JSON.stringify(dirs.value)))
    return id
  }

  async function removeDir(dirId:string)
  {
    if(dirId !== 'default'){
      for(const song of library.value.filter(s => s.directoryId === dirId)){
        song.directoryId = 'default'
        await updateSongDir(song.id,'default')
      }
      dirs.value = dirs.value.filter(d => d.id !== dirId)
      await saveDirs(JSON.parse(JSON.stringify(dirs.value)))
      if(curDir.value === dirId) {curDir.value = 'all'}
    }
  }


async function loadDate(): Promise<void> {
    const loadedDirs = await loadDirs()
    if(loadedDirs.length){
      dirs.value = loadedDirs.filter(d => d.id !== 'default');
    }
    else{
      dirs.value = [] 
      await saveDirs(JSON.parse(JSON.stringify(dirs.value)))
    }
  }


  return {library, dirs, curDir, kw, filteredList,  playCounts, incrementPlayCount, getTotalPlayCount,countDir,
        addSongs, removeSong, moveSong, addDir, removeDir, loadDate}
})
