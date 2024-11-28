import { ref } from 'vue'

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export function useFormValidation() {
  const errors = ref<Record<string, string>>({})

  const validateEmail = (email: string): boolean => {
    if (!email) {
      errors.value.email = 'Email is required'
      return false
    }
    if (!emailRegex.test(email)) {
      errors.value.email = 'Invalid email format'
      return false
    }
    delete errors.value.email
    return true
  }

  const validateUsername = (username: string): boolean => {
    if (!username) {
      errors.value.username = 'Username is required'
      return false
    }
    if (username.length < 3 || username.length > 20) {
      errors.value.username = 'Username must be between 3 and 20 characters'
      return false
    }
    delete errors.value.username
    return true
  }

  const validatePassword = (password: string): boolean => {
    if (!password) {
      errors.value.password = 'Password is required'
      return false
    }
    if (!passwordRegex.test(password)) {
      errors.value.password = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
      return false
    }
    delete errors.value.password
    return true
  }

  return {
    errors,
    validateEmail,
    validateUsername,
    validatePassword
  }
}