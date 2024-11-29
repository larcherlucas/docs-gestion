import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category } from '../types/category'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([
    { 
      id: 1, 
      name: 'Documents Travail', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    },
    { 
      id: 2, 
      name: 'Documents Maison', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    },
    { 
      id: 3, 
      name: 'Documents Personnels', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    }
  ])

  const selectedCategory = ref<number | null>(null)

  function setSelectedCategory(categoryId: number | null) {
    selectedCategory.value = categoryId
  }

  // Ajout d'une méthode pour obtenir le nom d'une catégorie par son ID
  function getCategoryNameById(categoryId: number): string | undefined {
    return categories.value.find(cat => cat.id === categoryId)?.name
  }

  // Ajout d'une méthode pour ajouter une nouvelle catégorie
  function addCategory(name: string): Category {
    const newCategory: Category = {
      id: Date.now(), // Génère un ID unique
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    categories.value.push(newCategory)
    return newCategory
  }

  // Ajout d'une méthode pour supprimer une catégorie
  function deleteCategory(categoryId: number) {
    categories.value = categories.value.filter(cat => cat.id !== categoryId)
  }

  // Computed pour obtenir le nombre total de catégories
  const categoryCount = computed(() => categories.value.length)

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    getCategoryNameById,
    addCategory,
    deleteCategory,
    categoryCount
  }
})