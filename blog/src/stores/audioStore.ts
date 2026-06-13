import {ref,computed,watch} from 'vue'
import {defineStore} from 'pinia'
import type { ComputedRef } from 'vue'
import type {Song} from './libraryStore'
import { extractCover } from '@/modules/player/utils/cover'
import { useLibraryStore } from './libraryStore'
import { delSong } from '@/modules/player/utils/db'


export interface AudioState{
    curIdx: number
    mode: 'list'|'random'|'loop'
    volume:number
    currentTime: number
    duration: number
    paused: boolean
    currentCoverUrl: string|null
    currentAudioUrl: string|null
}


export const useAudioStore = defineStore('audio',() =>
{
    const libraryStore = useLibraryStore()

const audioElement = ref<HTMLAudioElement | null>(null)

//变量
const curIdx = ref(-1)
const mode = ref<'list' |'random' | 'loop'>('list')
const volume = ref(0.7)
const currentTime = ref(0)
const duration = ref(0)
const paused = ref(true)
const currentCoverUrl = ref<string | null>(null)
const currentAudioUrl = ref<string|null>(null)

const isShuffle = computed(() =>
{
    return mode.value === 'random'
})
const isLoop = computed(() => 
{
    return mode.value === 'loop'
})
const progressPercent = computed<number>(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
})
const currentSong = computed<Song | null>(() => {
    const song = libraryStore.library[curIdx.value]
    if (curIdx.value >= 0 && curIdx.value < libraryStore.library.length && song) {
        return song
    }
    return null
})


function bindAudioEvent(): void{
    const el = audioElement.value
    if(!el) return

    el.addEventListener('play',()=> {paused.value = false})
    el.addEventListener('pause',()=> {paused.value = true})
    el.addEventListener('timeupdate',()=> {if(audioElement.value)
    {
        currentTime.value = audioElement.value.currentTime
        duration.value = audioElement.value.duration || 0
    }
    })
    el.addEventListener('ended', () => {
  if (currentSong.value) {
    libraryStore.incrementPlayCount(currentSong.value.id)
  }
  next()
})
    el.addEventListener('volumechange',()=>{
        if(audioElement.value)
        {
            volume.value = audioElement.value.volume
        }
    })
}
function revokeCurrentUrls():void{
    if(currentAudioUrl.value){
        URL.revokeObjectURL(currentAudioUrl.value)
        currentAudioUrl.value = null
    }
    if(currentCoverUrl.value){
        URL.revokeObjectURL(currentCoverUrl.value)
        currentCoverUrl.value = null
    }
}
//核心函数
async function loadSongByIndex(index:number): Promise<void>{
    if(index < 0 || index >= libraryStore.library.length) return
    const song = libraryStore.library[index]
    if(!song || !song.file) return

    revokeCurrentUrls()
    
    const audioUrl = URL.createObjectURL(song.file)
    currentAudioUrl.value = audioUrl

    if(audioElement.value){
        audioElement.value.src = audioUrl
    }
    const coverUrl = await extractCover(song.file)
    currentCoverUrl.value = coverUrl

    curIdx.value = index
}

async function play(): Promise<void> {
    const el = audioElement.value
    if(!el) return

    if(curIdx.value === -1){
        if(libraryStore.library.length > 0){
            await loadSongByIndex(0)
        }else return
    }else{
        if(!el.src && currentAudioUrl.value)
        {
            el.src = currentAudioUrl.value
        }
    }
    if(!el.src){
        const song = libraryStore.library[curIdx.value]
        if(song && song.file){
            const url = URL.createObjectURL(song.file)
            el.src = url
            currentAudioUrl.value = url
        }else return
    }
   try {
    await el.play();
    paused.value = false; 
  } catch (e) {
    console.warn('播放失败', e);
  }
}

function pause(): void{
    audioElement.value?.pause()
    paused.value = true;
}

function togglePlay(): void{
    if(!audioElement.value) return
    if(audioElement.value.paused){
        play()
    }else{
        pause()
    }
}

async function prev(): Promise<void>{
    const filtered = libraryStore.filteredList
    if(!filtered.length) return

    var curInFilter = filtered.findIndex(s => s._globalIdx === curIdx.value)
    if(curInFilter === -1) curInFilter = 0

    var prevIndex: number
    if(isShuffle.value){
              prevIndex = Math.floor(Math.random() * filtered.length)
}else{
    prevIndex = (curInFilter - 1 + filtered.length) % filtered.length
}
    const target = filtered[prevIndex]
    if(target){
        await loadSongByIndex(target._globalIdx)
        await play()
    }
}

 async function next(): Promise<void> {
    const filtered = libraryStore.filteredList
    if (!filtered.length) return

    let curInFilter = filtered.findIndex(s => s._globalIdx === curIdx.value)
    if (curInFilter === -1) curInFilter = 0

    let nextIndex: number
    if (isShuffle.value) {
      nextIndex = Math.floor(Math.random() * filtered.length)
    } else if (isLoop.value) {
      nextIndex = curInFilter
    } else {
      nextIndex = (curInFilter + 1) % filtered.length
    }

    const target = filtered[nextIndex]
    if (target) {
      await loadSongByIndex(target._globalIdx)
      await play()
    }
  }

  async function playByIndex(index: number): Promise<void> {
    if (index < 0 || index >= libraryStore.library.length) return
    await loadSongByIndex(index)
    await play()
  }

  async function replayCurrent(): Promise<void> {
    if (curIdx.value >= 0) await playByIndex(curIdx.value)
  }

  function setVolume(vol: number): void {
    const v = Math.min(1, Math.max(0, vol))
    volume.value = v
    if (audioElement.value) audioElement.value.volume = v
  }

  function seek(percent: number): void {
    if (!audioElement.value || !duration.value) return
    const t = percent * duration.value
    audioElement.value.currentTime = t
    currentTime.value = t
  }

  function stopAndReset(): void {
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.src = ''
    }
    revokeCurrentUrls()
    curIdx.value = -1
    currentTime.value = 0
    duration.value = 0
    paused.value = true
  }

  function toggleMode(type: 'shuffle' | 'loop'): void {
    if (type === 'shuffle') {
      mode.value = mode.value === 'random' ? 'list' : 'random'
    } else if (type === 'loop') {
      mode.value = mode.value === 'loop' ? 'list' : 'loop'
    }
  }

  function setAudioElement(el: HTMLAudioElement | null): void {
    if (el && el !== audioElement.value) {
      audioElement.value = el
      bindAudioEvent()
      audioElement.value.volume = volume.value
    }
  }

  function restoreFromLocalStorage(): void {
    const savedMode = localStorage.getItem('cyber_mode')
    if (savedMode === 'random' || savedMode === 'loop') {
      mode.value = savedMode
    } else {
      mode.value = 'list'
    }

    const savedIdx = parseInt(localStorage.getItem('cyber_idx') || '-1')
    if (!isNaN(savedIdx) && savedIdx >= 0 && savedIdx < libraryStore.library.length) {
      curIdx.value = savedIdx
    }

    const savedVol = parseFloat(localStorage.getItem('cyber_vol') || '0.7')
    if (!isNaN(savedVol)) {
      volume.value = savedVol
      if (audioElement.value) audioElement.value.volume = savedVol
    }
  }

  function saveState(): void {
    localStorage.setItem('cyber_mode', mode.value)
    localStorage.setItem('cyber_idx', String(curIdx.value))
    localStorage.setItem('cyber_vol', String(volume.value))
  }

  watch([mode, curIdx, volume], () => { saveState() })

  return {
    curIdx, mode, volume, currentTime, duration, paused,
    currentCoverUrl, currentAudioUrl,
    isShuffle, isLoop, progressPercent, currentSong,
    setAudioElement, loadSongByIndex, play, pause, togglePlay,
    prev, next, playByIndex, replayCurrent, setVolume, seek,
    stopAndReset, toggleMode, restoreFromLocalStorage, saveState
  }
})