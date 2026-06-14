<template>
  <div class="app-flex">
    <div class="hero-section">
      <div class="typewriter">
        <span ref="typeText"></span>
        <span class="cursor">|</span>
      </div>
    </div>
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
import { ref, onMounted, onUnmounted,nextTick } from 'vue'

const cardsWrapper = ref<HTMLElement | null>(null)
const typeText = ref<HTMLElement | null>(null)

const text = '欢迎来到我的个人空间'
let index = 0
let timer: ReturnType<typeof setTimeout>
nextTick(() => {
    console.log('typeText:', typeText.value)  // ← 调试用
    typeWriter()
  })

function typeWriter() {
    if (!typeText.value) {
    console.log('typeText is null')  // ← 调试用
    return
  }
  if (index < text.length) {
    typeText.value.textContent += text.charAt(index)
    index++
    timer = setTimeout(typeWriter, 150)
  }
}
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
  typeWriter()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(timer)
})
</script>

<style>
.app-flex {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #000;
}

.hero-section {
  width: 100%;
  height: 100vh;
  display: flex;              /* ← 加这行 */
  align-items: center;        /* ← 垂直居中 */
  justify-content: center;    /* ← 水平居中 */
}

.typewriter {
  font-size: 32px;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  position: relative;        /* ← 加这行 */
  z-index: 3;
}

.typewriter .cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
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

/* ✅ 保留你原来的 flex + absolute 布局 */
.main-body {
  display: flex;
  position: relative;
  min-height: 100vh;
}

.cards-wrapper {
  position: absolute;
  right: 1000px;
  top: 45%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;     /* ← 从 row 改为 column，同列排列 */
  align-items: center;         /* ← 居中对齐 */
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
</style>