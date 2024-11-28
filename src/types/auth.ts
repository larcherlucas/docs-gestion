export interface User {
  id: number
  email: string
  username: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}