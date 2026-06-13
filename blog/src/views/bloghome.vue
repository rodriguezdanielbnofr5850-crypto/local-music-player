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
}


.cards-wrapper {
  position: absolute;
  right: -700px;          
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