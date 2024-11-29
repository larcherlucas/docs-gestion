<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCategoryStore } from '../../stores/categories'
import { useToast } from 'vue-toastification'
import { BCard, BTable, BButton, BForm, BFormInput } from 'bootstrap-vue-next'
import { BModal } from 'bootstrap-vue-next'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue-next/dist/bootstrap-vue-next.css"
import "animate.css"

const categoryStore = useCategoryStore()
const toast = useToast()

const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const selectedCategory = ref<number | null>(null)
const categoryName = ref('')
const isSubmitting = ref(false)

onMounted(async () => {
  await categoryStore.fetchCategories()
})

function openCreateModal() {
  modalMode.value = 'create'
  categoryName.value = ''
  selectedCategory.value = null
  showModal.value = true
}

function openEditModal(category: { id: number; name: string }) {
  modalMode.value = 'edit'
  categoryName.value = category.name
  selectedCategory.value = category.id
  showModal.value = true
}

async function handleSubmit() {
  if (!categoryName.value.trim()) {
    toast.error('Le nom de la catégorie est requis')
    return
  }

  isSubmitting.value = true
  try {
    if (modalMode.value === 'create') {
      await categoryStore.createCategory(categoryName.value)
      toast.success('Catégorie créée avec succès')
    } else if (selectedCategory.value) {
      await categoryStore.updateCategory(selectedCategory.value, categoryName.value)
      toast.success('Catégorie mise à jour avec succès')
    }
    showModal.value = false
  } catch (error) {
    toast.error(modalMode.value === 'create'
      ? 'Échec de la création de la catégorie'
      : 'Échec de la mise à jour de la catégorie'
    )
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(categoryId: number) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return

  try {
    await categoryStore.deleteCategory(categoryId)
    toast.success('Catégorie supprimée avec succès')
  } catch (error) {
    toast.error('Échec de la suppression de la catégorie')
  }
}
</script>

<template>
  <div class="category-management animate__animated animate__fadeIn p-4">
    <BCard>
      <template #header>
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="text-primary mb-0">Gestion des Catégories</h2>
          <BButton 
            variant="gradient-primary" 
            @click="openCreateModal"
            class="btn-create-category"
          >
            <i class="fas fa-plus me-2"></i>Ajouter Catégorie
          </BButton>
        </div>
      </template>

      <BTable 
        :items="categoryStore.categories"
        :fields="[
          { key: 'name', label: 'Nom' },
          { key: 'createdAt', label: 'Date de création' },
          { key: 'actions', label: 'Actions' }
        ]"
        striped 
        hover
      >
        <template #cell(createdAt)="{ value }">
          {{ new Date(value).toLocaleDateString() }}
        </template>

        <template #cell(actions)="{ item }">
          <div class="btn-group" role="group">
            <BButton 
              variant="soft-primary" 
              size="sm" 
              @click="openEditModal(item)"
              class="me-2"
            >
              <i class="fas fa-edit me-1"></i>Modifier
            </BButton>
            <BButton 
              variant="soft-danger" 
              size="sm" 
              @click="handleDelete(item.id)"
            >
              <i class="fas fa-trash me-1"></i>Supprimer
            </BButton>
          </div>
        </template>

        <template #empty>
          <div class="text-center text-muted py-4">
            Aucune catégorie trouvée
          </div>
        </template>

        <template #loading>
          <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
        </template>
      </BTable>
    </BCard>

    <BModal 
      v-model="showModal" 
      :title="modalMode === 'create' ? 'Ajouter une Catégorie' : 'Modifier la Catégorie'"
      centered
      @ok="handleSubmit"
    >
      <BForm @submit.prevent="handleSubmit">
        <BFormInput
          v-model="categoryName"
          placeholder="Nom de la catégorie"
          required
          class="mb-3"
        />
      </BForm>

      <template #modal-footer="{ ok, cancel }">
        <BButton 
          variant="secondary" 
          @click="cancel()"
        >
          Annuler
        </BButton>
        <BButton 
          :variant="modalMode === 'create' ? 'primary' : 'success'"
          @click="ok()"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
          {{ modalMode === 'create' ? 'Créer' : 'Mettre à jour' }}
        </BButton>
      </template>
    </BModal>
  </div>
</template>

<style scoped>
.btn-create-category {
  transition: all 0.3s ease;
}

.btn-create-category:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-group .btn {
  display: inline-flex;
  align-items: center;
}

.btn-group .btn i {
  margin-right: 0.25rem;
}
</style>