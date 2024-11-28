import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '../types/category'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([
    { id: 1, name: 'Documents Travail', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: 'Documents Maison', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: 'Documents Personnels', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ])

  const selectedCategory = ref<number | null>(null)

  function setSelectedCategory(categoryId: number | null) {
    selectedCategory.value = categoryId
  }

  return {
    categories,
    selectedCategory,
    setSelectedCategory
  }
})