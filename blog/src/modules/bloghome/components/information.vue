<template>
  <div class="info-card">
    <!-- 头像 -->
    <div class="avatar-wrapper">
      <img class="avatar" src="@/assets/me.jpg" loading="lazy" alt="头像" />
    </div>
    <!-- 昵称 -->
    <div class="name">一路向北</div>
    <!-- 分割线 -->
    <div class="divider"></div>
    <!-- 签名 -->
    <div class="bio">做点真正想做的</div>
    <!-- 社交图标 -->
    <ul class="wrapper">
      <a href="https://github.com/white66-7" target="_blank" class="icon github">
        <span class="tooltip">GitHub</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor"
            d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475c0-.237-.012-1.025-.012-1.862c-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025a2.137 2.137 0 0 0 2.912.825a2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688a3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65a3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75c0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247" />
        </svg>
      </a>
      <a href="https://space.bilibili.com/674047951" target="_blank" class="icon bilibili">
        <span class="tooltip">Bilibili</span>
        <svg viewBox="0 0 24 24" height="1.2em" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
        </svg>
      </a>
      <router-link to="/qq" class="icon qq">
        <span class="tooltip">QQ</span>
        <svg viewBox="0 0 24 24" height="1.2em" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.914 14.529a32 32 0 0 0-.676-1.886l-.91-2.246c.002-.026.013-.468.013-.696C18.34 5.86 16.508 2 12 2S5.66 5.86 5.66 9.7c0 .229.011.671.012.697l-.91 2.246a32 32 0 0 0-.675 1.886c-.86 2.737-.581 3.87-.369 3.895c.455.054 1.771-2.06 1.771-2.06c0 1.224.637 2.822 2.016 3.976c-.515.157-1.147.399-1.554.695c-.365.267-.319.54-.253.65c.289.481 4.955.307 6.303.157c1.347.15 6.014.324 6.302-.158c.066-.11.112-.382-.253-.649c-.407-.296-1.039-.538-1.555-.695c1.379-1.154 2.016-2.752 2.016-3.977c0 0 1.316 2.115 1.771 2.06c.212-.025.49-1.157-.37-3.894" />
        </svg>
      </router-link>
      <router-link to="/wechat" class="icon wechat">
        <span class="tooltip">WeChat</span>
        <svg viewBox="0 0 24 24" height="1.2em" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
        </svg>
      </router-link>
    </ul>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.info-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 16px;
  border-radius: 16px;
  background: linear-gradient(135deg,
      rgba(200, 240, 220, 0.65),
      rgba(200, 220, 255, 0.6),
      rgba(255, 210, 200, 0.55));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  width: 100%;
}

/* ===== 头像 ===== */
.avatar-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  flex-shrink: 0;
  margin-bottom: 4px;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
}

/* ===== 昵称 ===== */
.name {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ===== 分割线 ===== */
.divider {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 1px;
  margin: 4px 0;
}

/* ===== 签名 ===== */
.bio {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ===== 社交图标 ===== */
.wrapper {
  display: inline-flex;
  list-style: none;
  height: auto;
  width: 100%;
  font-family: "Poppins", sans-serif;
  justify-content: center;
  margin-top: 2px;
}

.wrapper .icon {
  position: relative;
  background: #fff;
  border-radius: 50%;
  margin: 10px;
  width: 50px;
  height: 50px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  color: #1a1a1a;
  text-decoration: none;
}

.wrapper .tooltip {
  position: absolute;
  top: 0;
  font-size: 14px;
  background: #fff;
  color: #fff;
  padding: 5px 8px;
  border-radius: 5px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.wrapper .tooltip::before {
  position: absolute;
  content: "";
  height: 8px;
  width: 8px;
  background: #fff;
  bottom: -3px;
  left: 50%;
  transform: translate(-50%) rotate(45deg);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.wrapper .icon:hover .tooltip {
  top: -45px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.wrapper .icon:hover span,
.wrapper .icon:hover .tooltip {
  text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
}

/* GitHub */
.wrapper .github:hover,
.wrapper .github:hover .tooltip,
.wrapper .github:hover .tooltip::before {
  background: #333;
  color: #fff;
}

/* Bilibili */
.wrapper .bilibili:hover,
.wrapper .bilibili:hover .tooltip,
.wrapper .bilibili:hover .tooltip::before {
  background: #00a1d6;
  color: #fff;
}

/* QQ */
.wrapper .qq:hover,
.wrapper .qq:hover .tooltip,
.wrapper .qq:hover .tooltip::before {
  background: #12b7f5;
  color: #fff;
}

/* WeChat */
.wrapper .wechat:hover,
.wrapper .wechat:hover .tooltip,
.wrapper .wechat:hover .tooltip::before {
  background: #07c160;
  color: #fff;
}

/* ===== 微信弹窗 ===== */
.wechat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.wechat-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
}

.wechat-content p {
  margin-bottom: 16px;
  font-size: 16px;
  color: #333;
}

.wechat-content button {
  padding: 8px 24px;
  border: none;
  border-radius: 6px;
  background: #07c160;
  color: #fff;
  cursor: pointer;
}
</style>