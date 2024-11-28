import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()

export const notifications = {
  success: (message: string) => {
    toast.success(message, {
      timeout: 3000,
      position: 'top-right',
      closeOnClick: true
    })
  },

  error: (message: string) => {
    toast.error(message, {
      timeout: 5000,
      position: 'top-right',
      closeOnClick: true
    })
  },

  warning: (message: string) => {
    toast.warning(message, {
      timeout: 4000,
      position: 'top-right',
      closeOnClick: true
    })
  },

  confirm: async (title: string, text: string) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    })
    return result.isConfirmed
  }
}
