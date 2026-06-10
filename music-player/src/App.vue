<template>
  <div class="app-container">
    <Sidebar />
    <Mainplayer />
    <Popnumenu />
  </div>
</template>

<style>
:root {
  --neon-cyan: #00f3ff;
  --neon-pink: #ff00ff;
  --neon-purple: #bc13fe;
  --bg-dark: #07070a;
  --bg-panel: #0e0e14;
  --panel-border: rgba(0, 243, 255, 0.08);
  --text-main: #e0e0e8;
  --text-dim: #6b6b8a;
  --font-mono: 'Courier New', Courier, 'SF Mono', Monaco, monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

body {
  background: var(--bg-dark);
  color: var(--text-main);
  font-family: var(--font-mono);
  height: 100vh;
  overflow: hidden;
  display: flex;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 243, 255, 0.25);
  border-radius: 3px;
}
</style>
<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  background: var(--bg-dark);
}
</style>
<script setup lang="ts">
// import Sidebar from './components/Sidebar.vue'
// import Mainplayer from './components/Mainplayer.vue'
// import Popnumenu from './components/Popnumenu.vue'
</script>
