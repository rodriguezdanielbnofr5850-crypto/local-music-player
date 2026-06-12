<template>
  <div class="search-wrap">
    <span class="search-ico">⌕</span>
    <input id="searchInp" type="text" placeholder="搜索曲目或作者..." :value="libraryStore.kw" @input="onInput" />
    <button v-if="libraryStore.kw" id="clearSearch" @click="clearSearch">✕</button>
  </div>
</template>
<script setup lang="ts">
import { useLibraryStore } from '@/modules/player/stores/libraryStore'

const libraryStore = useLibraryStore()

function onInput(e: Event) {
  libraryStore.kw = (e.target as HTMLInputElement).value
}

function clearSearch() {
  libraryStore.kw = ''
}
</script>
<style scoped>
.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, .25);
  border: 1px solid rgba(0, 243, 255, .12);
  border-radius: 8px;
  padding: 8px 10px;
}

.search-wrap:focus-within {
  border-color: rgba(0, 243, 255, .35);
}

#searchInp {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-main);
  font-family: inherit;
  font-size: .85rem;
}

.search-ico {
  color: var(--neon-cyan);
  font-size: .9rem;
}

#clearSearch {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: .8rem;
}

#clearSearch:hover {
  color: var(--neon-pink);
}
</style>