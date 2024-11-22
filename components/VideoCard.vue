<template>
  <q-card class="cursor-pointer" @click="navigateToVideo">
    <q-card-section>
      <div class="row no-wrap items-center">
        <!-- 이미지 섹션 -->
        <q-img :src="video.thumbnail_url" class="col-6" />

        <div class="col-6 col">
          {{ video.id }}
          <div class="text-h2">{{ idx }}st</div>
          <div>조회수 : {{ video.viewCount }}</div>
          <div>댓글수 : {{ video.commentCount }}</div>
          <div>조회수 : {{ video.viewCount }}</div>

          <div>
            업로드날짜 :
            {{ date.formatDate(video.published_at, 'YYYY-MM-DD') }}
            ({{ date.getDateDiff(new Date(), video.published_at, 'days') }} 일
            전)
          </div>
        </div>

        <div />
      </div>
      <!-- 태그 섹션 -->
      <div class="col-6 flex flex-column justify-start">
        <div class="row">
          <div
            v-for="(tag, idx) in video.tags.slice(0, 3)"
            :key="idx"
            class="q-mb-sm"
          >
            <q-chip class="q-mr-sm">#{{ tag }}</q-chip>
          </div>
        </div>
        <q-chip
          v-if="video.tags.length > 3"
          :label="`${video.tags.length - 3} more ...`"
        />
      </div>
      <div class="text-h6 q-mt-sm ellipsis">{{ video.title }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { VideoRes } from '~/types/VideoRes'
import { date } from 'quasar'

// VideoRes 타입 정의
const props = defineProps<{
  video: VideoRes
  idx: number
}>()

const emit = defineEmits(['click'])

const router = useRouter()

// 카드 클릭 시 상세 페이지로 이동하는 함수
const navigateToVideo = () => {
  router.push(`/video/${props.video.id}`)
}
</script>

<style scoped lang="scss"></style>
