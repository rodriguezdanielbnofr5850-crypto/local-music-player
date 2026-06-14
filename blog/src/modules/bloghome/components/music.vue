<template>
  <div class="main-music-card">
    <div class="track-info" @click="goToPlayer">
      <div class="album-art">
        <img v-if="currentCover" :src="currentCover" alt="cover" class="album-img" />
        <div v-else class="album-placeholder">🎵</div>
      </div>
      <div class="track-details" ref="titleContainer">
        <div class="track-title" ref="titleText">{{ currentSongName || 'No Signal' }}</div>
        <div class="artist-name">{{ currentArtist || 'System Idle' }}</div>
      </div>
      <!-- 纯 CSS 音量条动画（不变） -->
      <div class="volume-bars">
        <div class="bar" style="--delay:0s"></div>
        <div class="bar" style="--delay:0.1s"></div>
        <div class="bar" style="--delay:0.2s"></div>
        <div class="bar" style="--delay:0.3s"></div>
        <div class="bar" style="--delay:0.4s"></div>
        <div class="bar" style="--delay:0.5s"></div>
        <div class="bar" style="--delay:0.6s"></div>
        <div class="bar" style="--delay:0.7s"></div>
      </div>
    </div>

    <div class="playback-controls" @click.stop>
      <div class="time-info">
        <span class="current-time">{{ formatTime(currentTime) }}</span>
        <span class="remaining-time">{{ formatTime(duration - currentTime) }}</span>
      </div>
      <div class="progress-bar" @click="handleProgressClick">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        <div class="progress-handle" :style="{ left: progressPercent + '%' }"></div>
      </div>
      <div class="button-row">
        <div class="main-control-btns">
          <button class="control-button back" @click="audioStore.prev">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-skip-backward-fill" viewBox="0 0 16 16">
              <path d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V8.753l6.267 3.636c.54.313 1.233-.066 1.233-.697v-2.94l6.267 3.636c.54.314 1.233-.065 1.233-.696V4.308c0-.63-.693-1.01-1.233-.696L8.5 7.248v-2.94c0-.63-.692-1.01-1.233-.696L1 7.248V4a.5.5 0 0 0-.5-.5" />
            </svg>
          </button>
          <div class="play-pause-btns">
            <button class="control-button play-pause-button" @click="audioStore.togglePlay">
              <svg v-if="paused" class="icon-play" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.596 8.697l-6.363 3.692c-.54.314-1.233-.065-1.233-.696V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
              </svg>
              <svg v-else class="icon-pause" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
              </svg>
            </button>
          </div>
          <button class="control-button next" @click="audioStore.next">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-skip-forward-fill" viewBox="0 0 16 16">
              <path d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5" />
            </svg>
          </button>
        </div>
        <button class="control-button d" @click="toggleShuffle" :class="{ active: audioStore.isShuffle }">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-radar" viewBox="0 0 16 16">
            <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed,ref,onMounted,nextTick,watch} from 'vue'
import { useRouter } from 'vue-router'
import { useAudioStore } from '@/stores/audioStore'
import { useLibraryStore } from '@/stores/libraryStore'

const router = useRouter()
const audioStore = useAudioStore()
const libraryStore = useLibraryStore()


const titleContainer = ref<HTMLElement>()
const titleText = ref<HTMLElement>()
const titleFontSize = ref('1.3rem') 

// 当前歌曲信息
const currentSong = computed(() => audioStore.currentSong)
const currentSongName = computed(() => currentSong.value?.name || 'No Signal')
const currentArtist = computed(() => currentSong.value?.artist || 'System Idle')
const currentCover = computed(() => audioStore.currentCoverUrl)

// 播放状态
const paused = computed(() => audioStore.paused)
const currentTime = computed(() => audioStore.currentTime)
const duration = computed(() => audioStore.duration)
const progressPercent = computed(() => audioStore.progressPercent)

async function adjustFontSize() {
  if (!titleContainer.value || !titleText.value) return
  const container = titleContainer.value
  const text = titleText.value

  // 先设为最大字号
  text.style.fontSize = '1.3rem'
  await nextTick()

  // 如果溢出，逐渐缩小
  let fontSize = 1.3 * 16 // 转 px
  while (text.scrollWidth > container.clientWidth && fontSize > 12) {
    fontSize -= 0.5
    text.style.fontSize = `${fontSize}px`
  }
  // 保留最小 12px，防止无限小
}

watch(currentSongName, () => {
  adjustFontSize()
})

onMounted(() => {
  adjustFontSize()
})

// 格式化时间
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === undefined) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' + secs : secs}`
}

// 点击进度条跳转
function handleProgressClick(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  audioStore.seek(percent)
}

// 切换随机模式
function toggleShuffle() {
  audioStore.toggleMode('shuffle')
}

// 跳转到完整播放器
function goToPlayer() {
  router.push('/player')
}
</script>

<style scoped>
/* 保持原样式，只需确保 .volume-bars .bar 的动画不受播放状态影响（始终运行） */
.main-music-card {
  width: 100%; 
  padding: 18px;
  border-radius: 35px;
  background: #1a1a1a;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: -apple-system, system-ui, sans-serif;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.album-art {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
  transition: transform 0.3s ease;
  overflow: hidden;
}
.album-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.album-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

/* 纯 CSS 音量条动画（始终运行） */
.volume-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  width: 38px;
  height: 32px;
}
.volume-bars .bar {
  width: 3px;
  background: linear-gradient(180deg, #00c6ff, #0072ff);
  border-radius: 2px;
  animation: bounce 0.8s infinite ease-in-out;
  animation-delay: var(--delay);
}
@keyframes bounce {
  0%, 100% {
    height: 6px;
  }
  50% {
    height: 26px;
  }
}

.track-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.track-details {
  flex-grow: 1;
  overflow: hidden;
}
.track-title {
  display: inline-block;    
  width: max-content;        
  white-space: nowrap;
  overflow: visible;        
  font-size: clamp(0.9rem, 4vw, 1.3rem);
  font-weight: 600;
}

.artist-name {
  font-size: 0.9em;
  color: #d1d1d6;
  margin-top: 2px;
}

/* 进度条 */
.progress-bar {
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  border-radius: 2px;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}
.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.time-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
  color: #8e8e93;
}
.button-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.control-button {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
  color: #fff;
}
.control-button.play-pause-button:hover,
.control-button.d:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}
.main-control-btns {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10%;
  gap: 20%;
}
.control-button.active {
  color: #00c6ff;
  text-shadow: 0 0 5px #00c6ff;
}
</style>