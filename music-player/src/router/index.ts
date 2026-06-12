import {createRouter, createWebHistory} from 'vue-router'
import Bloghome from '@/views/bloghome.vue'
import musicPlayer from '@/views/music-player.vue'

const routes = [{
    path:'/',
    name:'blog',
    component:Bloghome
},
{
    path: '/player',
    name: 'player',
    component: musicPlayer
}]

const router = createRouter({
    history: createWebHistory(),routes
})

export default router