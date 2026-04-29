import { http } from './http.ts';

export type Device = {
  id_device: number;
  name: string;
  phone_number: string;
  is_active: boolean;
  created_at: string;
};

export async function registerDevice(payload: {
  name: string;
  phone_number: string;
}): Promise<Device> {
  const res = await http.post<Device>('/devices/register', payload);
  return res.data;
}
