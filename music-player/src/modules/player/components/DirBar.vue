<script setup lang="ts">
import { ref } from 'vue'
import { useLibraryStore } from '@/modules/player/stores/libraryStore';

const libraryStore = useLibraryStore()
const showAddModal = ref(false) 
const newDirName = ref('')      
const errMsg = ref('')

function switchDir(dirId: string) {
  libraryStore.curDir = dirId
  libraryStore.kw = ''
}

async function onDeleteDir(dirId: string) {
  if (dirId === 'default') return
  try {
    await libraryStore.removeDir(dirId)
  } catch (e) {
    console.error(e)
    alert('删除失败，请重试')
  }
}

function openAddModal() {
  newDirName.value = ''
  errMsg.value = ''
  showAddModal.value = true
}

async function confirmAdd() {
  const name = newDirName.value.trim()
  if (!name) {
    errMsg.value = 'ERR: 名称不能为空'
    return
  }
  if (libraryStore.dirs.some(d => d.name === name)) {
    errMsg.value = 'ERR: 该连接已存在'
    return
  }

  await libraryStore.addDir(name)
  showAddModal.value = false
}
</script>

<template>
  <div class="dir-bar">
    <div class="dir-chip" :class="{ on: libraryStore.curDir === 'all' }" @click="switchDir('all')">
      <img src="@/assets/file.png" alt="" class="file-logo" />全部
      <span style="opacity: 0.7;">{{ libraryStore.library.length }}</span>
    </div>
    <div v-for="d in libraryStore.dirs" :key="d.id" class="dir-chip" :class="{ on: libraryStore.curDir === d.id }"
      @click="switchDir(d.id)">
      <img src="@/assets/file.png" alt="" class="file-logo" />
      {{ d.name }} <span style="opacity: 0.7">{{ libraryStore.countDir(d.id) }}</span>
      <span v-if="d.id != 'default'" class="del" @click.stop="onDeleteDir(d.id)">✖</span>
    </div>
    <button class="add-dir" @click="openAddModal">+</button>
  </div>

  <Teleport to="body">
    <Transition name="holo-modal">
      <div v-if="showAddModal" class="holo-modal-mask" @click.self="showAddModal = false">
        
        <div class="glitch-input-wrapper">
          <div class="input-container">
            <input
              v-model="newDirName"
              @keyup.enter="confirmAdd"
              @keyup.esc="showAddModal = false"
              type="text"
              id="holo-input"
              class="holo-input"
              placeholder=" " 
              required
              autofocus
            />
            <label for="holo-input" class="input-label" data-text="NETWORK">NETWORK</label>

            <div class="input-border"></div>
            <div class="input-scanline"></div>
            <div class="input-glow"></div>

            <div class="input-data-stream">
              <div class="stream-bar" style="--i: 0;"></div>
              <div class="stream-bar" style="--i: 1;"></div>
              <div class="stream-bar" style="--i: 2;"></div>
              <div class="stream-bar" style="--i: 3;"></div>
              <div class="stream-bar" style="--i: 4;"></div>
              <div class="stream-bar" style="--i: 5;"></div>
              <div class="stream-bar" style="--i: 6;"></div>
              <div class="stream-bar" style="--i: 7;"></div>
              <div class="stream-bar" style="--i: 8;"></div>
              <div class="stream-bar" style="--i: 9;"></div>
            </div>

            <div class="input-corners">
              <div class="corner corner-tl"></div>
              <div class="corner corner-tr"></div>
              <div class="corner corner-bl"></div>
              <div class="corner corner-br"></div>
            </div>
          </div>

          <div class="holo-error" :class="{ show: errMsg }">{{ errMsg }}</div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dir-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.dir-chip {
  padding: 4px 10px;
  border: 1px solid rgba(0, 243, 255, .12);
  border-radius: 12px;
  font-size: .72rem;
  color: var(--text-dim);
  cursor: pointer;
  transition: .2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.dir-chip:hover,
.dir-chip.on {
  background: rgba(0, 243, 255, .08);
  color: var(--neon-cyan, #00f3ff);
  border-color: rgba(0, 243, 255, .35);
  box-shadow: 0 0 8px rgba(0, 243, 255, .1);
}
.dir-chip .del {
  opacity: 0; width: 14px; height: 14px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%; color: var(--text-dim);
}
.dir-chip:hover .del { opacity: 1; }
.file-logo { height: 25px; width: auto; display: block; }
.dir-chip .del:hover { background: rgba(255, 0, 255, .15); color: var(--neon-pink, #ff00ff); }
.add-dir {
  background: none; border: 1px dashed rgba(0, 243, 255, .25);
  color: var(--neon-cyan, #00f3ff); width: 22px; height: 22px;
  border-radius: 50%; cursor: pointer; font-size: .9rem; line-height: 1;
}
.add-dir:hover { border-style: solid; }

/*弹窗遮罩层与 Vue 动画*/
.holo-modal-mask {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(5, 5, 5, 0.85); 
  backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}

.holo-modal-enter-active, .holo-modal-leave-active {
  transition: opacity 0.4s ease;
}
.holo-modal-enter-active .glitch-input-wrapper, 
.holo-modal-leave-active .glitch-input-wrapper {
  transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.15);
}
.holo-modal-enter-from, .holo-modal-leave-to {
  opacity: 0;
}
.holo-modal-enter-from .glitch-input-wrapper, 
.holo-modal-leave-to .glitch-input-wrapper {
  transform: scale(0.9) translateY(20px);
}

/*全息输入框*/
.glitch-input-wrapper {
  --bg-color: #0d0d0d;
  --primary-color: #00f2ea;
  --secondary-color: #a855f7;
  --text-color: #e5e5e5;
  --font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  --glitch-anim-duration: 0.4s;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: var(--font-family);
  font-size: 16px;
  padding: 3rem;
}

.input-container {
  position: relative;
  width: 19rem; 
}

.holo-input {
  width: 100%;
  height: 3.5rem; 
  background: rgba(13, 13, 13, 0.7);
  border: none;
  border-bottom: 2px solid #333;
  outline: none;
  padding: 0 1rem;
  color: var(--primary-color);
  font-family: inherit;
  font-size: 1.1rem;
  letter-spacing: 1px;
  caret-color: var(--primary-color);
  z-index: 10;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.input-label {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: var(--text-color);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 11;
}

.holo-input:focus + .input-label,
.holo-input:not(:placeholder-shown) + .input-label {
  top: -1.5rem;
  left: 0;
  font-size: 0.8rem;
  opacity: 1;
  color: var(--primary-color);
}

.holo-input:focus + .input-label::before,
.holo-input:focus + .input-label::after {
  content: attr(data-text);
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-color: transparent; 
}
.holo-input:focus + .input-label::before {
  color: var(--secondary-color);
  animation: glitch-label var(--glitch-anim-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.holo-input:focus + .input-label::after {
  color: var(--primary-color);
  animation: glitch-label var(--glitch-anim-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
}

.input-border, .input-scanline, .input-glow, .input-corners {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
}
.input-border {
  border: 1px solid rgba(0, 242, 234, 0.2);
  opacity: 0.5;
  transition: all 0.3s ease;
}
.corner {
  position: absolute; width: 1rem; height: 1rem;
  border: 2px solid var(--primary-color);
  transition: all 0.3s ease; opacity: 0.5;
}
.corner-tl { top: -0.3rem; left: -0.3rem; border-right: none; border-bottom: none; }
.corner-tr { top: -0.3rem; right: -0.3rem; border-left: none; border-bottom: none; }
.corner-bl { bottom: -0.3rem; left: -0.3rem; border-right: none; border-top: none; }
.corner-br { bottom: -0.3rem; right: -0.3rem; border-left: none; border-top: none; }

.input-glow {
  background: radial-gradient(ellipse at center, rgba(0, 242, 234, 0.2) 0%, transparent 70%);
  opacity: 0; transition: opacity 0.4s ease;
}

.input-scanline {
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 242, 234, 0.1) 48%, rgba(0, 242, 234, 0.3) 50%, rgba(0, 242, 234, 0.1) 52%, transparent 100%);
  opacity: 0;
}

.input-data-stream {
  position: absolute; bottom: 2px; left: 0; width: 100%; height: 0.3rem;
  display: flex; opacity: 0; transition: opacity 0.3s ease 0.1s;
}
.stream-bar {
  flex-grow: 1; background-color: var(--primary-color);
  transition: transform 0.2s, opacity 0.2s;
  transform: scaleY(0); transform-origin: bottom;
}

.holo-input:focus { border-color: transparent; }
.holo-input:focus ~ .input-border { opacity: 1; border-color: rgba(0, 242, 234, 0.5); }
.holo-input:focus ~ .input-corners .corner { width: 1.25rem; height: 1.25rem; border-width: 3px; opacity: 1; }
.holo-input:focus ~ .input-glow { opacity: 1; }
.holo-input:focus ~ .input-scanline { animation: scan-vertical 4s linear infinite; }
.holo-input:focus ~ .input-data-stream { opacity: 1; }
.holo-input:focus ~ .input-data-stream .stream-bar { animation: data-pulse 2s infinite; animation-delay: calc(var(--i) * 0.1s); }

@keyframes glitch-label {
  0% { transform: translate(0); clip-path: inset(0 0 0 0); }
  20% { transform: translate(-0.2rem, 0.1rem); clip-path: inset(50% 0 20% 0); }
  40% { transform: translate(0.1rem, -0.1rem); clip-path: inset(20% 0 60% 0); }
  60% { transform: translate(-0.15rem, 0.1rem); clip-path: inset(80% 0 5% 0); }
  80% { transform: translate(0.15rem, -0.15rem); clip-path: inset(30% 0 45% 0); }
  100% { transform: translate(0); clip-path: inset(0 0 0 0); }
}
@keyframes scan-vertical {
  0% { opacity: 0; transform: translateY(-100%); }
  25% { opacity: 0.5; }
  75% { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(100%); }
}
@keyframes data-pulse {
  0%, 100% { transform: scaleY(0.2); opacity: 0.3; }
  50% { transform: scaleY(1); opacity: 0.8; }
}

/*报错提示*/
.holo-error {
  color: #ff0055;
  font-family: var(--font-family);
  font-size: 0.85rem;
  margin-top: 15px;
  height: 16px;
  opacity: 0;
  text-align: center;
  text-shadow: 0 0 8px rgba(255, 0, 85, 0.6);
  transition: opacity 0.3s;
}
.holo-error.show { opacity: 1; }
</style>