import { ref } from 'vue'
import http from '@/api/http'
import type { Device } from '@/entities/device'

export function useDevice() {
  const device = ref<Device | null>(null)
  const loading = ref(false)

  const loadDevice = async () => {
    const id = localStorage.getItem('deviceId')
    if (!id) return

    loading.value = true
    try {
      const res = await http.get<Device>(`/devices/${id}`)
      device.value = res.data
    } finally {
      loading.value = false
    }
  }

  const toggleActive = async () => {
    if (!device.value) return

    const id = device.value.id_device

    if (device.value.is_active) {
      await http.patch(`/devices/${id}/deactivate`)
    } else {
      await http.patch(`/devices/${id}/activate`)
    }

    await loadDevice()
  }

  return {
    device,
    loading,
    loadDevice,
    toggleActive,
  }
}
