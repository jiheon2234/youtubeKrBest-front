<template>
  <q-page class="q-pa-md">
    <q-spinner v-if="pending" color="primary" size="lg" />
    <q-banner v-else-if="error" dense class="bg-red text-white">
      Error: {{ error.message }}
    </q-banner>
    <q-card v-else class="video-card">
      <q-card-section>
        <iframe
          :src="youtubeEmbedUrl"
          allowfullscreen
          class="video-player"
        ></iframe>
      </q-card-section>
      <q-card-section>
        <div class="text-h3 q-mb-lg">{{ video.title }}</div>

        <div>{{ video.description }}</div>
      </q-card-section>

      <q-card-section>
        <q-chip color="primary" text-color="white" class="q-mb-sm">
          Views: {{ video.viewCount }}
        </q-chip>
        <q-chip color="secondary" text-color="white">
          Published at: {{ video.published_at }}
        </q-chip>
      </q-card-section>

      <!-- 댓글 리스트 섹션 -->
      <q-card-section>
        <h2>Comments</h2>
        <q-list bordered class="comments-list">
          <q-item
            v-for="(comment, idx) in comments"
            :key="comment.id"
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-avatar>
                <img :src="comment.authorImage" alt="Author Avatar" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{
                comment.authorName || 'Anonymous'
              }}</q-item-label>

              <q-item-label>{{ comment.textDisplay }}</q-item-label>

              <q-item-label caption>
                {{ date.formatDate(video.published_at, 'YYYY-MM-DD') }}
                <q-icon name="thumb_up" /> {{ comment.likeCount }}
                <q-icon name="reply" /> {{ comment.totalReplyCount }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- 댓글 없음 메시지 -->
          <div v-if="comments.length === 0" class="q-mt-md text-grey">
            No comments available.
          </div>
          <!-- Intersection Observer -->
          <div v-intersection-observer="handleInterSectionObserver"></div>
        </q-list>

        <!-- 로딩 상태 -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#app'
import { useAsyncData } from 'nuxt/app'
import { fetchComments, fetchVideoById } from '~/services/fetchData'
import type { VideoRes } from '~/types/VideoRes'
import type { CommentRes } from '~/types/CommentRes'
import { vIntersectionObserver } from '@vueuse/components'
import { date, debounce } from 'quasar'

// 현재 경로에서 videoId 가져오기
const route = useRoute()
const videoId = route.params.videoId as string

// 상태 관리
const video = ref<VideoRes>({} as VideoRes)

// YouTube 임베드 URL 생성
const youtubeEmbedUrl = computed(() => {
  // if (!video.value) throw new Error('Video data is not available.')

  return `https://www.youtube.com/embed/${video.value.yId}`
})

// 비디오 데이터를 로드하는 함수
const loadVideo = async () => {
  const data = await fetchVideoById(videoId)
  if (!data) {
    throw new Error('Failed to fetch video data.')
  }
  return data
}

const shortDescription = computed(() =>
  video.value.description.length < 100
    ? video.value.description.substring(0, 100) + '...'
    : video.value.description,
)

// useAsyncData로 데이터 관리
const { data, execute, error, pending } = await useAsyncData<VideoRes>(
  'video',
  loadVideo,
  { immediate: true },
)

// 비디오 데이터를 가져오는 함수
const fetchVideo = async () => {
  try {
    await execute()
    if (!data.value) {
      throw new Error('Video data is null.')
    }

    video.value = data.value
  } catch (err) {
    console.error(err)
  }
}

// 컴포넌트가 마운트되면 비디오 데이터 로드
onMounted(() => {
  fetchVideo()
})

const lastId = ref(-1)
const hasMore = ref(true)
const comments = ref<CommentRes[]>([])
const {
  data: commentData,
  execute: commentExecute,
  pending: commentPending,
} = await useAsyncData(() => fetchComments(videoId, lastId.value), {
  // immediate: true,
})
const fetchMoreComments = async () => {
  await commentExecute()

  if (commentData.value) {
    const result = commentData.value
    comments.value = [...comments.value, ...result.data]
    hasMore.value = result.paging.hasNext
    lastId.value = result.paging.lastId
  }
}
const handleInterSectionObserver = debounce(
  ([entry]: IntersectionObserverEntry[]) => {
    window.scrollBy({
      top: -100, // 위로 10px 이동
      behavior: 'smooth', // 부드러운 애니메이션
    })
    console.log(entry.isIntersecting, hasMore.value)
    if (entry?.isIntersecting && hasMore.value) {
      fetchMoreComments()
    }
  },
  300,
)

await fetchMoreComments()
</script>

<style scoped>
.video-player {
  width: 100%;
  height: 360px;
  max-width: 100%;
  margin: 20px 0;
  display: block;
}

.video-card {
  max-width: 800px;
  margin: auto;
}
</style>
