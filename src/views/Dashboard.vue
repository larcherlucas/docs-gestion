<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../stores/categories'
import { useDocumentStore } from '../stores/documents'
import { BCard, BButton, BTable, BBadge, BSpinner } from 'bootstrap-vue-next'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue-next/dist/bootstrap-vue-next.css"
import "animate.css"

const router = useRouter()
const categoryStore = useCategoryStore()
const documentStore = useDocumentStore()
const currentDateTime = ref(new Date())
const isLoading = ref(false)

let timeInterval: number

onMounted(() => {
  timeInterval = setInterval(() => {
    currentDateTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timeInterval)
})

function handleCategoryChange(event: Event) {
  const select = event.target as HTMLSelectElement
  categoryStore.setSelectedCategory(select.value ? parseInt(select.value) : null)
}

function navigateToUpload() {
  isLoading.value = true
  setTimeout(() => {
    router.push('/dashboard/upload')
  }, 500)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date)
}

function getStatusVariant(status: string) {
  switch(status) {
    case 'Récent': return 'success'
    case 'En cours': return 'warning'
    default: return 'secondary'
  }
}

// Calculer les documents filtrés en fonction de la catégorie sélectionnée
const filteredDocuments = computed(() => {
  if (!categoryStore.selectedCategory) {
    return documentStore.sortedDocuments
  }
  return documentStore.sortedDocuments.filter(doc => doc.categoryId === categoryStore.selectedCategory)
})
</script>

<template>
  <div class="dashboard p-4 animate__animated animate__fadeIn">
    <div class="row mb-4">
      <div class="col-12">
        <BCard class="shadow-sm border-0 animate__animated animate__fadeInDown" header-class="d-flex justify-content-between align-items-center">
          <template #header>
            <h5 class="mb-0 text-primary">Tableau de bord</h5>
            <div class="current-time text-muted">
              {{ formatDate(currentDateTime) }}
            </div>
          </template>
        </BCard>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-md-6">
        <BCard title="Catégories" class="shadow-sm border-0 animate__animated animate__fadeInLeft">
          <select class="form-select w-100" @change="handleCategoryChange" :value="categoryStore.selectedCategory">
            <option value="">Toutes les catégories</option>
            <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </BCard>
      </div>
      <div class="col-md-6">
        <BCard title="Actions" class="shadow-sm border-0 animate__animated animate__fadeInRight">
          <BButton variant="primary" block @click="navigateToUpload" :disabled="isLoading">
            <BSpinner v-if="isLoading" small></BSpinner>
            {{ isLoading ? 'Chargement...' : 'Insérer un document' }}
          </BButton>
        </BCard>
      </div>
    </div>
    <!-- Liste des documents -->
    <div class="row">
      <div class="col-12">
        <BCard title="Liste des documents" class="shadow-sm border-0 animate__animated animate__fadeInUp">
          <!-- Vérification s'il y a des documents -->
          <div v-if="filteredDocuments.length === 0" class="text-center py-4">
            <p class="text-muted">Aucun document actuellement.</p>
          </div>
          <BTable v-else :items="filteredDocuments" :fields="[
            { key: 'name', label: 'Nom' },
            { key: 'category', label: 'Catégorie' },
            { key: 'modifiedAt', label: 'Modifié le' },
            { key: 'size', label: 'Taille' },
            { key: 'status', label: 'Statut' },
          ]" striped hover responsive>
            <template #cell(modifiedAt)="{ value }">
              {{ formatDate(value) }}
            </template>
            <template #cell(status)="{ value }">
              <BBadge :variant="getStatusVariant(value)">
                {{ value }}
              </BBadge>
            </template>
          </BTable>
        </BCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.current-time {
  font-size: 0.9rem;
  font-weight: 500;
}
.card {
  transition: transform 0.3s ease-in-out;
}
.card:hover {
  transform: scale(1.02);
}
.btn-primary {
  transition: all 0.3s ease;
}
.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
