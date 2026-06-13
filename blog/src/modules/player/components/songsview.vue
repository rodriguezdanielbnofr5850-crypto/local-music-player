<script setup lang="ts">
import { computed } from 'vue'
import { useLibraryStore } from '@/stores/libraryStore'
import { useAudioStore } from '@/stores/audioStore'
import { useRouter } from 'vue-router'

const libraryStore = useLibraryStore()
const audioStore = useAudioStore()
const router = useRouter()

function goBack() {
  // 返回歌单列表时，清空搜索关键词
  libraryStore.kw = ''
  router.push('/player/playlists')
}

function playSong(globalIdx: number) {
  audioStore.playByIndex(globalIdx)
}

async function removeSong(id: string) {
  if (!confirm('确定要删除这条神经信号吗？')) return
  const removedIdx = await libraryStore.removeSong(id)
  if (removedIdx !== -1 && removedIdx === audioStore.curIdx) {
    audioStore.stopAndReset()
  } else if (removedIdx !== -1 && removedIdx < audioStore.curIdx) {
    audioStore.curIdx--
  }
}

// 获取当前歌单信息（用于展示封面和名字）
const curDirInfo = computed(() => {
  if (libraryStore.curDir === 'all') {
    return { name: '全部神经信号', cover: '' }
  }
  return libraryStore.dirs.find(d => d.id === libraryStore.curDir) || { name: '未知歌单', cover: '' }
})

const totalPlayCount = computed(() => libraryStore.getTotalPlayCount().toLocaleString())
</script>

<template>
  <div class="songs-view">
    <!-- 1. 顶部导航栏 (返回按钮 + 搜索框) -->
    <div class="top-nav">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="goBack" title="返回">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <!-- 动效搜索框 (融入了你提供的结构，并绑定了 v-model) -->
      <div class="search-container">
        <input 
          type="text" 
          v-model="libraryStore.kw" 
          class="search-input" 
          required 
          placeholder=""
        >
        <div class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
            <title>Search</title>
            <path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path>
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 滚动区域 (包含歌单信息和歌曲列表) -->
    <div class="scroll-content">
      
      <!-- 2. 歌单展示区 (左侧封面，右侧信息) -->
      <div class="playlist-banner">
        <div class="banner-cover">
          <!-- 如果有封面则显示，没有则显示默认渐变色块 -->
          <img v-if="curDirInfo.cover" :src="curDirInfo.cover" />
          <div v-else class="default-cover">🎵</div>
        </div>
        <div class="banner-info">
          <h1 class="banner-title">{{ curDirInfo.name }}</h1>
          <div class="banner-stats">
            <span>{{ libraryStore.filteredList.length }} 首曲目</span>
            <span>播放 {{ totalPlayCount }} 次</span>
          </div>
        </div>
      </div>

      <!-- 3. 歌曲列表区 -->
      <div class="sv-list">
        <div v-if="!libraryStore.filteredList.length" class="sv-empty">
          {{ libraryStore.kw ? '没有找到匹配的信号' : '该歌单下无神经信号' }}
        </div>
        
        <div
          v-for="(s, idx) in libraryStore.filteredList"
          :key="s.id"
          class="sv-row"
          :class="{ on: s._globalIdx === audioStore.curIdx }"
          @click="playSong(s._globalIdx)"
        >
          <div class="sv-num">{{ idx + 1 }}</div>
          <div class="sv-info">
            <div class="sv-name">{{ s.name }}</div>
            <div class="sv-artist">{{ s.artist }}</div>
          </div>
          <div class="sv-acts">
            <button class="sv-rm" @click.stop="removeSong(s.id)" title="删除">🗑</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 根容器布局 */
.songs-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: transparent;
}

/* ================= 1. 顶部导航栏 ================= */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  /* border-bottom: 1px solid rgba(0, 243, 255, .1); 删掉下划线更显现代感 */
  z-index: 10;
}

.back-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(0, 243, 255, 0.15);
  color: var(--neon-cyan, #00f3ff);
  transform: translateX(-2px);
}

/* 动效搜索框 (适配版) */
.search-container {
  position: relative;
  --size-button: 36px; /* 略微调小一点适应导航栏高度 */
  color: white;
}

.search-input {
  padding-left: var(--size-button);
  height: var(--size-button);
  font-size: 14px;
  border: none;
  color: #fff;
  outline: none;
  width: var(--size-button);
  transition: all ease 0.3s;
  background-color: #191A1E;
  box-shadow: 1.5px 1.5px 3px #0e0e0e, -1.5px -1.5px 3px rgb(95 94 94 / 25%), inset 0px 0px 0px #0e0e0e, inset 0px -0px 0px #5f5e5e;
  border-radius: 50px;
  cursor: pointer;
}

.search-input:focus,
.search-input:not(:invalid) {
  width: 200px; /* 展开后的宽度 */
  cursor: text;
  box-shadow: 0px 0px 0px #0e0e0e, 0px 0px 0px rgb(95 94 94 / 25%), inset 1.5px 1.5px 3px #0e0e0e, inset -1.5px -1.5px 3px #5f5e5e;
}

.search-input:focus + .search-icon,
.search-input:not(:invalid) + .search-icon {
  pointer-events: all;
  cursor: pointer;
}

.search-container .search-icon {
  position: absolute;
  width: var(--size-button);
  height: var(--size-button);
  top: 0;
  left: 0;
  padding: 8px;
  pointer-events: none;
}

.search-container .search-icon svg {
  width: 100%;
  height: 100%;
}

/* ================= 滚动内容区 ================= */
.scroll-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
}

/* ================= 2. 歌单信息展示区 ================= */
.playlist-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 0 25px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 10px;
}

.banner-cover {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.banner-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-cover {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #14b8a6, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.banner-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #fff;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.banner-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ================= 3. 歌曲列表区 ================= */
.sv-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 20px;
}

.sv-empty {
  text-align: center;
  padding: 40px;
  color: var(--text-dim, #888);
  font-size: .9rem;
}

.sv-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: .2s;
}

.sv-row:hover {
  background: rgba(0, 243, 255, .04);
  border-color: rgba(0, 243, 255, .08);
}

.sv-row.on {
  background: rgba(0, 243, 255, .08);
}

.sv-row.on .sv-num { color: var(--neon-cyan, #00f3ff); text-shadow: 0 0 8px rgba(0, 243, 255, .4); }
.sv-row.on .sv-name { color: var(--neon-cyan, #00f3ff); font-weight: bold; }

.sv-num {
  width: 24px;
  font-size: .85rem;
  color: var(--text-dim, #888);
  text-align: center;
  font-weight: 500;
}

.sv-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sv-name {
  font-size: .9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-main, #eee);
  margin-bottom: 3px;
}

.sv-artist {
  font-size: .75rem;
  color: var(--text-dim, #888);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sv-acts {
  opacity: 0; /* 默认隐藏删除按钮，防误触 */
  gap: 6px;
  margin-left: 6px;
  transition: opacity 0.2s;
}

.sv-row:hover .sv-acts { opacity: 1; }

.sv-rm {
  background: none;
  border: none;
  color: var(--text-dim, #888);
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  border-radius: 4px;
  transition: .15s;
}

.sv-rm:hover { 
  color: #ff4545; 
  background: rgba(255, 69, 69, 0.1);
}
</style>