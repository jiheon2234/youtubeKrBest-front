<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-2">
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <NuxtLink v-slot="{ navigate }" custom to="/">
          <q-toolbar-title class="cursor-pointer" @click="navigate"
            >PopularYoutubeVideos</q-toolbar-title
          >
        </NuxtLink>
        <NuxtLink v-slot="{ navigate }" custom to="/">
          <q-btn stretch flat no-caps @click="navigate" />
        </NuxtLink>
        <q-separator dark vertical />

        <q-separator dark vertical />
        <!--        <q-btn stretch flat no-caps @click="moveYoutube" />-->
        <q-separator dark vertical />
        <NuxtLink v-slot="{ navigate }" custom to="/admin">
          <q-btn stretch flat label="admin" no-caps @click="navigate" />
        </NuxtLink>
        <q-separator dark vertical />

        <q-separator dark vertical />
        <!-- <ClientOnly> -->
        <NuxtLink v-if="isAuthenticated" v-slot="{ navigate }" custom to="/tbd">
          <q-btn stretch flat :label="currentUser?.token" />
        </NuxtLink>
        <NuxtLink
          v-if="!isAuthenticated"
          v-slot="{ navigate }"
          custom
          to="/login"
        >
          <q-btn stretch flat label="login" no-caps @click="navigate()" />
        </NuxtLink>
        <q-btn v-else stretch flat label="logout" no-caps @click="signOut" />
        <!-- </ClientOnly> -->
      </q-toolbar>
    </q-header>
    <q-page-container :style="pageContainerStyle">
      <!-- <ClientOnly> -->

      <!-- </ClientOnly> -->
      <slot></slot>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const pageContainerStyle = computed(() => ({
  maxWidth: '1080px',
  margin: '0 auto',
}))

const authStore = useAuthStore()
const { currentUser, isAuthenticated } = storeToRefs(authStore)
const { signOut } = authStore
</script>
