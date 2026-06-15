<template>
  <div class="weather-card" :data-type="weatherType" ref="cardRef">
    <!-- 详情层：温度、日期 -->
    <div class="details">
      <div class="left">
        <div class="temp">{{ temp }}<span>°C</span></div>
        <div class="desc">{{ weatherDesc }}</div>
      </div>
      <div class="right">
        <div class="date">{{ formattedDate }}</div>
        <div class="address">{{ address }}</div>
      </div>
    </div>
    <svg id="weather-inner" ref="innerSvgRef">
      <defs>
        <!-- 原版树叶形状 -->
        <path id="leaf-path" d="M41.9,56.3l0.1-2.5c0,0,4.6-1.2,5.6-2.2c1-1,3.6-13,12-15.6c9.7-3.1,19.9-2,26.1-2.1c2.7,0-10,23.9-20.5,25c-7.5,0.8-17.2-5.1-17.2-5.1L41.9,56.3z"/>
        <!-- 原版太阳光晕渐变 -->
        <radialGradient id="SVGID_1_" cx="0" cy="0" r="320.8304" gradientUnits="userSpaceOnUse">
          <stop offset="0" style="stop-color:#FFDE17;stop-opacity:0.7"/>
          <stop offset="1" style="stop-color:#FFF200;stop-opacity:0"/>
        </radialGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Snap from 'snapsvg-cjs'
import { gsap } from 'gsap'

// --- 数据变量 ---
const cardRef = ref<HTMLElement | null>(null)
const innerSvgRef = ref<SVGElement | null>(null)
const address = ref('武汉')

const temp = ref('--')
const weatherDesc = ref('加载中...')
const formattedDate = ref('')
const weatherType = ref('wind') 

// --- 动态尺寸（不再写死，会在组件挂载时读取真实的 DOM 宽高） ---
let cardWidth = 300
let cardHeight = 400

// --- 动画容器 ---
let innerSVG: Snap.Paper = null!
let weatherContainer1: Snap.Paper = null!
let weatherContainer2: Snap.Paper = null!
let weatherContainer3: Snap.Paper = null!
let innerRainHolder1: Snap.Paper = null!
let innerRainHolder2: Snap.Paper = null!
let innerRainHolder3: Snap.Paper = null!
let innerSnowHolder: Snap.Paper = null!
let innerLeafHolder: Snap.Paper = null!
let innerLightningHolder: Snap.Paper = null!
let splashHolder: Snap.Paper = null!

let sun: Snap.Element = null!
let sunburst: Snap.Element = null!

let clouds: any[] = []
let rain: any[] = []
let leafs: any[] = []
let snow: any[] = []
let lightningTimeout: ReturnType<typeof setTimeout> | null = null
let currentWeather: any = { type: 'wind' }
let tickId: number = 0
let tickCount = 0

// 原版参数
const settings = {
  windSpeed: 2,
  rainCount: 0,
  leafCount: 0,
  snowCount: 0,
  cloudHeight: 100,
  cloudSpace: 30,
  cloudArch: 50,
  renewCheck: 10,
  splashBounce: 80
}

const weatherNames: Record<string, string> = {
  sun: 'Sunny', wind: 'Windy', rain: 'Rain', thunder: 'Storms', snow: 'Snow'
}

// ── 获取武汉天气 ──
async function fetchWeather() {
  try {
    const lat = 30.5833 
    const lon = 114.2667
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
    )
    const data = await res.json()
    const current = data.current_weather
    temp.value = String(Math.round(current.temperature))

    const code = current.weathercode
    let type = 'wind'
    if (code === 0) type = 'sun'
    else if (code >= 1 && code <= 3) type = 'wind'
    else if (code >= 45 && code <= 48) type = 'wind'
    else if (code >= 51 && code <= 67) type = 'rain'
    else if (code >= 80 && code <= 82) type = 'rain'
    else if (code >= 95 && code <= 99) type = 'thunder'
    else if (code >= 71 && code <= 77) type = 'snow'

    weatherDesc.value = weatherNames[type] || 'Unknown'

    const now = new Date()
    formattedDate.value = now.toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long'
    })

    changeWeather(type)
  } catch (err) {
    console.error('获取天气失败', err)
    weatherDesc.value = 'Error'
    changeWeather('wind')
  }
}

