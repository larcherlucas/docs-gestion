<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/auth/login')
}
</script>

<template>
  <div class="dashboard-layout">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Digital Vault</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard/documents">My Documents</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard/categories">Categories</router-link>
            </li>
          </ul>
          <button class="btn btn-outline-light" @click="handleLogout">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="dashboard-content">
      <div class="container-fluid py-4">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .dashboard-content {
    flex: 1;
    background-color: #f8f9fa;
  }
}
</style>