<script setup lang="ts">
import { useLibraryStore } from '@/stores/libraryStore';
  const libraryStore = useLibraryStore()

  function switchDir(dirId: string) {
  libraryStore.curDir = dirId
  libraryStore.kw = ''
}
</script>

<template>
  <div class="dir-bar">
    <div 
    class="dir-chip"
    :class="{on: useLibraryStore.curDir === 'all'}"
    @click="switchDir('all')">
  <img src="@/assets/file.png" alt="" class="file-logo"/>全部
<span style="opacity: 0.7;">{{ libraryStore.library.length }}</span></div>
<div v-for="d in libraryStore.dirs"
:key="d.id"
class="dir-chip"
:class="{on: libraryStore.curDir === d.id}"
@click="switchDir(d.id)"></div></div>
</template>