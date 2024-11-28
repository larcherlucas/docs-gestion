<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  router.push('/auth/login')
})
</script>

<template>
  <router-view></router-view>
</template>