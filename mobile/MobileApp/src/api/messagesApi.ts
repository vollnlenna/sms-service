import { http } from './http';

export type MessageStatus = 'pending' | 'sent' | 'failed';

export type Message = {
  id_message: number;
  id_device: number;
  phone_to: string;
  text: string;
  status: MessageStatus;
  created_at: string;
  phone_from?: string;
};

export async function createInternalMessage(payload: {
  id_device: number;
  phone_to: string;
  text: string;
}): Promise<Message> {
  const res = await http.post<Message>('/messages/internal', payload);
  return res.data as Message;
}

export async function updateMessageStatus(
  id_message: number,
  status: MessageStatus,
): Promise<Message> {
  const res = await http.patch<Message>(`/messages/${id_message}/status`, {
    status,
  });
  return res.data as Message;
}

export async function getSentMessages(deviceId: number): Promise<Message[]> {
  const res = await http.get<Message[]>(`/messages/${deviceId}/sent`);
  return res.data as Message[];
}

export async function getReceivedMessages(
  deviceId: number,
): Promise<Message[]> {
  const res = await http.get<Message[]>(`/messages/${deviceId}/received`);
  return res.data as Message[];
}

export async function getPendingMessages(deviceId: number): Promise<Message[]> {
  const res = await http.get<Message[]>(`/messages/${deviceId}/pending`);
  return res.data as Message[];
}

export async function deleteMessage(id_message: number): Promise<void> {
  await http.delete(`/messages/${id_message}`);
}
