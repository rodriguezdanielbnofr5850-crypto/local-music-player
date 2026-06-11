<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="pop show"
      :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
    >
      <div
        v-for="d in libraryStore.dirs"
        :key="d.id"
        class="pop-item"
        @click="onSelect(d.id)"
      >
        <img src="@/assets/file.png" alt="" class="file-logo" />
        {{ d.name }}
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLibraryStore } from '@/stores/libraryStore'

const libraryStore = useLibraryStore()

const visible = ref(false)
const pos = reactive({ x: 0, y: 0 })
let currentSongId: string | null = null

function open(songId: string, anchorEl: HTMLElement) {
  currentSongId = songId
  const rect = anchorEl.getBoundingClientRect()
  pos.x = rect.right
  pos.y = rect.top
  visible.value = true
}

function close() {
  visible.value = false
  currentSongId = null
}

async function onSelect(dirId: string) {
  if (currentSongId) {
    await libraryStore.moveSong(currentSongId, dirId)
  }
  close()
}

// 点击外部关闭
function onDocClick(e: MouseEvent) {
  if (visible.value) close()
}

document.addEventListener('click', onDocClick)

defineExpose({ open, close })
</script>

<style scoped>
.pop {
  position: fixed;
  background: #12121a;
  border: 1px solid rgba(0, 243, 255, 0.3);
  border-radius: 12px;
  padding: 8px 0;
  min-width: 140px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 243, 255, 0.1);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}
.pop::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 12px;
  width: 12px;
  height: 12px;
  background: #12121a;
  border-left: 1px solid rgba(0, 243, 255, 0.3);
  border-top: 1px solid rgba(0, 243, 255, 0.3);
  transform: rotate(45deg);
  z-index: -1;
}
.pop-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 0.8rem;
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.pop-item .file-logo {
  height: 18px;
  width: auto;
  opacity: 0.8;
}
.pop-item:hover {
  background: rgba(0, 243, 255, 0.12);
  color: var(--neon-cyan);
  text-shadow: 0 0 4px rgba(0, 243, 255, 0.3);
}
</style>