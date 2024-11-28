import CryptoJS from 'crypto-js'
import { jwtDecode } from 'jwt-decode'

export interface JWTPayload {
  exp: number
  sub: string
  iat: number
}

export const security = {
  // Encrypt sensitive data before storing in localStorage
  encrypt: (data: string, key: string): string => {
    return CryptoJS.AES.encrypt(data, key).toString()
  },

  // Decrypt data from localStorage
  decrypt: (encryptedData: string, key: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key)
    return bytes.toString(CryptoJS.enc.Utf8)
  },

  // Check if token is expired or about to expire (within 5 minutes)
  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      const currentTime = Date.now() / 1000
      return decoded.exp <= currentTime + 300 // 5 minutes buffer
    } catch {
      return true
    }
  },

  // Sanitize user input to prevent XSS
  sanitizeInput: (input: string): string => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}