// ── 初始化 SVG ──
function initSVG() {
  if (!innerSvgRef.value || !cardRef.value) return

  // 关键修复：动态获取当前卡片真实的宽度和高度！
  cardWidth = cardRef.value.clientWidth || 300
  cardHeight = cardRef.value.clientHeight || 400

  innerSVG = Snap(innerSvgRef.value)

  const sunburstPathData = "M0,319.7c-18.6,0-37.3-1.6-55.5-4.8L-7.8,41.4c5.1,0.9,10.6,0.9,15.7,0L56,314.8C37.6,318,18.8,319.7,0,319.7z M-160.8,276.6c-32.5-18.8-61.3-42.9-85.5-71.6L-34,26.2c3.4,4.1,7.4,7.4,12,10.1L-160.8,276.6z M161.3,276.4L22.1,36.2 c4.5-2.6,8.6-6,12-10.1l212.6,178.5C222.5,233.4,193.8,257.6,161.3,276.4z M-302.5,108.3C-315.4,73-321.9,36-322-1.8l277.6-0.5 c0,5.3,0.9,10.4,2.7,15.2L-302.5,108.3z M302.6,107.8L41.8,12.8c1.7-4.7,2.6-9.7,2.6-14.9c0-0.3,0-0.6,0-1H322l0-1.3l0,1.9 C322,35.4,315.5,72.5,302.6,107.8z M-41.8-17.5l-261-94.5c12.8-35.4,31.6-68,55.8-96.9L-34.1-30.8C-37.5-26.8-40.1-22.3-41.8-17.5z M41.7-17.7c-1.8-4.8-4.4-9.3-7.8-13.3l212-179.2c24.3,28.8,43.3,61.3,56.3,96.6L41.7-17.7z M-22.2-40.8l-139.6-240 c32.7-19,68.1-32,105.2-38.6L-8-46.1C-13-45.2-17.8-43.4-22.2-40.8z M22-40.9c-4.4-2.6-9.2-4.3-14.2-5.1l47.1-273.6 c37.2,6.4,72.7,19.2,105.4,38L22-40.9z"
  
  sunburst = innerSVG.path(sunburstPathData).attr({
    fill: 'url(#SVGID_1_)',
    opacity: 0
  })

  // 太阳
  sun = innerSVG.circle(0, 0, 50).attr({ fill: '#F7ED47' })

  // 2. 依次按层级创建图层
  weatherContainer3 = innerSVG.group()
  const cloud3Group = innerSVG.group()
  weatherContainer2 = innerSVG.group()
  const cloud2Group = innerSVG.group()
  weatherContainer1 = innerSVG.group()
  const cloud1Group = innerSVG.group()

  innerRainHolder1 = weatherContainer1.group()
  innerRainHolder2 = weatherContainer2.group()
  innerRainHolder3 = weatherContainer3.group()
  innerLeafHolder = weatherContainer1.group()
  innerSnowHolder = weatherContainer1.group()
  splashHolder = innerSVG.group()
  innerLightningHolder = weatherContainer1.group()

  // 画云
  clouds = [
    { group: cloud1Group, offset: Math.random() * cardWidth },
    { group: cloud2Group, offset: Math.random() * cardWidth },
    { group: cloud3Group, offset: Math.random() * cardWidth }
  ]
  for (let i = 0; i < clouds.length; i++) drawCloud(clouds[i], i)

  // 启动光晕的原版无限旋转动画
  gsap.set(sunburst.node, { transformOrigin: "50% 50%", x: cardWidth / 2, y: cardHeight / 2 })
  gsap.fromTo(sunburst.node, { rotation: 0 }, { rotation: 360, duration: 20, repeat: -1, ease: 'none' })
}

