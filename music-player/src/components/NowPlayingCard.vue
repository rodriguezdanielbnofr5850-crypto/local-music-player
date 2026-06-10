<template>
<div class="now-card" @click="replayCurrent">
    <div class="viz" :class="{paused: audioStore.paused}">
        <i></i><i></i><i></i><i></i>
    </div>
    <div class="now-mate">
        <div class="now-title">{{ title }}</div>
        <div class="now-artist">{{ artist }}</div>
    </div>
    <div class="now-time">{{ nowtime }}</div>
</div>
</template>

<style>
.now-card {
    background: rgba(0, 243, 255, 0.04);
    border: 1px solid rgba(0, 243, 255, 0.15);
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    cursor: pointer;
    transition: .2s;
}
.now-card:hover {
    background: rgba(0, 243, 255, 0.35);
    box-shadow: 0 0 12px rgba(0, 243, 255, 0.08);
}
.viz{
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
}
.viz i{
    display: block;
    width: 3px;
    background: var(--neon-cyan);
    border-radius: 2px;
    animation: viz .9s ease-in-out infinite;
}
@keyframes viz {
    0%,100%{
        height: 20%;
    }
    50%{
        height: 100%;
    }
}
.viz i:nth-child(1){
    height: 40%;
    animation-delay: 0s;
}
.viz i:nth-child(2){
    height: 70%;
    animation-delay: .15s;
}
.viz i:nth-child(3){
    height: 50%;
    animation-delay: .3s;
}
.viz i:nth-child(4){
    height: 90%;
    animation-delay: .05s;
}
.viz.paused i{
    animation-play-state: paused;
    opacity: .3;
}
</style>

<script setup lang="ts">
import {computed} from 'vue'
import {useAudioStore} from '@/stores/audioStore'
import { useLibraryStore } from '@/stores/libraryStore';
import { fmt } from '@/utils/format';


 const audio = useAudioStore()
 const library = useLibraryStore()

 const title = computed(() =>{
    const idx = useAudioStore.curIdx
    return idx >= 0 ? useLibraryStore.library[idx]?.name : '等待数据接入'
 })

 

</script>