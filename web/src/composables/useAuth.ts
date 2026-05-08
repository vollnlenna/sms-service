import { ref } from 'vue'
import http from '@/api/http'

const deviceId = ref<string | null>(null)

export function useAuth() {
  const init = () => {
    deviceId.value = localStorage.getItem('deviceId')
  }

  const login = async (id: string): Promise<boolean> => {
    try {
      const res = await http.get(`/devices/${id}`)

      if (!res.data) return false

      deviceId.value = id
      localStorage.setItem('deviceId', id)

      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    deviceId.value = null
    localStorage.removeItem('deviceId')
  }

  return {
    deviceId,
    isLoggedIn: deviceId,
    init,
    login,
    logout,
  }
}
