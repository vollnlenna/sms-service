export interface Message {
  id_message: number
  id_device: number
  phone_to: string
  text: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  created_at: string
}
