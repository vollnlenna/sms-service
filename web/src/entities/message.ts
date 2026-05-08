export interface Message {
  id_message: number
  id_device: number
  phone_to: string
  text: string
  status: 'pending' | 'sent' | 'failed'
  created_at: string
  phone_from?: string
}
