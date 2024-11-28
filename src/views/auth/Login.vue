<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    toast.error('Please fill in all fields')
    return
  }

  loading.value = true
  try {
    const success = await auth.login(email.value, password.value)
    if (success) {
      toast.success('Login successful!')
      router.push('/dashboard')
    } else {
      toast.error('Invalid credentials')
    }
  } catch (error) {
    toast.error('An error occurred during login')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="card">
      <div class="card-body">
        <h2 class="text-center mb-4">Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
              required
            />
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="loading"
          >
            {{ loading ? 'Loading...' : 'Login' }}
          </button>
        </form>
        <div class="mt-3 text-center">
          <router-link to="/auth/reset-password">Forgot password?</router-link>
        </div>
        <div class="mt-2 text-center">
          Don't have an account?
          <router-link to="/auth/register">Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  
  .card {
    width: 100%;
    max-width: 400px;
  }
}
</style>