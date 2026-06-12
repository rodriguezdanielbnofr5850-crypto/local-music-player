<template>
  <div
    class="now-card"
    :class="{ paused: audio.paused }"
    @click="audio.togglePlay()"
  >
    <div class="viz">
      <i></i><i></i><i></i><i></i>
    </div>
    <div class="now-mate">
      <div class="now-title">{{ title }}</div>
      <div class="now-artist">{{ artist }}</div>
    </div>
    <div class="now-time">{{ nowtime }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAudioStore } from '@/modules/player/stores/audioStore'
import { fmt } from '@/modules/player/utils/format'

const audio = useAudioStore()
const title = computed(() => audio.currentSong?.name ?? '等待数据接入...')
const artist = computed(() => audio.currentSong?.artist ?? '...')
const nowtime = computed(() => `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`)
</script>

<style scoped>
.now-card {
  background: rgba(0, 243, 255, 0.04);
  border: 1px solid rgba(0, 243, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: 0.2s;
}
.now-card:hover {
  border-color: rgba(0, 243, 255, 0.35);
  box-shadow: 0 0 12px rgba(0, 243, 255, 0.08);
}
.viz {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
}
.viz i {
  display: block;
  width: 3px;
  background: var(--neon-cyan);
  border-radius: 2px;
  animation: viz 0.9s ease-in-out infinite;
}
.viz i:nth-child(1) { height: 40%; animation-delay: 0s; }
.viz i:nth-child(2) { height: 70%; animation-delay: 0.15s; }
.viz i:nth-child(3) { height: 50%; animation-delay: 0.3s; }
.viz i:nth-child(4) { height: 90%; animation-delay: 0.05s; }
@keyframes viz {
  0%, 100% { height: 20%; }
  50% { height: 100%; }
}
.viz.paused i {
  animation-play-state: paused;
  opacity: 0.3;
}
.now-mate {
  flex: 1;
  min-width: 0;
}
.now-title {
  font-size: 0.85rem;
  color: var(--neon-cyan);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.now-artist {
  font-size: 0.7rem;
  color: var(--text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.now-time {
  font-size: 0.7rem;
  color: var(--neon-pink);
  white-space: nowrap;
  margin-left: 6px;
}
</style>