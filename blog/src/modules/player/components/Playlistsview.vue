<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLibraryStore } from '@/modules/player/stores/libraryStore'

const libraryStore = useLibraryStore()
const router = useRouter()

/* --- 新建歌单弹框 --- */
const showDialog = ref(false)
const newName = ref('')
const newPrivate = ref(false)

const newCoverUrl = ref('')

import { useAudioStore } from '@/modules/player/stores/audioStore'

const audioStore = useAudioStore()

function onCoverChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { newCoverUrl.value = reader.result as string }
  reader.readAsDataURL(file)
}

function openCreateDialog() {
  newName.value = ''
  newPrivate.value = false
  newCoverUrl.value = ''
  showDialog.value = true
}

function confirmCreate() {
  const name = newName.value.trim()
  if (!name) return
  if (libraryStore.dirs.some(d => d.name === name)) {
    alert('该歌单已存在')
    return
  }
  libraryStore.addDir(name, (newCoverUrl.value || undefined))
  showDialog.value = false
}

/* --- 歌单快捷操作按钮 --- */
// 删除歌单
async function directDeletePlaylist(id: string) {
  if (confirm('确定要彻底删除这个歌单吗？')) {
    await libraryStore.removeDir(id)
  }
}


const addFileInput = ref<HTMLInputElement | null>(null)

async function onAddFiles(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) return
  await libraryStore.addSongs(files)
  ;(e.target as HTMLInputElement).value = ''
}
// 添加歌曲
function directAddSong(id: string) {
  libraryStore.curDir = id
  addFileInput.value?.click()
}

function openPlaylist(dirId: string) {
  libraryStore.curDir = dirId
  router.push('/player/songs')
}
</script>

<template>
  <div class="playlist-view">
    <input type="file" ref="addFileInput" accept="audio/*" multiple webkitdirectory style="display:none" @change="onAddFiles" />

    <div class="pl-list">
      <!-- 歌单项循环 -->
      <template v-for="d in libraryStore.dirs" :key="d.id">
        <!-- 隐藏默认歌单 -->
        <div v-if="d.id !== 'default'" class="pl-item" @click="openPlaylist(d.id)">
          
          <!-- 左边：封面 -->
          <div class="pl-cover">
            <img v-if="d.cover" :src="d.cover" class="pl-cover-img" />
            <div v-else class="default-cover-icon">🎵</div>
          </div>
          
          <!-- 中间：名字和数量 -->
          <div class="pl-info">
            <div class="pl-name">{{ d.name }}</div>
            <div class="pl-meta">歌单 · {{ libraryStore.countDir(d.id) }}首</div>
          </div>

          <!-- 右边：你炫酷的按钮组 -->
          <div class="pl-actions">
            
            <!-- 1. 绿色的添加歌曲按钮 -->
            <button class="add-btn" title="添加歌曲" @click.stop="directAddSong(d.id)">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-width="1.5" d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>
                <path stroke-width="1.5" d="M8 12H16"></path>
                <path stroke-width="1.5" d="M12 16V8"></path>
              </svg>
            </button>

            <!-- 2. 会变形的 Delete 按钮 -->
            <button class="delete-btn" title="删除歌单" @click.stop="directDeletePlaylist(d.id)">
              <svg viewBox="0 0 448 512" class="delete-icon">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
              </svg>
            </button>

          </div>
        </div>
      </template>

      <!-- 新建歌单入口 -->
      <div class="pl-item pl-new" @click="openCreateDialog">
        <div class="pl-cover pl-cover-new">+</div>
        <div class="pl-info">
          <div class="pl-name">新建歌单</div>
          <div class="pl-meta">创建一个新歌单</div>
        </div>
      </div>
    </div>

    <!-- 新建歌单弹框 -->
    <Teleport to="body">
      <div v-if="showDialog" class="dialog-overlay" @click.self="showDialog = false">
        <div class="card">
          <div class="card2">
            <div class="dialog-inner">
              
              <!-- 左侧：新版文件夹封面上传 -->
              <div class="upload-area">
                <div class="container">
                  <template v-if="!newCoverUrl">
                    <div class="folder">
                      <div class="top"></div>
                      <div class="bottom"></div>
                    </div>
                    <label class="custom-file-upload">
                      <input type="file" accept="image/*" @change="onCoverChange" />
                      选择封面
                    </label>
                  </template>
                  <div v-else class="cover-preview">
                    <img :src="newCoverUrl" alt="cover" />
                  </div>
                </div>
              </div>

              <!-- 右侧：波浪字名称输入 -->
              <div class="input-area">
                <div class="form-control">
                  <input type="text" v-model="newName" required />
                  <label>
                    <span v-for="(ch, i) in '歌单名称'" :key="i" :style="{ transitionDelay: i * 50 + 'ms' }">{{ ch }}</span>
                  </label>
                </div>
              </div>

              <!-- 底部：紫渐变按钮 -->
              <div class="dialog-btns">
                <button class="button" @click="showDialog = false">
                  <span class="button-content">取消</span>
                </button>
                <button class="button" @click="confirmCreate">
                  <span class="button-content">保存</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ================= 列表及基础样式 ================= */
.playlist-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0 2px;
}

.pl-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pl-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: .15s;
}

.pl-item:hover {
  background: rgba(0, 243, 255, .04);
  border-color: rgba(0, 243, 255, .08);
}

.pl-cover {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(0, 243, 255, .06);
  border: 1px solid rgba(0, 243, 255, .12);
}

.pl-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-cover-icon {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #14b8a6, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pl-cover-new {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--neon-cyan);
  border: 1px dashed rgba(0, 243, 255, .25);
  background: transparent;
}

