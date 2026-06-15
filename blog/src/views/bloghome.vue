<template>
  <div class="app-flex">
    <!-- 第一屏：大标题 + 背景图 -->
    <div class="hero-section">
      <TextEffect />
      <div class="wave-container"> <svg class="waves" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none"
          shape-rendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g class="parallax">
            <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
            <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg></div>
    </div>

    <!-- 第二屏：白色内容区 -->
    <div class="main-body" ref="mainBody">
      <!-- 改用双栏网格布局，替代绝对定位 -->
      <div class="two-columns">
        <!-- 左侧：卡片列（information + player） -->
        <aside class="left-column">
          <Information class="info-card" />
          <player class="sticky-card" />
        </aside>

    <div class="right-column">
    <div class="top-row">
      <div class="album-container">
        <ImageSlider :images="albumImages" />
      </div>
       <WeatherCard address="武汉" class="weather-card-comp" />
    </div>
    <div class="articles-section">
      <ArticleShow :articles="articles" />
    </div>
  </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Information from '@/modules/bloghome/components/information.vue';
import player from '@/modules/bloghome/components/music.vue'
import TextEffect from '@/modules/bloghome/components/text.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import ImageSlider from '@/modules/bloghome/components/image.vue'
import ArticleShow from '@/modules/bloghome/components/article_show.vue'
import WeatherCard from '@/modules/bloghome/components/weatherCard.vue'
import img1 from '@/assets/home.webp'
import img2 from '@/assets/think.webp'
import img3 from '@/assets/play.webp'
import img4 from '@/assets/myself.webp'
import img5 from '@/assets/myself2.webp'
import img6 from '@/assets/party.webp'
import img7 from '@/assets/classmates.webp'
import img8 from '@/assets/school.webp'
const cardsWrapper = ref<HTMLElement | null>(null)
const mainBody = ref<HTMLElement | null>(null)
const handleScroll = () => {
  if (!mainBody.value) return
  const rect = mainBody.value.getBoundingClientRect()
  if (rect.top < window.innerHeight) {
    mainBody.value.classList.add('visible')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
const articles = ref([
  {
    id: 1,
    title: '无',
    type: '无',
    date: '2026-06-15',
    readTime: '无',
    excerpt: '无',
    tags: ['', ''],
    cover: '',
    layout: 'horizontal'    // 新增：横向卡片
  },
  {
    id: 2,
    title: '无',
    type: '无',
    date: '2026-06-15',
    readTime: '无',
    excerpt: '无',
    tags: ['', ''],
    cover: '',
    layout: 'vertical'      // 纵向卡片
  },
  {
    id: 3,
    title: '无',
    type: '无',
    date: '2026-06-15',
    readTime: '无',
    excerpt: '无',
    tags: ['', ''],
    cover: '',
    layout: 'reverse-horizontal'  // 反向横向
  },
  {
    id: 4,
    title: '无',
    type: '无',
    date: '2026-06-15',
    readTime: '无',
    excerpt: '无',
    tags: ['', ''],
    cover: '',
    layout: 'horizontal'    // 新增：横向卡片
  },
])
const albumImages = [
  {
    url: img1, description: `劳动节回了一趟老家,在田地给奶奶抓拍了张照片
    奶奶当时笑得很开心` },
  {
    url: img2, description: `当时刚刚中考完特地换了张头像,之后就再也没换过
   挑了好久因为当时觉得头像是一件很重要的事情
   最后冥冥之中选了这张的特写` },
  {
    url: img3, description: `第一次研学在外面住，和朋友玩到一点
    高中为数不多觉得还挺开心的事情`},
  { url: img4, description: `为数不多拍出来自己都觉得蛮好看的照片` },
  { url: img5, description: `老实说我是宿舍最宅的，每天都呆在宿舍，每次室友回来第一句话都是咋又你一个人在宿舍` },
  {
    url: img6, description: `大学里的第一次团建，关系都还不错
    希望大二的室友也能相处的来` },
  {
    url: img7, description: `这一排都是我高中的同学，老实说几乎全做过同桌
    可惜大学几乎再也没有交流了`},
  {
    url: img8, description: `高二当时真心觉得自己可以考上这种层次
    后来心气全散了，完全没有提升的想法了，得过且过，安于现状，但老实说并不后悔` },
]
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
  position: relative;
  /* 让波浪相对它定位 */
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
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
.app-flex>* {
  position: relative;
  z-index: 2;
}

.main-body {
  display: block;
  padding: 80px 5% 60px 270px;
  background: #fff;
}

.two-columns {
  display: flex;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 右侧栏：自适应，内部相册 + 文章列表 */
.right-column {
  flex: 1;
  min-width: 0; /* 防止溢出 */
}
.top-row {
  display: flex;
  gap: 16px;             
  align-items: stretch;
  margin-bottom: 48px;
}
.weather-card-comp {
  width: 280px;           /* 设置固定宽度，例如 280px */
  flex: 0 0 auto;  
  align-self: stretch; 
}
/* 确保文章列表宽度与 top-row 一致 */
.articles-section {
  width: 100%;
}

/* 修复相册宽度 */
.album-container {
  width: 500px;
  max-width: 100%;
  flex-shrink: 0;
}

/* 左侧粘性效果 */
.left-column {
  width: 320px;
  flex-shrink: 0;
}
/* 移动端调整 */
@media (max-width: 768px) {
  .album-container {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .two-columns {
    flex-direction: column;
  }
  .articles-grid {
    grid-template-columns: 1fr;
  }
}


/* ========= 波浪样式 ========= */
.wave-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 5;
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

.parallax>use {
  animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
}

.parallax>use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}

.parallax>use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}

.parallax>use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

.parallax>use:nth-child(4) {
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

/* ========= 移动端 ========= */
@media (max-width: 768px) {
  .floating-panels {
    position: static;
    transform: none;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    gap: 30px;
  }

  .cards-wrapper,
  .album-wrapper {
    width: 100% !important;
    opacity: 1;
  }

  .waves {
    height: 40px;
    min-height: 40px;
  }
}
</style>