<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore } from '../../stores/documents'
import { useCategoryStore } from '../../stores/categories'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const documentStore = useDocumentStore()
const categoryStore = useCategoryStore()
const router = useRouter()
const toast = useToast()

const file = ref<File | null>(null)
const categoryId = ref<number | null>(null)
const preview = ref<string | null>(null)
const loading = ref(false)

const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const selectedFile = input.files[0]
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Type de fichier invalide. Veuillez télécharger des fichiers PDF, PNG ou JPG uniquement.')
      return
    }

    file.value = selectedFile
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = e => {
        preview.value = e.target?.result as string
      }
      reader.readAsDataURL(selectedFile)
    }
  }
}

async function handleUpload() {
  if (!file.value || !categoryId.value) {
    toast.error('Veuillez sélectionner un fichier et une catégorie')
    return
  }

  loading.value = true
  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('categoryId', categoryId.value.toString())

  try {
    const uploadedDocument = await documentStore.uploadDocument(formData)
    toast.success(`Document "${uploadedDocument.name}" téléchargé avec succès`)
    router.push('/dashboard/documents')
  } catch (error) {
    console.error('Erreur de téléchargement :', error)
    toast.error(error instanceof Error ? error.message : 'Échec du téléchargement du document')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="upload-document">
    <h2 class="mb-4">Télécharger un document</h2>
    
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="handleUpload">
          <div class="mb-3">
            <label class="form-label">Catégorie</label>
            <select 
              v-model="categoryId"
              class="form-select"
              required
            >
              <option value="" disabled selected>Sélectionnez une catégorie</option>
              <option 
                v-for="category in categoryStore.categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Document</label>
            <input
              type="file"
              class="form-control"
              accept=".pdf,.png,.jpg,.jpeg"
              @change="handleFileSelect"
              required
            />
            <small class="text-muted">
              Formats pris en charge : PDF, PNG, JPG
            </small>
          </div>

          <div v-if="preview" class="mb-3">
            <h6>Aperçu :</h6>
            <img :src="preview" class="img-thumbnail" style="max-height: 200px" />
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading || !file || !categoryId"
          >
            {{ loading ? 'Téléchargement en cours...' : 'Télécharger le document' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>