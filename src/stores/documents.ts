import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Document } from '../types/document'

export const useDocumentStore = defineStore('documents', () => {
  const documents = ref<Document[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDocuments() {
    loading.value = true
    try {
      // Simulated API call
      const response = await axios.get('/api/documents')
      documents.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch documents'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function uploadDocument(formData: FormData) {
    loading.value = true
    try {
      const response = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      documents.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to upload document'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteDocument(id: number) {
    try {
      await axios.delete(`/api/documents/${id}`)
      documents.value = documents.value.filter(doc => doc.id !== id)
    } catch (err) {
      error.value = 'Failed to delete document'
      throw err
    }
  }

  async function updateDocument(id: number, updates: Partial<Document>) {
    try {
      const response = await axios.put(`/api/documents/${id}`, updates)
      const index = documents.value.findIndex(doc => doc.id === id)
      if (index !== -1) {
        documents.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to update document'
      throw err
    }
  }

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    updateDocument
  }
})