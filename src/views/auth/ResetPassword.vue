<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useFormValidation } from '../../utils/validators'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()
const { validateEmail } = useFormValidation()

const email = ref('')
const loading = ref(false)
const resetSent = ref(false)

async function handleSubmit() {
  if (!validateEmail(email.value)) {
    return
  }

  loading.value = true
  try {
    // This would be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    resetSent.value = true
    toast.success('Password reset instructions have been sent to your email')
  } catch (error) {
    toast.error('Failed to send reset instructions. Please try again.')
  } finally {
    loading.value = false
  }
}

function handleBackToLogin() {
  router.push('/auth/login')
}
</script>

<template>
  <div class="reset-password-container">
    <div class="card">
      <div class="card-body">
        <h2 class="text-center mb-4">Reset Password</h2>
        
        <template v-if="!resetSent">
          <p class="text-muted mb-4">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"
                required
                :disabled="loading"
              />
            </div>
            
            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="loading"
            >
              {{ loading ? 'Sending...' : 'Send Reset Instructions' }}
            </button>
          </form>
        </template>

        <template v-else>
          <div class="text-center">
            <div class="alert alert-success mb-4">
              Reset instructions have been sent to your email.
              Please check your inbox and follow the instructions to reset your password.
            </div>
            
            <button
              class="btn btn-primary"
              @click="handleBackToLogin"
            >
              Back to Login
            </button>
          </div>
        </template>

        <div class="mt-3 text-center">
          <router-link to="/auth/login">
            Back to Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reset-password-container {
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