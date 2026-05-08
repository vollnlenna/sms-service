import { ref } from 'vue'
import http from '@/api/http'
import type { ApiKey } from '@/entities/apiKey'

export function useApiKeys(deviceId: number | null) {
  const keys = ref<ApiKey[]>([])
  const loading = ref(false)

  const loadKeys = async () => {
    if (!deviceId) {
      return
    }

    loading.value = true
    try {
      const res = await http.get<ApiKey[]>(`/api-keys/${deviceId}`)
      keys.value = res.data
    } catch (err) {
    } finally {
      loading.value = false
    }
  }

  const createKey = async () => {
    if (!deviceId) {
      return
    }

    try {
      await http.post<ApiKey>(`/api-keys/${deviceId}`)
      await loadKeys()
    } catch (err) {}
  }

  const deleteKey = async (id_api: number) => {
    try {
      await http.delete(`/api-keys/${id_api}`)
      await loadKeys()
    } catch (err) {}
  }

  return {
    keys,
    loading,
    loadKeys,
    createKey,
    deleteKey,
  }
}
