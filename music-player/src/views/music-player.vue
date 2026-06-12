<template>
  <div class="app-container">
    <audio ref="audioRef" style="display:none" />
    <Sidebar />
    <Mainplayer />
    <Popnumenu />
  </div>
</template>

<style>
:root {
  --neon-cyan: #00f3ff;
  --neon-pink: #ff00ff;
  --neon-purple: #bc13fe;
  --bg-dark: #07070a;
  --bg-panel: #0e0e14;
  --panel-border: rgba(0, 243, 255, 0.08);
  --text-main: #e0e0e8;
  --text-dim: #6b6b8a;
  --font-mono: 'Courier New', Courier, 'SF Mono', Monaco, monospace;
}
* { margin: 0; padding: 0; box-sizing: border-box; user-select: none; }
body {
  background: var(--bg-dark);
  color: var(--text-main);
  font-family: var(--font-mono);
  height: 100vh;
  overflow: hidden;
  display: flex;
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0, 243, 255, 0.25); border-radius: 3px; }
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--bg-dark);
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/modules/player/components/Sidebar.vue'
import Mainplayer from '@/modules/player/components/Mainplayer.vue'
import Popnumenu from '@/modules/player/components/Popnumenu.vue'
import { useLibraryStore } from '@/modules/player/stores/libraryStore.ts'
import { useAudioStore } from '@/modules/player/stores/audioStore.ts'

const libraryStore = useLibraryStore()
const audioStore = useAudioStore()
const audioRef = ref<HTMLAudioElement | null>(null)

onMounted(async () => {
  audioStore.setAudioElement(audioRef.value)
  await libraryStore.loadDate()
  audioStore.restoreFromLocalStorage()
})
</script>