// 原版画云算法
function drawCloud(cloud: any, i: number) {
  const space = settings.cloudSpace * i
  const height = space + settings.cloudHeight
  const arch = height + settings.cloudArch + (Math.random() * settings.cloudArch)
  const width = cardWidth
  const points = []
  points.push('M' + [-(width), 0].join(','))
  points.push([width, 0].join(','))
  points.push('Q' + [width * 2, height / 2].join(','))
  points.push([width, height].join(','))
  points.push('Q' + [width * 0.5, arch].join(','))
  points.push([0, height].join(','))
  points.push('Q' + [width * -0.5, arch].join(','))
  points.push([-width, height].join(','))
  points.push('Q' + [-(width * 2), height / 2].join(','))
  points.push([-(width), 0].join(','))
  
  if (!cloud.path) cloud.path = cloud.group.path()
  cloud.path.attr({ d: points.join(' '), fill: ['#efefef', '#E6E6E6', '#D5D5D5'][i] })
}

// 原版雨滴算法
function makeRain() {
  const lineWidth = Math.random() * 3
  const lineLength = currentWeather.type === 'thunder' ? 35 : 14
  const x = Math.random() * (cardWidth - 40) + 20
  
  const holders = [innerRainHolder1, innerRainHolder2, innerRainHolder3]
  const holder = holders[2 - Math.floor(lineWidth)]!
  
  const line = holder.path(`M0,0 0,${lineLength}`).attr({
    fill: 'none',
    stroke: currentWeather.type === 'thunder' ? '#777' : '#0000ff',
    strokeWidth: lineWidth
  })
  
  rain.push(line)
  
  gsap.fromTo(line.node, 
    { x, y: -lineLength }, 
    { 
      delay: Math.random(), 
      y: cardHeight, 
      duration: 1, 
      ease: 'power2.in',
      onComplete: () => {
        line.remove()
        rain = rain.filter(r => r.paper)
        if (lineWidth > 2) makeSplash(x, currentWeather.type)
      }
    }
  )
}

// 原版溅射水花算法
function makeSplash(x: number, type: string) {
  const splashLength = type === 'thunder' ? 30 : 20
  const splashBounce = type === 'thunder' ? 120 : 100
  const splashDistance = 80
  const speed = type === 'thunder' ? 0.7 : 0.5
  const splashUp = 0 - (Math.random() * splashBounce)
  const randomX = ((Math.random() * splashDistance) - (splashDistance / 2))
  
  const points = []
  points.push('M' + 0 + ',' + 0)
  points.push('Q' + randomX + ',' + splashUp)
  points.push((randomX * 2) + ',' + splashDistance)
  
  const splash = splashHolder.path(points.join(' ')).attr({
    fill: "none", stroke: type === 'thunder' ? '#777' : '#0000ff', strokeWidth: 1
  })
  
  const pathLength = Snap.path.getTotalLength(splash as any)
  splash.node.style.strokeDasharray = splashLength + ' ' + pathLength
  
  gsap.fromTo(splash.node, 
    { strokeWidth: 2, y: cardHeight, x: x, opacity: 1, strokeDashoffset: splashLength }, 
    { 
      strokeWidth: 0, 
      strokeDashoffset: -pathLength, 
      opacity: 1, 
      duration: speed, 
      ease: 'power1.inOut',
      onComplete: () => splash.remove()
    }
  )
}

// 原版雪花算法
function makeSnow() {
  const scale = 0.5 + (Math.random() * 0.5)
  const x = 20 + (Math.random() * (cardWidth - 40))
  const y = -10
  const endY = cardHeight + 10
  
  const flake = innerSnowHolder.circle(0, 0, 5).attr({ fill: 'white' })
  snow.push(flake)
  
  gsap.fromTo(flake.node, { x, y }, { y: endY, duration: 3 + (Math.random() * 5), ease: 'none', onComplete: () => {
    flake.remove()
    snow = snow.filter(s => s.paper)
  }})
  gsap.fromTo(flake.node, { scale: 0 }, { scale, duration: 1, ease: 'power1.inOut' })
  gsap.to(flake.node, { x: x + ((Math.random() * 150) - 75), duration: 3, repeat: -1, yoyo: true, ease: 'power1.inOut' })
}

