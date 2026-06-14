import { createRouter, createWebHistory } from 'vue-router'
import Bloghome from '@/views/bloghome.vue'
import musicPlayer from '@/views/music-player.vue'
import SongsView from '@/modules/player/components/songsview.vue'
import PlaylistsView from '@/modules/player/components/Playlistsview.vue'
import QQContact from '@/modules/bloghome/views/qq.vue'
import WechatContact from '@/modules/bloghome/views/wechat.vue'
const routes = [{
    path: '/',
    name: 'blog',
    component: Bloghome
},
{
    path: '/qq',
    name: 'qq-contact',
    component: QQContact
},
{
    path: '/wechat',
    name: 'wechat-contact',
    component: WechatContact
},
{
    path: '/player',
    component: musicPlayer,
    children: [
        { path: 'songs', component: SongsView },
        { path: 'playlists', component: PlaylistsView },
        { path: '', redirect: '/player/playlists' }
    ]
}]

const router = createRouter({
    history: createWebHistory(), routes
})

export default router