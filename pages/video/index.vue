<template>
  <div>
    <!-- 비디오 리스트 -->
    <div v-if="videos.length > 0" class="row q-col-gutter-lg">
      <div v-for="(video, idx) in videos" :key="video.id" class="col-6">
        <VideoCard :video="video" :idx="idx + 1" />
      </div>
    </div>

    <!-- 로딩 스피너 -->
    <q-spinner v-if="isLoading" color="primary" size="lg" class="q-mt-md" />

    <!-- 오류 메시지 -->
    <div v-if="error" class="text-negative q-mt-md">
      {{ error.message || '데이터를 가져오는 중 오류가 발생했습니다.' }}
    </div>

    <!-- 더 이상 로드할 데이터가 없을 때 표시 -->
    <div v-if="!hasMore && !isLoading" class="q-mt-md">
      더 이상 로드할 데이터가 없습니다.
    </div>

    <!-- Intersection Observer 요소 -->
    <!--    <div ref="observerElement" class="observer-element"></div>-->
    <div v-intersection-observer="handleInterSectionObserver"></div>
  </div>
</template>

<script setup lang="ts">
import { vIntersectionObserver } from '@vueuse/components'
import { ref, onMounted, onUnmounted } from 'vue'
import { useAsyncData } from 'nuxt/app'
import type { VideoRes } from '~/types/VideoRes'
import { fetchVideosFromApi } from '~/services/fetchData'
import { date } from 'quasar'
import { useRoute } from '#app'

// 상태 관리
const videos = ref<VideoRes[]>([]) // 비디오 데이터
const lastId = ref(-1) // 마지막으로 로드된 비디오의 ID
const hasMore = ref(true) // 더 로드할 데이터가 있는지 여부

// 비디오 데이터 로드 함수
const route = useRoute()
const targetDate =
  (route.query.targetDate as string) ||
  date.formatDate(
    date.subtractFromDate(new Date(), { days: 1 }), // 오늘 날짜에서 1일 빼기
    'YYYY-MM-DD', // 원하는 포맷 지정
  ) // 대상 날짜 (예시)
const loadVideos = async () => {
  return fetchVideosFromApi(targetDate, lastId.value)
}

// useAsyncData로 데이터 관리
const {
  data,
  execute,
  error,
  status,
  pending: isLoading,
} = await useAsyncData('videos', loadVideos, {
  immediate: false,
})

// execute를 통한 데이터 로드
const fetchMoreVideos = async () => {
  if (!hasMore.value) return // 중복 로드 방지

  try {
    // 데이터를 실행
    await execute()

    // 로드된 데이터가 있을 경우 상태 업데이트
    if (data.value) {
      const result = data.value

      videos.value = [...videos.value, ...result.data]
      hasMore.value = result.paging.hasNext
      lastId.value = result.paging.lastId
      console.log(result.paging.hasNext)
      console.log(hasMore.value)
    }
    if (!hasMore.value) {
      showNotification()
    }
  } catch (err) {
    console.error(err)
  }
}

const handleInterSectionObserver = ([entry]: IntersectionObserverEntry[]) => {
  if (entry?.isIntersecting && hasMore && !isLoading.value) {
    fetchMoreVideos()
  }
}

const $q = useQuasar()
const showNotification = () => {
  $q.notify({
    message: '더 이상 로드할 데이터가 없습니다',
    type: 'positive',
    timeout: 2000,
    position: 'bottom',
  })
}

onMounted(() => {
  fetchMoreVideos()
})
</script>

<style scoped>
.observer-element {
  height: 1px;
}
</style>
