<template>
  <q-page padding>
    <div class="flex flex-center column q-pt-xl">
      <div class="text-h2 q-mt-xl q-mb-md">Login</div>
      <p class="text-subtitle1 q-mb-xl">Hello :)</p>
      <q-form class="q-gutter-lg" @submit.prevent="handleSignInSubmit">
        <q-input v-model="form.email" filled label="email" />

        <q-input
          v-model="form.password"
          filled
          type="password"
          label="password"
        />

        <q-input v-model="form.description" filled label="description" />

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
        <div v-if="error" class="q-mt-lg">
          {{ error }}
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { signUp } from '~/services/fetchData'
import { Notify } from 'quasar'
const error = ref<Error | null>(null)
const form = ref({
  email: '',
  password: '',
  description: '',
})
const loading = ref(false)

const handleSignInSubmit = async () => {
  loading.value = true
  await signUp(form.value.email, form.value.password, form.value.description)
  Notify.create({
    position: 'top',
    message: '회원가입 성공!!',
    color: 'deep-orange-4',
    type: 'success',
  })
  loading.value = false
  await navigateTo('/login')
}

const handleLoginSuccess = async () => {
  const { isAuthenticated } = storeToRefs(useAuthStore())
  await navigateTo('/')
}
</script>
