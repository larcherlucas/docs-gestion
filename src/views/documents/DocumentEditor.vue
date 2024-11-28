<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentStore } from '../../stores/documents'
import { useToast } from 'vue-toastification'
import { fabric } from 'fabric'
import { PDFDocument } from 'pdf-lib'
import VuePdfEmbed from 'vue-pdf-embed'

const route = useRoute()
const router = useRouter()
const documentStore = useDocumentStore()
const toast = useToast()

const documentId = Number(route.params.id)
const canvas = ref<fabric.Canvas | null>(null)
const pdfUrl = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(true)
const saving = ref(false)

const tools = ref({
  highlight: false,
  annotate: false,
  strikethrough: false,
  signature: false
})

onMounted(async () => {
  try {
    // Initialize fabric canvas
    canvas.value = new fabric.Canvas('editor-canvas', {
      isDrawingMode: false,
      width: 800,
      height: 1000
    })

    // Load document
    const document = documentStore.documents.find(doc => doc.id === documentId)
    if (document) {
      pdfUrl.value = document.fileUrl
    }
  } catch (error) {
    toast.error('Failed to load document')
  } finally {
    loading.value = false
  }
})

function setActiveTool(toolName: keyof typeof tools.value) {
  // Reset all tools
  Object.keys(tools.value).forEach(key => {
    tools.value[key as keyof typeof tools.value] = false
  })
  
  // Enable selected tool
  tools.value[toolName] = true

  if (canvas.value) {
    canvas.value.isDrawingMode = toolName === 'signature'
    if (toolName === 'signature') {
      canvas.value.freeDrawingBrush.width = 2
      canvas.value.freeDrawingBrush.color = '#000000'
    }
  }
}

async function handleHighlight() {
  if (!canvas.value) return

  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    width: 200,
    height: 30,
    fill: 'yellow',
    opacity: 0.3,
    selectable: true
  })

  canvas.value.add(rect)
  canvas.value.renderAll()
}

async function handleAnnotate() {
  if (!canvas.value) return

  const text = new fabric.IText('Add annotation here', {
    left: 100,
    top: 100,
    fontSize: 16,
    fill: 'red'
  })

  canvas.value.add(text)
  canvas.value.renderAll()
}

async function handleStrikethrough() {
  if (!canvas.value) return

  const line = new fabric.Line([100, 100, 300, 100], {
    stroke: 'red',
    strokeWidth: 2
  })

  canvas.value.add(line)
  canvas.value.renderAll()
}

async function saveChanges() {
  if (!canvas.value) return

  saving.value = true
  try {
    // Convert canvas to image
    const modifiedImage = canvas.value.toDataURL()
    
    // In a real implementation, you would:
    // 1. Send the modified image to the backend
    // 2. Have the backend merge it with the original PDF
    // 3. Save the result
    
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    toast.success('Changes saved successfully')
    router.push('/dashboard/documents')
  } catch (error) {
    toast.error('Failed to save changes')
  } finally {
    saving.value = false
  }
}

function clearCanvas() {
  if (canvas.value) {
    canvas.value.clear()
    canvas.value.renderAll()
  }
}
</script>

<template>
  <div class="document-editor">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Edit Document</h2>
      <div class="btn-group">
        <button
          class="btn btn-secondary"
          @click="router.push('/dashboard/documents')"
        >
          Cancel
        </button>
        <button
          class="btn btn-primary"
          @click="saveChanges"
          :disabled="saving"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-9">
        <div class="card">
          <div class="card-body">
            <div v-if="loading" class="text-center p-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else>
              <div class="document-container">
                <VuePdfEmbed
                  v-if="pdfUrl"
                  :source="pdfUrl"
                  :page="currentPage"
                  @loaded="totalPages = $event"
                />
                <canvas id="editor-canvas"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Tools</h5>
            <div class="d-grid gap-2">
              <button
                class="btn btn-outline-primary"
                :class="{ active: tools.highlight }"
                @click="setActiveTool('highlight')"
              >
                Highlight
              </button>
              <button
                class="btn btn-outline-primary"
                :class="{ active: tools.annotate }"
                @click="setActiveTool('annotate')"
              >
                Add Annotation
              </button>
              <button
                class="btn btn-outline-primary"
                :class="{ active: tools.strikethrough }"
                @click="setActiveTool('strikethrough')"
              >
                Strikethrough
              </button>
              <button
                class="btn btn-outline-primary"
                :class="{ active: tools.signature }"
                @click="setActiveTool('signature')"
              >
                Sign Document
              </button>
              <button
                class="btn btn-outline-danger"
                @click="clearCanvas"
              >
                Clear All Changes
              </button>
            </div>
          </div>
        </div>

        <div class="card mt-3" v-if="totalPages > 1">
          <div class="card-body">
            <h5 class="card-title">Pages</h5>
            <div class="d-flex justify-content-between align-items-center">
              <button
                class="btn btn-sm btn-outline-primary"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                Previous
              </button>
              <span>{{ currentPage }} / {{ totalPages }}</span>
              <button
                class="btn btn-sm btn-outline-primary"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.document-editor {
  .document-container {
    position: relative;
    width: 100%;
    min-height: 800px;
    background: #f8f9fa;
    
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
    }
  }
}
</style>