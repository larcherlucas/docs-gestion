<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (auth.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>

<template>
  <div class="auth-layout">
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
}
</style>