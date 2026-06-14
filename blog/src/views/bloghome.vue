<template>
  <div class="app-flex">
    <!-- 第一屏：大标题 + 背景图 -->
    <div class="hero-section">
      <TextEffect />

      <!-- 白色波浪（放在 hero 最底部） -->
      <div class="wave-container">
        <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g class="parallax">
            <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
            <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
    </div>

    <!-- 第二屏：博客内容区（白色背景，接住波浪） -->
    <div class="main-body">
      <section class="content"><!-- 其他组件 --></section>
      <div class="cards-wrapper" ref="cardsWrapper">
        <information class="info-card" />
        <player class="sticky-card" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Information from '@/modules/bloghome/components/information.vue';
import player from '@/modules/bloghome/components/music.vue'
import TextEffect from '@/modules/bloghome/components/text.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const cardsWrapper = ref<HTMLElement | null>(null)

const handleScroll = () => {
  if (!cardsWrapper.value) return
  const rect = cardsWrapper.value.getBoundingClientRect()
  if (rect.top < window.innerHeight) {
    cardsWrapper.value.classList.add('visible')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* ========= 全局背景 & 布局 ========= */
.app-flex {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #000;
}

.hero-section {
  position: relative;          /* 让波浪相对它定位 */
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 固定背景图（全屏） */
.app-flex::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/木叶创立.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

/* 固定遮罩层 */
.app-flex::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
}

/* 确保所有子元素在遮罩上面 */
.app-flex > * {
  position: relative;
  z-index: 2;
}

/* ========= 下方内容区（白色背景，接住波浪） ========= */
.main-body {
  display: flex;
  position: relative;
  min-height: 100vh;
  background-color: #fff;     /* 白色背景，和波浪底部无缝衔接 */
  z-index: 3;                 /* 确保在遮罩上面 */
}

/* ========= 右侧卡片容器 ========= */
.cards-wrapper {
  position: absolute;
  right: 1000px;              /* 根据你的设计可自行调整 */
  top: 45%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.6s ease;
  width: 300px;
}

.cards-wrapper.visible {
  opacity: 1;
}

.content {
  flex: 1;
  padding-right: 340px;
}

.sticky-card {
  width: 100%;
}

.info-card {
  width: 100%;
}

/* ========= 波浪样式 ========= */
.wave-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 5;               /* 盖在遮罩上方，但低于卡片 */
  overflow: hidden;
  line-height: 0;
}

.waves {
  position: relative;
  width: 100%;
  height: 15vh;
  min-height: 100px;
  max-height: 150px;
}

/* 波浪动画 */
.parallax > use {
  animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

/* ========= 移动端微调 ========= */
@media (max-width: 768px) {
  .waves {
    height: 40px;
    min-height: 40px;
  }
  .cards-wrapper {
    right: 20px;   /* 小屏幕时别太远 */
  }
}
</style>