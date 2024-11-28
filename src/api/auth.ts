import axios from 'axios'
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/auth'
import { jwtDecode } from 'jwt-decode'

const API_URL = import.meta.env.VITE_API_URL || '/api'
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Simulated valid JWT tokens
const INITIAL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoibGFyY2hlci5sdWNhc0Bob3RtYWlsLmZyIiwibmFtZSI6Ikx1Y2FzIExhcmNoZXIifSwiZXhwIjoxNzk5ODY0MDAwfQ.fakeSignatureHere'
const REFRESHED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoibGFyY2hlci5sdWNhc0Bob3RtYWlsLmZyIiwibmFtZSI6Ikx1Y2FzIExhcmNoZXIifSwiZXhwIjoxODk5ODY0MDAwfQ.newFakeSignatureHere'

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  if (credentials.email === 'larcher.lucas@hotmail.fr' && credentials.password === 'MotdepasseL987') {
    const decoded = jwtDecode(INITIAL_TOKEN)
    return {
      token: INITIAL_TOKEN,
      user: {
        email: decoded.user.email,
        name: decoded.user.name
      }
    }
  } else {
    throw new Error('Invalid email or password')
  }
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  throw new Error('Registration is not supported in simulated mode')
}

export async function refreshToken(): Promise<AuthResponse> {
  const decoded = jwtDecode(REFRESHED_TOKEN)
  return {
    token: REFRESHED_TOKEN,
    user: {
      email: decoded.user.email,
      name: decoded.user.name
    }
  }
}