.pl-info {
  flex: 1;
  min-width: 0;
}

.pl-name {
  font-size: .82rem;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pl-meta {
  font-size: .68rem;
  color: var(--text-dim);
  margin-top: 2px;
}

/* ================= 右侧炫酷操作按钮组 ================= */
.pl-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0; /* 默认隐藏，鼠标滑过才显示，更高级 */
  transition: opacity 0.3s;
}

.pl-item:hover .pl-actions {
  opacity: 1;
}

/* 1. 添加按钮 (完美还原你的悬停旋转) */
.add-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  transition: transform 0.3s;
}

.add-btn:hover {
  transform: rotate(90deg);
}

.add-btn svg {
  width: 32px;  /* 完美匹配列表的高度 */
  height: 32px;
  stroke: #14b8a6; /* 青色 */
  fill: none;
  transition: all 0.3s;
}

.add-btn:hover svg {
  fill: #115e59;
}

.add-btn:active svg {
  stroke: #99f6e4;
  fill: #0d9488;
  transition-duration: 0s;
}

/* 2. 变形 Delete 按钮 (缩小适配版) */
.delete-btn {
  width: 32px; /* 从 50px 缩小到适配列表的 32px */
  height: 32px;
  border-radius: 50%;
  background-color: rgb(20, 20, 20);
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition-duration: .3s;
  overflow: hidden;
  position: relative;
  padding: 0;
}

.delete-icon {
  width: 12px;
  transition-duration: .3s;
}

.delete-icon path {
  fill: white;
}

.delete-btn:hover {
  width: 80px; /* 悬浮时拉长 */
  border-radius: 50px;
  background-color: rgb(255, 69, 69);
}

.delete-btn:hover .delete-icon {
  width: 16px;
  transform: translateY(60%);
}

.delete-btn::before {
  position: absolute;
  top: -20px;
  content: "Delete";
  color: white;
  transition-duration: .3s;
  font-size: 2px;
}

.delete-btn:hover::before {
  font-size: 12px;
  opacity: 1;
  transform: translateY(28px);
}

/* ================= 弹窗基础布局 ================= */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.card {
  width: 440px;
  background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
  border-radius: 20px;
  transition: all .3s;
}

.card:hover {
  box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, .30);
}

.card2 {
  background-color: #1a1a1a;
  border-radius: 18px;
  transition: all .2s;
  padding: 30px;
}

.card2:hover {
  transform: scale(0.98);
}

.dialog-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center; 
}

/* ================= 新建歌单：左侧文件夹组件 ================= */
.upload-area { 
  flex-shrink: 0; 
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  width: 140px;  
  height: 145px; 
  box-sizing: border-box;
  margin-bottom: -10px;
}

.folder {
  position: relative;
  animation: float 2.5s infinite ease-in-out;
  transition: transform 0.3s ease;
  margin-bottom: 15px; 
}

.folder:hover {
  transform: scale(1.05);
}

.folder .top {
  background: linear-gradient(135deg, #ff9a56, #ff6f56);
  width: 60px; 
  height: 15px; 
  border-radius: 8px 8px 0 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
}

.folder .bottom {
  background: linear-gradient(135deg, #ffe563, #ffc663);
  width: 90px; 
  height: 60px; 
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border-radius: 0 8px 8px 8px;
  position: relative;
  top: -6px; 
}

.custom-file-upload {
  font-size: 0.85rem; 
  color: #ffffff;
  text-align: center;
  padding: 8px 12px; 
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%; 
  box-sizing: border-box;
}

.custom-file-upload:hover {
  background: rgba(255, 255, 255, 0.4);
}

.custom-file-upload input[type="file"] {
  display: none;
}

.cover-preview {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); } 
  100% { transform: translateY(0px); }
}

/* ================= 新建歌单：右侧输入框 ================= */
.input-area {
  flex: 1;
  min-width: 180px;
  display: flex;
  align-items: center;
  margin-bottom: 60px;
}

.form-control {
  position: relative;
  width: 100%;
}

.form-control input {
  background-color: transparent;
  border: 0;
  border-bottom: 2px #fff solid;
  display: block;
  width: 100%;
  padding: 10px 0;
  font-size: 18px;
  color: #fff;
  font-family: inherit;
}

.form-control input:focus,
.form-control input:valid {
  outline: 0;
  border-bottom-color: #00ff75; 
}

.form-control label {
  position: absolute;
  top: 10px;
  left: 0;
  pointer-events: none;
}

.form-control label span {
  display: inline-block;
  font-size: 18px;
  min-width: 5px;
  color: #fff;
  transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.form-control input:focus + label span,
.form-control input:valid + label span {
  color: #00ff75; 
  transform: translateY(-28px);
  font-size: 14px;
}

/* ================= 新建歌单：底部按钮 ================= */
.dialog-btns {
  width: 100%; 
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: -70px; 
  margin-left: -20px;
}

.button {
  position: relative;
  overflow: hidden;
  height: 2.6rem;
  padding: 0 1.8rem;
  border-radius: 1.5rem;
  background: #3d3a4e;
  background-size: 400%;
  color: #fff;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: .85rem;
}

.button:hover::before { transform: scaleX(1); }

.button-content { position: relative; z-index: 1; }

.button::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  transform: scaleX(0);
  transform-origin: 0 50%;
  width: 100%;
  height: inherit;
  border-radius: inherit;
  background: linear-gradient(82.3deg, rgba(150, 93, 233, 1) 10.8%, rgba(99, 88, 238, 1) 94.3%);
  transition: all 0.475s;
}
</style>