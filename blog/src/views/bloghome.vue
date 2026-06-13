<template>
  <div class="app-flex">
    <div class="hero-section"></div>
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
.app-flex {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #000;
  /* ❌ 删除 background-image 和 background-attachment: fixed */
}

/* ✅ 固定背景图 — 用 fixed 伪元素，滚到哪里都铺满视口 */
.app-flex::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/木叶创立.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

/* ✅ 固定遮罩 — 同样 fixed，不会出现黑框 */
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

/* 子元素在遮罩之上 */
.app-flex > * {
  position: relative;
  z-index: 2;
}

/* Hero 全屏占位 */
.hero-section {
  width: 100%;
  height: 100vh;
}

/* ✅ 保留你原来的 flex + absolute 布局 */
.main-body {
  display: flex;
  position: relative;
  min-height: 100vh;
}

.cards-wrapper {
  position: absolute;
  right: 400px;
  top: 25%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.6s ease;
}
.cards-wrapper.visible {
  opacity: 1;
}

.content {
  flex: 1;
  padding-right: 340px;
}

.sticky-card {
  width: 300px;
}
.info-card {
  background-color: white;
  width: 200px;
}
</style>