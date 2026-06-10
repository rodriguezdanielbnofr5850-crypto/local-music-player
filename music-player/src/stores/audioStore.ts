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


export const useAudio = defineStore('audio',() =>
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
    mode.value === 'random'
})
const isLoop = computed(() => 
{
    mode.value === 'loop'
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
}

})