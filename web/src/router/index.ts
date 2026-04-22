import { createRouter, createWebHistory } from 'vue-router'

import StartPage from '../pages/StartPage.vue'
import DevicePage from '../pages/DevicePage.vue'
import ApiPage from '../pages/ApiPage.vue'
import SmsPage from '../pages/SmsPage.vue'

const routes = [
  { path: '/', redirect: '/start' },

  { path: '/start', component: StartPage },

  { path: '/device', component: DevicePage },
  { path: '/api-keys', component: ApiPage },
  { path: '/sms', component: SmsPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isAuth = !!localStorage.getItem('deviceId')

  if (!isAuth && to.path !== '/start') return '/start'
  if (isAuth && to.path === '/start') return '/sms'

  return true
})

export default router
