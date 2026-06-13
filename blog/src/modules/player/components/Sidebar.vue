<<template>
  <aside class="sidebar">

    <!-- 当前播放卡片 -->
    <RouterView />
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLibraryStore } from '@/stores/libraryStore'
import { useAudioStore } from '@/stores/audioStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const libraryStore = useLibraryStore()
const audioStore = useAudioStore()


function openPlaylist(dirId: string) {
  libraryStore.curDir = dirId
  router.push('/player/songs')
}
function goBack() {
  router.push('/player/playlists')
}

</script>

<style scoped>
.sidebar {
  width: 420px;
  min-width: 340px;
  background-color: var(--bg-panel);
  border-right: 1px solid var(--panel-border);
  display: flex;
  flex-direction: column;
  padding: 22px;
  gap: 14px;
}

</style>