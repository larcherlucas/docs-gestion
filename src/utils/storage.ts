import { security } from './security'

const TOKEN_KEY = 'token'
const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'default-key'

export const storage = {
  getToken: (): string | null => {
    const encryptedToken = localStorage.getItem(TOKEN_KEY)
    if (!encryptedToken) return null
    try {
      const decryptedToken = security.decrypt(encryptedToken, STORAGE_KEY)
      // Vérification supplémentaire de la structure du token
      if (decryptedToken && decryptedToken.split('.').length === 3) {
        return decryptedToken
      }
      throw new Error('Token invalide')
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
  },

  setToken: (token: string): void => {
    const encryptedToken = security.encrypt(token, STORAGE_KEY)
    localStorage.setItem(TOKEN_KEY, encryptedToken)
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY)
  }
}