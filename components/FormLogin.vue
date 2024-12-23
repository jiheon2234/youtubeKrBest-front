<template>
  <q-form class="q-gutter-lg" @submit.prevent="handleLoginSubmit">
    <q-input v-model="form.email" filled label="email" />

    <q-input v-model="form.password" filled type="password" label="password" />

    <div class="q-mt-lg">
      <q-btn
        class="full-width"
        label="Login"
        type="submit"
        size="lg"
        color="primary"
        no-caps
        :loading="loading"
      />
    </div>
    <a href="/signUp">회원가입</a>
    <div v-if="error" class="q-mt-lg">
      {{ error }}
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const emit = defineEmits<{
  success: []
}>()
const { signIn } = useAuthStore()

const form = ref({
  email: '',
  password: '',
})
const error = ref<Error | null>(null)
const loading = ref(false)

const handleLoginSubmit = async () => {
  try {
    error.value = null
    loading.value = true

    await signIn(form.value.email, form.value.password)
    emit('success')
  } catch (err: unknown) {
    debugger
    if (err instanceof Error) {
      error.value = err
    } else {
      throw err
    }
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 1500)
  }
}
</script>

<style scoped></style>
