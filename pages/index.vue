<template>
  <q-page class="main-page">
    <q-card class="q-pa-md intro-card" flat bordered>
      <!-- 프로젝트 제목 -->
      <q-card-section class="text-center">
        <div class="title">Popular YouTube Videos</div>
        <div class="subtitle">
          특정 날짜의 가장 인기 있었던 유튜브 영상을 확인해보세요!
        </div>
      </q-card-section>
      <!-- 소개 이미지 -->

      <q-card-section class="q-mt-md">
        <div class="row items-center justify-center q-gutter-md">
          <!-- 로고 이미지 -->
          <NuxtLink v-slot="{ navigate }" custom to="/video" class="col-auto">
            <q-img
              src="/images/youtube_logo_main.png"
              class="cursor-pointer col-6"
              @click="navigate"
            />
          </NuxtLink>

          <!-- 날짜 선택기 -->
          <div class="col-auto">
            <q-date v-model="calenderDate" dense />
          </div>
        </div>
      </q-card-section>

      <!-- 주요 기능 소개 -->
      <q-card-section class="q-mt-md">
        <div class="features-title">주요 기능</div>
        <q-list bordered>
          <q-item>
            <q-item-section>
              <q-item-label>날짜별 인기 영상 검색</q-item-label>
              <q-item-label caption>
                원하는 날짜를 선택하면 해당 날짜의 인기 유튜브 영상 목록을
                제공합니다.
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>영상 바로가기</q-item-label>
              <q-item-label caption>
                클릭 한 번으로 유튜브에서 영상을 바로 확인하세요.
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>심플한 UI</q-item-label>
              <q-item-label caption>
                누구나 쉽게 사용할 수 있는 직관적인 인터페이스.
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!-- 시작 버튼 -->
      <q-card-section class="q-mt-md flex flex-center">
        <NuxtLink to="/search">
          <q-btn label="시작하기" color="primary" size="lg" unelevated />
        </NuxtLink>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped lang="scss"></style>
<script setup lang="ts">
import { ref } from 'vue'
import { date } from 'quasar'
const yesterday = date.formatDate(
  date.subtractFromDate(new Date(), { days: 1 }), // 오늘 날짜에서 1일 빼기
  'YYYY/MM/DD', // 원하는 포맷 지정
) //
const calenderDate = ref(yesterday)
const router = useRouter()
watch(calenderDate, newDate => {
  router.push({
    path: '/video',
    query: { targetDate: date.formatDate(newDate, 'YYYY-MM-DD') },
  })
})
</script>
