<template>
  <div class="container">
    <!-- SVG 波浪文字 -->
     
    <svg viewBox="0 0 120 20" class="wave-svg">
      <defs>
        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="5%" stop-color="#40E0D0"/>
          <stop offset="95%" stop-color="#1a7a6e"/>
        </linearGradient>
        <pattern id="wave" x="0" y="0" width="120" height="20" patternUnits="userSpaceOnUse">
          <path id="wavePath" d="M-40 9 Q-30 7 -20 9 T0 9 T20 9 T40 9 T60 9 T80 9 T100 9 T120 9 V20 H-40z" fill="url(#gradient)">
            <animateTransform
              attributeName="transform"
              begin="0s"
              dur="1.5s"
              type="translate"
              from="0,0"
              to="40,0"
              repeatCount="indefinite" />
          </path>
        </pattern>
      </defs>
        <text text-anchor="middle" x="60" y="15" font-size="17" fill="white">一路向北</text>
      <text text-anchor="middle" x="60" y="15" font-size="17" fill="url(#wave)" fill-opacity="0.9">一路向北</text>
      <text text-anchor="middle" x="60" y="15" font-size="17" fill="url(#gradient)" fill-opacity="0.1">一路向北</text>
    </svg>

    <!-- 原有文字动画 -->
    <h1>
      <span>我的</span>
      <span>愿望是</span>
      <span>世界和平</span>
    </h1>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
$secondary-color: #ffe221;
$tertiary-color: #ffffff;
$total: 6.8s;

.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: transparent;
  margin: 0;
  padding: 0;
}

/* SVG 波浪文字样式 */
.wave-svg {
  font-weight: bold;
  max-width: 600px;
  width: 90%;
  height: auto;
  margin-bottom: 40px;
  font-family: 'Cabin Condensed', sans-serif;
}

h1 {
  font-size: 75px;
  margin: 0;
  padding: 0;
  text-align: center;
  font-family: 'Cabin Condensed', sans-serif;

  span {
    width: 100%;
    float: left;
    color: $tertiary-color;
    -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%);
    clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%);
    transform: translateY(-50px);
    opacity: 0;
    animation-timing-function: ease;
    animation-duration: $total;
    animation-iteration-count: infinite;
    animation-fill-mode: forwards;

    &:last-child {
      color: $secondary-color;
    }
  }
}

h1 span:nth-child(1) { animation-name: w1; }
h1 span:nth-child(2) { animation-name: w2; }
h1 span:nth-child(3) { animation-name: w3; }

/* ═══ 时间轴 (6.8s) ═══
   0%─10%   我的 露出
   8%─18%   愿望是 露出
   16%─26%  世界和平 露出
   26%─59%  完整展示
   59%─71%  消失
   71%─100% 静默 (2s)
   ═════════════════ */

@keyframes w1 {
  0%        { transform: translateY(-50px); opacity: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%); }
  10%       { transform: translateY(0); opacity: 1; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%); }
  59%       { transform: translateY(0); opacity: 1; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%); }
  71%, 100% { transform: translateY(50px); opacity: 0; clip-path: polygon(100% 0, 100% -0%, 0 100%, 0 100%); }
}

@keyframes w2 {
  0%, 8%    { transform: translateY(-50px); opacity: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%); }
  18%       { transform: translateY(0); opacity: 1; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%); }
  59%       { transform: translateY(0); opacity: 1; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%); }
  71%, 100% { transform: translateY(50px); opacity: 0; clip-path: polygon(100% 0, 100% -0%, 0 100%, 0 100%); }
}

@keyframes w3 {
  0%, 16%   { transform: translateY(-50px); opacity: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%); }
  26%       { transform: translateY(0); opacity: 1; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%); }
  59%       { transform: translateY(0); opacity: 1; clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%); }
  71%, 100% { transform: translateY(50px); opacity: 0; clip-path: polygon(100% 0, 100% -0%, 0 100%, 0 100%); }
}

/* 响应式 */
@media (max-width: 768px) {
  h1 {
    font-size: 40px;
  }
  .wave-svg {
    max-width: 90%;
  }
}
</style>
