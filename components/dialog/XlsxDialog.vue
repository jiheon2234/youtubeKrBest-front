<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="val => $emit('update:modelValue', val)"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card :style="{ width: '400px' }">
      <q-card-section class="flex">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      {{ targetDate }}
      {{ signedURL }}
      {{ pending }}

      <q-card-section class="q-px-xl q-pb-xl">
        <div class="text-center">
          <p>아래 버튼을 클릭하여 엑셀 파일을 다운로드하세요.</p>
          <q-btn
            label="엑셀 파일 다운로드"
            color="primary"
            icon="download"
            :disable="!signedURL"
            @click="downloadFile"
            :loading="pending"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useAsyncData } from 'nuxt/app'
import { fetchCloudfrontSignedURL } from '~/services/fetchData'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  modelValue: boolean
  targetDate: string
}>()

defineEmits(['update:modelValue'])

// 다운로드 URL (예시로 초기값 설정 가능)

const { currentUser } = useAuthStore()

const {
  data: signedURL,
  execute,
  pending,
} = await useAsyncData<string>(
  'keys',
  () => fetchCloudfrontSignedURL(props.targetDate, currentUser?.token),
  { immediate: true, default: () => 'a' },
)
// 파일 다운로드 함수
const downloadFile = () => {
  if (!signedURL.value) {
    console.error('Download URL is empty.')
    return
  }
  // 다운로드 링크 생성
  const link = document.createElement('a')
  location.href = signedURL.value
  // link.href = url.value
  // link.download = 'report.xlsx' // 기본 파일 이름 설정
  // document.body.appendChild(link)
  // link.click()
  // document.body.removeChild(link)
}
</script>

<style lang="scss" scoped></style>
