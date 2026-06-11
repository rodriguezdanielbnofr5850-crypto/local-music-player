import {ref,computed,watch} from 'vue'
import {defineStore} from 'pinia'
import type { ComputedRef } from 'vue'
import type {Song} from './libraryStore'
import { extractCover } from '@/utils/cover'
import { useLibraryStore } from './libraryStore'
import { delSong } from '@/utils/db'


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
    el.addEventListener('ended',() => {next()})
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
    await el.play().catch((e: unknown) => {console.warn('播放失败',e)})
}

function pause(): void{
    audioElement.value?.pause()
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
})