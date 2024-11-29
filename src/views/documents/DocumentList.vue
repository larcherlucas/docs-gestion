<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '../../stores/documents'
import { useCategoryStore } from '../../stores/categories'
import { 
  BCard, 
  BButton, 
  BTable, 
  BBadge, 
  BSpinner,
  BButtonGroup,
  BModal 
} from 'bootstrap-vue-next'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue-next/dist/bootstrap-vue-next.css"
import "animate.css"

const router = useRouter()
const documentStore = useDocumentStore()
const categoryStore = useCategoryStore()

const showDeleteModal = ref(false)
const selectedDocument = ref<number | null>(null)
const isLoading = ref(false)

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function getStatusVariant(status: string) {
  switch(status) {
    case 'Récent': return 'success'
    case 'En cours': return 'warning'
    default: return 'secondary'
  }
}

function navigateToUpload() {
  isLoading.value = true
  setTimeout(() => {
    router.push('/dashboard/upload')
  }, 500)
}

function handleEdit(documentId: number) {
  router.push(`/dashboard/documents/${documentId}/edit`)
}

function confirmDelete(documentId: number) {
  selectedDocument.value = documentId
  showDeleteModal.value = true
}

function handleDelete() {
  if (!selectedDocument.value) return

  documentStore.deleteDocument(selectedDocument.value)
  showDeleteModal.value = false
  selectedDocument.value = null
}
</script>

<template>
  <div class="dashboard p-4 animate__animated animate__fadeIn">
    <div class="row mb-4">
      <div class="col-12">
        <BCard 
          class="shadow-sm border-0 animate__animated animate__fadeInDown"
        >
          <div class="d-flex justify-content-between align-items-center">
            <h2 class="text-primary mb-0">Documents</h2>
            <BButton 
              variant="primary" 
              @click="navigateToUpload"
              :disabled="isLoading"
              class="animate__animated animate__pulse"
            >
              <BSpinner v-if="isLoading" small class="mr-2"></BSpinner>
              {{ isLoading ? 'Chargement...' : '+ Nouveau document' }}
            </BButton>
          </div>
        </BCard>
      </div>
    </div>

    <BCard 
      title="Liste des documents" 
      class="shadow-sm border-0 animate__animated animate__fadeInUp"
    >
      <BTable 
        :items="documentStore.sortedDocuments"
        :fields="[
          { key: 'name', label: 'Nom' },
          { key: 'category', label: 'Catégorie' },
          { key: 'modifiedAt', label: 'Modifié le' },
          { key: 'size', label: 'Taille' },
          { key: 'status', label: 'Statut' },
          { key: 'actions', label: 'Actions' }
        ]"
        striped 
        hover
        responsive
      >
        <template #cell(modifiedAt)="{ value }">
          {{ formatDate(value) }}
        </template>

        <template #cell(size)="{ value }">
          {{ Math.round(value / 1024) }} Ko
        </template>

        <template #cell(status)="{ value }">
          <BBadge :variant="getStatusVariant(value)">
            {{ value }}
          </BBadge>
        </template>

        <template #cell(actions)="{ item }">
          <BButtonGroup size="sm">
            <BButton 
              variant="outline-primary" 
              @click="handleEdit(item.id)"
            >
              Modifier
            </BButton>
            <BButton 
              variant="outline-danger" 
              @click="confirmDelete(item.id)"
            >
              Supprimer
            </BButton>
          </BButtonGroup>
        </template>
      </BTable>
    </BCard>

    <BModal 
      v-model="showDeleteModal"
      title="Confirmer la suppression" 
      header-bg-variant="danger" 
      header-text-variant="white"
      centered
      @ok="handleDelete"
    >
      <p class="text-center">
        Êtes-vous sûr de vouloir supprimer ce document ? 
        Cette action est irréversible.
      </p>
      <template #footer="{ ok, cancel }">
        <BButton variant="secondary" @click="cancel()">
          Annuler
        </BButton>
        <BButton variant="danger" @click="ok()">
          Supprimer
        </BButton>
      </template>
    </BModal>
  </div>
</template>