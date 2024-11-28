import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
   {
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/Login.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/auth/Register.vue')
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('../views/auth/ResetPassword.vue')
        }
      ]
    },
    {
      path: '/dashboard',
      component: () => import('../layouts/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/Dashboard.vue')
        },
        {
          path: 'documents',
          name: 'documents',
          component: () => import('../views/documents/DocumentList.vue')
        },
        {
          path: 'documents/:id/edit',
          name: 'edit-document',
          component: () => import('../views/documents/DocumentEditor.vue')
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('../views/categories/CategoryList.vue')
        },
        {
          path: 'upload',
          name: 'upload',
          component: () => import('../views/documents/UploadDocument.vue')
        }
      ]
    }
  ]
})

// Simplified navigation guard to allow all dashboard access
router.beforeEach((to, from, next) => {
  next()
})

export default router