// 原版树叶算法
function makeLeaf() {
  const scale = 0.5 + (Math.random() * 0.5)
  const areaY = cardHeight / 2
  const y = areaY + (Math.random() * areaY)
  const endY = y - ((Math.random() * (areaY * 2)) - areaY)
  const colors = ['#76993E', '#4A5E23', '#6D632F']
  const color = colors[Math.floor(Math.random() * colors.length)]
  
  const newLeaf = (innerSVG.use('leaf-path') as Snap.Element).appendTo(innerLeafHolder).attr({ fill: color })
  leafs.push(newLeaf)
  
  const x = -100
  const endX = cardWidth + 50
  
  gsap.fromTo(newLeaf.node, 
    { rotation: Math.random() * 180, x, y, scale }, 
    { 
      rotation: Math.random() * 360, x: endX, y: endY, 
      duration: 2, 
      ease: 'power1.in',
      onComplete: () => {
        newLeaf.remove()
        leafs = leafs.filter(l => l.paper)
      }
    }
  )
}

// 原版闪电算法
function startLightningTimer() {
  if (lightningTimeout) clearTimeout(lightningTimeout)
  if (currentWeather.type === 'thunder') {
    lightningTimeout = setTimeout(lightning, Math.random() * 6000)
  }
}

function lightning() {
  startLightningTimer()
  if (cardRef.value) gsap.fromTo(cardRef.value, { y: -30 }, { y: 0, duration: 0.75, ease: 'elastic.out(1, 0.3)' })
  
  const pathX = 30 + Math.random() * (cardWidth - 60)
  const yOffset = 20
  const steps = 20
  const points = [pathX + ',0']
  for (let i = 0; i < steps; i++) {
    const x = pathX + (Math.random() * yOffset - (yOffset / 2))
    const y = (cardHeight / steps) * (i + 1)
    points.push(x + ',' + y)
  }
  
  const strike = innerLightningHolder.path('M' + points.join(' ')).attr({
    fill: 'none', stroke: 'white', strokeWidth: 2 + Math.random()
  })
  
  gsap.to(strike.node, { opacity: 0, duration: 1, ease: 'power4.out', onComplete: () => strike.remove() })
}

// 原版 Tick (帧动画逻辑)
function tick() {
  tickCount++
  if (tickCount % settings.renewCheck === 0) {
    if (rain.length < settings.rainCount) makeRain()
    if (leafs.length < settings.leafCount) makeLeaf()
    if (snow.length < settings.snowCount) makeSnow()
  }
  
  for (let i = 0; i < clouds.length; i++) {
    if (currentWeather.type === 'sun') {
      if (clouds[i].offset > -(cardWidth * 1.5)) clouds[i].offset += settings.windSpeed / (i + 1)
      if (clouds[i].offset > cardWidth * 2.5) clouds[i].offset = -(cardWidth * 1.5)
      clouds[i].group.transform('t' + clouds[i].offset + ',0')
    } else {
      clouds[i].offset += settings.windSpeed / (i + 1)
      if (clouds[i].offset > cardWidth) clouds[i].offset = 0 + (clouds[i].offset - cardWidth)
      clouds[i].group.transform('t' + clouds[i].offset + ',0')
    }
  }
  tickId = requestAnimationFrame(tick)
}

