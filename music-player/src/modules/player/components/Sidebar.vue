<template>
  <div class="Sidebar">
    <div class="top-bar">
      <div class="brand">
        <img src="@/assets/图标3.png" alt="logo" class="brand-logo" />
        <span class="glitch-text" data-text="音乐都市">音乐都市</span>
      </div>
      <div class="badge">● 在线</div>
    </div>

    <NowPlayingCard />

    <SearchBar />
    <DirBar />
    <ImportArea />

    <div class="list-head">
      <span>◉ 播放列表</span>
      <span>{{ libraryStore.filteredList.length }} 首歌曲</span>
    </div>

    <div class="scroll-list">
      <div v-if="!libraryStore.filteredList.length" class="empty">等待神经连接</div>
      <div
        v-for="(s, idx) in libraryStore.filteredList"
        :key="s.id"
        class="row"
        :class="{ on: s._globalIdx === audioStore.curIdx }"
        @click="onRowClick(s._globalIdx)"
      >
        <div class="num">{{ idx + 1 }}</div>
        <div class="t">
          <div class="title">{{ s.name }}</div>
          <div class="sub">{{ s.artist }}{{ s._dirName ? ' · ' + s._dirName : '' }}</div>
        </div>
        <div class="acts">
          <button class="mv" title="移动" @click.stop="onMove(s.id, $event)">
            <img src="@/assets/file.png" alt="" class="file-logo" />
          </button>
          <button class="rm" title="删除" @click.stop="onDelete(s.id)">🗑</button>
        </div>
      </div>
    </div>

    <Popnumenu ref="popRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLibraryStore } from '@/modules/player/stores/libraryStore.ts'
import { useAudioStore } from '@/modules/player/stores/audioStore.ts'
import NowPlayingCard from './NowPlayingCard.vue'
import SearchBar from './SearchBar.vue'
import DirBar from './DirBar.vue'
import ImportArea from './ImportArea.vue'
import Popnumenu from './Popnumenu.vue'

const libraryStore = useLibraryStore()
const audioStore = useAudioStore()
const popRef = ref<InstanceType<typeof Popnumenu> | null>(null)

function onRowClick(globalIdx: number) {
  audioStore.playByIndex(globalIdx)
}

function onMove(songId: string, e: Event) {
  popRef.value?.open(songId, e.target as HTMLElement)
}

async function onDelete(songId: string) {
  if (!confirm('确定要删除这条神经信号吗？')) return
  const removedIdx = await libraryStore.removeSong(songId)
  if (removedIdx !== -1 && removedIdx === audioStore.curIdx) {
    audioStore.stopAndReset()
  } else if (removedIdx !== -1 && removedIdx < audioStore.curIdx) {
    audioStore.curIdx--
  }
}
</script>

<style scoped>
.Sidebar {
  width: 420px;
  min-width: 340px;
  background-color: var(--bg-panel);
  border-right: 1px solid var(--panel-border);
  display: flex;
  flex-direction: column;
  padding: 22px;
  gap: 14px;
}
.top-bar {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 243, 255, 0.15);
  padding: 8px;
  margin-bottom: 2px;
}
.brand {
  font-size: 1.1rem;
  color: var(--neon-cyan);
  text-shadow: 0 0 8px rgba(0, 243, 255, 0.45);
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  letter-spacing: 2px;
}
.brand-logo {
  width: auto;
  height: 2.1em;
  margin-right: 8px;
}
.glitch-text {
  position: relative;
  display: inline-block;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  color: transparent;
}
.brand:hover .glitch-text::before {
  animation: glitch-1 0.3s infinite linear alternate-reverse;
  color: var(--neon-cyan);
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
}
@keyframes glitch-1 {
  0% { transform: translateX(0); }
  100% { transform: translateX(-2px); }
}
.brand:hover .glitch-text::after {
  animation: glitch-2 0.3s infinite linear alternate-reverse;
  color: var(--neon-pink);
  clip-path: polygon(0 0, 100% 65%, 100% 100%, 0 100%);
}
@keyframes glitch-2 {
  0% { transform: translateX(0); }
  100% { transform: translateX(2px); }
}
.badge {
  font-size: 0.65rem;
  color: var(--neon-pink);
  text-shadow: 0 0 4px rgba(255, 0, 255, 0.4);
  letter-spacing: 1px;
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.list-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  color: var(--neon-pink);
  padding: 0 4px;
}
.list-head span:last-child { color: var(--text-dim); }
.scroll-list {
  flex: 1;
  display: flex;
  padding-right: 2px;
  gap: 3px;
  flex-direction: column;
  color: var(--neon-pink);
  overflow-y: auto;
}
.empty {
  text-align: center;
  padding: 30px;
  color: var(--text-dim);
  font-size: 0.85rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: 0.15s;
  position: relative;
}
.row:hover {
  background: rgba(0, 243, 255, 0.04);
  border-color: rgba(0, 243, 255, 0.08);
}
.row.on {
  background: rgba(0, 243, 255, 0.06);
  border-left: 2px solid var(--neon-cyan);
}
.row.on .num { color: var(--neon-cyan); text-shadow: 0 0 6px rgba(0, 243, 255, 0.4); }
.row.on .t .title { color: var(--neon-cyan); }
.num {
  width: 22px;
  font-size: 0.72rem;
  color: var(--text-dim);
  text-align: right;
}
.t { flex: 1; min-width: 0; }
.t .title {
  font-size: 0.82rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-main);
}
.t .sub {
  font-size: 0.68rem;
  color: var(--text-dim);
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.acts { display: none; gap: 6px; margin-left: 6px; }
.row:hover .acts { display: flex; }
.acts button {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 2px;
}
.acts button:hover { color: var(--neon-pink); }
.acts .file-logo { height: 18px; width: auto; opacity: 0.8; }
</style>