<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useFormValidation } from '../../utils/validators'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const { errors, validateEmail, validateUsername, validatePassword } = useFormValidation()

const email = ref('')
const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleRegister() {
  const isEmailValid = validateEmail(email.value)
  const isUsernameValid = validateUsername(username.value)
  const isPasswordValid = validatePassword(password.value)

  if (!isEmailValid || !isUsernameValid || !isPasswordValid) {
    return
  }

  loading.value = true
  try {
    const success = await auth.register({
      email: email.value,
      username: username.value,
      password: password.value
    })
    if (success) {
      toast.success('Registration successful!')
      router.push('/dashboard')
    }
  } catch (error) {
    toast.error('Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <div class="card">
      <div class="card-body">
        <h2 class="text-center mb-4">Register</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              id="email"
              v-model="email"
              @blur="validateEmail(email)"
              required
            />
            <div class="invalid-feedback" v-if="errors.email">
              {{ errors.email }}
            </div>
          </div>
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.username }"
              id="username"
              v-model="username"
              @blur="validateUsername(username)"
              required
            />
            <div class="invalid-feedback" v-if="errors.username">
              {{ errors.username }}
            </div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              id="password"
              v-model="password"
              @blur="validatePassword(password)"
              required
            />
            <div class="invalid-feedback" v-if="errors.password">
              {{ errors.password }}
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="loading"
          >
            {{ loading ? 'Loading...' : 'Register' }}
          </button>
        </form>
        <div class="mt-3 text-center">
          Already have an account?
          <router-link to="/auth/login">Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.register-container {
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