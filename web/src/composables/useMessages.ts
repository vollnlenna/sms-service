import { ref } from 'vue'
import http from '@/api/http'
import type { Message } from '@/entities/message'

export function useMessages(deviceId: number | null) {
  const sent = ref<Message[]>([])
  const received = ref<Message[]>([])
  const loading = ref(false)

  const loadSent = async () => {
    if (!deviceId) return
    loading.value = true
    try {
      const res = await http.get<Message[]>(`/messages/${deviceId}/sent`)
      sent.value = res.data
    } finally {
      loading.value = false
    }
  }

  const loadReceived = async () => {
    if (!deviceId) return
    loading.value = true
    try {
      const res = await http.get<Message[]>(`/messages/${deviceId}/received`)
      received.value = res.data
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (phone: string, text: string) => {
    if (!deviceId) throw new Error('deviceId missing')

    await http.post('/messages/internal', {
      id_device: deviceId,
      phone_to: phone,
      text,
    })
  }

  const deleteMessage = async (id: number) => {
    await http.delete(`/messages/${id}`)
    await loadSent()
    await loadReceived()
  }

  return {
    sent,
    received,
    loading,
    loadSent,
    loadReceived,
    sendMessage,
    deleteMessage,
  }
}
