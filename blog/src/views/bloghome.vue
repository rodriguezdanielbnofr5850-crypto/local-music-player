<template>
  <div class="app-flex">
    <section class="content"><!-- 其他组件 --></section>
    <div class="cards-wrapper">
      <information class="info-card" />
      <player class="sticky-card" />
    </div>
    <!-- <informatiom /> -->
    
    <!-- <photo-show /> -->
    <!-- <article-display /> -->
  </div>
</template>

<script setup lang="ts">
import Information from '@/modules/bloghome/components/information.vue';
import player from '@/modules/bloghome/components/music.vue'
</script>


<style>
.app-flex {
  display: flex;
  position: relative;
  height: 100vh;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
  background-image: url('@/assets/木叶创立.png'); /* 替换为你的图片路径 */
  background-size: cover;        /* 图片等比例覆盖，不留空白 */
  background-position: center;   /* 图片居中 */
  background-repeat: no-repeat;  /* 不重复 */
}

.app-flex::before {
  content: '';
  position: absolute;
  inset: 0;  /* 等同于 top:0; left:0; right:0; bottom:0 */
  background: rgba(0, 0, 0, 0.45);
  z-index: 0;
}

/* 所有子元素提升到遮罩上方 */
.app-flex > * {
  position: relative;
  z-index: 1;
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