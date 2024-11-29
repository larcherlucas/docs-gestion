import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCategoryStore } from './categories'

export interface Document {
  id: number
  name: string
  categoryId: number
  category: string  
  modifiedAt: Date
  status: string
  fileUrl: string
  size: number
  fileType: string
  fileBase64: string  
}

export const useDocumentStore = defineStore('documents', () => {
  const documents = ref<Document[]>(
    JSON.parse(localStorage.getItem('documents') || '[]').map((doc: Document) => ({
      ...doc,
      modifiedAt: new Date(doc.modifiedAt)
    }))
  )

  function saveDocuments() {
    localStorage.setItem('documents', JSON.stringify(documents.value))
  }

  function revokeDocumentUrl(fileUrl: string) {
    URL.revokeObjectURL(fileUrl)
  }

  function getCategoryNameById(categoryId: number): string {
    const categoryStore = useCategoryStore()
    const category = categoryStore.categories.find(cat => cat.id === categoryId)
    return category ? category.name : ''
  }

  function uploadDocument(formData: FormData): Document {
    const file = formData.get('file') as File
    const categoryId = parseInt(formData.get('categoryId') as string)

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const fileBase64 = reader.result as string

      const newDocument: Document = {
        id: Date.now(),
        name: file.name,
        categoryId: categoryId,
        category: getCategoryNameById(categoryId), 
        modifiedAt: new Date(),
        status: 'Récent',
        fileUrl: URL.createObjectURL(file),
        size: file.size,
        fileType: file.type,
        fileBase64: fileBase64  
      }

      documents.value.push(newDocument)
      saveDocuments()
    }

    return documents.value[documents.value.length - 1]
  }

  function deleteDocument(id: number) {
    const docToDelete = documents.value.find(doc => doc.id === id)
    if (docToDelete) {
      revokeDocumentUrl(docToDelete.fileUrl)
    }
    documents.value = documents.value.filter(doc => doc.id !== id)
    saveDocuments()
  }

  function updateDocument(id: number, updates: Partial<Document>) {
    const index = documents.value.findIndex(doc => doc.id === id)
    if (index !== -1) {
      documents.value[index] = {
        ...documents.value[index],
        ...updates,
        modifiedAt: new Date()
      }
      saveDocuments()
    }
  }

  const sortedDocuments = computed(() =>
    [...documents.value].sort((a, b) =>
      b.modifiedAt.getTime() - a.modifiedAt.getTime()
    )
  )

  return {
    documents,
    sortedDocuments,
    uploadDocument,
    deleteDocument,
    updateDocument
  }
})