// ── 原版天气切换逻辑 ──
function changeWeather(type: string) {
  currentWeather = { type }
  weatherType.value = type

  const isThunder = type === 'thunder'
  const cloudFills = isThunder ? ['#9FA4AD', '#8B8E98', '#7B7988'] : ['#efefef', '#E6E6E6', '#D5D5D5']
  clouds.forEach((c, i) => {
    if (c.path) gsap.to(c.path.node, { attr: { fill: cloudFills[i] as string }, duration: 2 })
  })

  switch (type) {
    case 'wind':
      gsap.to(settings, { windSpeed: 3, rainCount: 0, leafCount: 5, snowCount: 0, duration: 3, ease: 'power2.inOut' })
      break
    case 'sun':
      gsap.to(settings, { windSpeed: 20, rainCount: 0, leafCount: 0, snowCount: 0, duration: 3, ease: 'power2.inOut' })
      break
    case 'rain':
      gsap.to(settings, { windSpeed: 0.5, rainCount: 10, leafCount: 0, snowCount: 0, duration: 3, ease: 'power2.inOut' })
      break
    case 'thunder':
      gsap.to(settings, { windSpeed: 0.5, rainCount: 60, leafCount: 0, snowCount: 0, duration: 3, ease: 'power2.inOut' })
      break
    case 'snow':
      gsap.to(settings, { windSpeed: 0.5, rainCount: 0, leafCount: 0, snowCount: 40, duration: 3, ease: 'power2.inOut' })
      break
  }

  // 太阳坐标现在使用动态测量的宽高
  if (type === 'sun') {
    gsap.to(sun.node, { attr: { cx: cardWidth / 2, cy: cardHeight / 2 }, duration: 4, ease: 'power2.inOut' })
    gsap.to(sunburst.node, { scale: 1, opacity: 0.8, y: cardHeight / 2, x: cardWidth / 2, duration: 4, ease: 'power2.inOut' })
  } else {
    gsap.to(sun.node, { attr: { cx: cardWidth / 2, cy: -100 }, duration: 2, ease: 'power2.inOut' })
    gsap.to(sunburst.node, { scale: 0.4, opacity: 0, y: cardHeight / 2 - 50, x: cardWidth / 2, duration: 2, ease: 'power2.inOut' })
  }

  startLightningTimer()
}

// ── 生命周期 ──
onMounted(async () => {
  await nextTick()
  initSVG()
  changeWeather('wind') 
  tickId = requestAnimationFrame(tick)
  await fetchWeather()
})

onUnmounted(() => {
  cancelAnimationFrame(tickId)
  if (lightningTimeout) clearTimeout(lightningTimeout)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Lato:300,600');

/* 外层完全继承父组件（比如左边轮播图）的高度，填满 280px 的宽 */
.weather-card {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  box-shadow: 9px 7px 40px -6px rgba(0,0,0,0.25);
  font-family: 'Lato', sans-serif;
  max-width: 300px;
  /* 默认 Wind 颜色 */
  background-color: #DAE3FD;
  transition: background-color 2s ease;
}

.weather-card[data-type="thunder"] { background-color: #9FA4AD; }
.weather-card[data-type="rain"] { background-color: #D8D8D8; }
.weather-card[data-type="sun"] { background-color: #ccccff; }

/* 内部 SVG 铺满全屏 */
#weather-inner {
  position: absolute;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  
  background-color: rgba(255,255,255,1);
  background: linear-gradient(to bottom, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
}

.details {
  position: absolute;
  top: 0; 
  left: 0; 
  right: 0;
  padding: 16px 20px;
  color: #888;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  z-index: 2;
  transition: color 2s ease;
}

.weather-card[data-type="thunder"] .details {
  color: #ddd;
}

.right {
  text-align: right;
}

.date {
  margin: 4px 0;
  font-size: 14px;
}

.desc {
  font-weight: 600;
  font-size: 22px;
}

.temp {
  font-size: 60px;
  line-height: 60px;
}

.temp span {
  font-size: 18px;
  line-height: 30px;
  vertical-align: top;
  margin-left: 5px;
}
.address {
  font-size: 25px;
  color: #aaa;
  margin-top: 2px;
}
</style>