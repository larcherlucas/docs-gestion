import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import type { User } from '../types/auth'
import { loginUser, registerUser, refreshToken } from '../api/auth'
import { storage } from '../utils/storage'
import { security } from '../utils/security'
import { notifications } from '../utils/notifications'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(storage.getToken())
  const user = ref(null)
  const isAuthenticated = ref(!!token.value)
  let refreshTokenTimeout: number | null = null

  onMounted(() => {
    if (token.value) {
      try {
        const decoded = jwtDecode(token.value)
        user.value = decoded.user
        setupTokenRefresh(token.value)
      } catch (error) {
        console.error('Token Decoding Error:', error)
        storage.removeToken()
        token.value = null
        isAuthenticated.value = false
        notifications.error('Session expirée, veuillez vous reconnecter')
      }
    }
  })

  function setupTokenRefresh(token: string) {
    if (refreshTokenTimeout) {
      window.clearTimeout(refreshTokenTimeout)
    }

    try {
      const decoded = jwtDecode(token)
      const expiresIn = decoded.exp * 1000 - Date.now() - 60000

      refreshTokenTimeout = window.setTimeout(async () => {
        try {
          const response = await refreshToken()
          if (response.token) {
            updateAuth(response.token, response.user)
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          logout()
        }
      }, expiresIn)
    } catch (error) {
      console.error('Token refresh setup error:', error)
      logout()
    }
  }

  function updateAuth(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
    isAuthenticated.value = true
    storage.setToken(newToken)
    setupTokenRefresh(newToken)
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const sanitizedEmail = security.sanitizeInput(email)
      const response = await loginUser({ email: sanitizedEmail, password })
      
      if (response.token) {
        updateAuth(response.token, response.user)
        notifications.success('Connexion réussie !')
        return true
      }
      notifications.error('Échec de la connexion, mauvais identifiants')
      return false
    } catch (error) {
      notifications.error('Erreur lors de la connexion')
      return false
    }
  }

  async function register(userData: {
    email: string
    username: string
    password: string
  }): Promise<boolean> {
    try {
      const sanitizedData = {
        email: security.sanitizeInput(userData.email),
        username: security.sanitizeInput(userData.username),
        password: userData.password
      }
      
      const response = await registerUser(sanitizedData)
      
      if (response.token) {
        updateAuth(response.token, response.user)
        notifications.success('Inscription réussie !')
        return true
      }
      notifications.error('Échec de l\'inscription')
      return false
    } catch (error) {
      notifications.error('Erreur lors de l\'inscription')
      return false
    }
  }

  function logout() {
    if (refreshTokenTimeout) {
      window.clearTimeout(refreshTokenTimeout)
    }
    token.value = null
    user.value = null
    isAuthenticated.value = false
    storage.removeToken()
    notifications.success('Déconnexion réussie')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
})