<template>
  <div class="drop-area" :class="{ dragover }" @dragover.prevent="dragover = true" @dragleave="dragover = false"
    @drop.prevent='onDrop'>
  <div>
    <img src="@/assets/file.png" alt="" class="file-logo" /> 拖拽音频文件至此
  </div>
  <div class="import-btns">
    <button class="import-btn" @click="selectFiles">添加单曲</button>
    <button class="import-btn" @click="selectDir">添加文件夹</button>
  </div>
  </div>
  <input ref="fileInput" type="file" multiple accept="audio/*" style="display: none" @change="onFileChange">
  <input ref="dirInput" type="file" multiple webkitdirectory style="display: none;" @change="onDirChange">
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useLibraryStore } from '@/modules/player/stores/libraryStore'

const libraryStore = useLibraryStore()

const dragover = ref(false)
const fileInput = ref < HTMLInputElement | null > (null)
const dirInput = ref < HTMLInputElement | null > (null)

function selectFiles() {
  fileInput.value?.click()
}
function selectDir() {
  dirInput.value?.click()
}

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files) libraryStore.addSongs(files)
  if (fileInput.value) fileInput.value.value = ''
}
function onDirChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files) libraryStore.addSongs(files)
  if (dirInput.value) dirInput.value.value = ''
}
function onDrop(e: DragEvent) {
  dragover.value = false
  if (e.dataTransfer?.files) {
    libraryStore.addSongs(e.dataTransfer.files)
  }
}
</script>


<style>
.drop-area>div:first-child {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.drop-area {
  border: 1px dashed rgba(0, 243, 255, .18);
  border-radius: 8px;
  padding: 14px 10px;
  text-align: center;
  font-size: .8rem;
  color: var(--text-dim);
  transition: .2s;
  position: relative;
}

.file-logo {
  height: 25px;
  width: auto;
  display: block;
}

.import-btns {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.import-btn {
  background: rgba(0, 243, 255, .05);
  border: 1px solid rgba(0, 243, 255, .2);
  color: var(--neon-cyan);
  padding: 5px 12px;
  border-radius: 4px;
  font-size: .75rem;
  cursor: pointer;
  font-family: inherit;
  transition: 0.2s;
}

.import-btn:hover {
  background: rgba(0, 243, 255, .15);
  box-shadow: 0 0 10px rgba(0, 243, 255, .2);
}
</style>