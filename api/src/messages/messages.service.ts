import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

export interface Message {
  id_message: number;
  id_device: number;
  phone_to: string;
  text: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: Date;
}

@Injectable()
export class MessagesService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async createMessage(
    id_device: number,
    phone_to: string,
    text: string,
  ): Promise<Message> {
    const deviceRes = await this.pool.query<{ is_active: boolean }>(
      `SELECT is_active FROM devices WHERE id_device = $1`,
      [id_device],
    );
    const isActive = deviceRes.rows[0]?.is_active;
    if (!isActive) {
      throw new ForbiddenException('Устройство не активно, отправка запрещена');
    }
    const result: QueryResult<Message> = await this.pool.query(
      `INSERT INTO messages (id_device, phone_to, text)
       VALUES ($1, $2, $3)
         RETURNING *`,
      [id_device, phone_to, text],
    );

    return result.rows[0];
  }

  async getPendingMessages(deviceId: number): Promise<Message[]> {
    const result: QueryResult<Message> = await this.pool.query(
      `SELECT *
       FROM messages
       WHERE id_device = $1 AND status = 'pending'
       ORDER BY created_at ASC`,
      [deviceId],
    );

    return result.rows;
  }

  async getSentMessages(deviceId: number): Promise<Message[]> {
    const result: QueryResult<Message> = await this.pool.query(
      `SELECT m.*
       FROM messages m
       WHERE m.id_device = $1
       ORDER BY m.created_at DESC`,
      [deviceId],
    );

    return result.rows;
  }

  async getReceivedMessages(deviceId: number): Promise<Message[]> {
    const result: QueryResult<Message & { phone_from: string }> =
      await this.pool.query(
        `SELECT m.*, d_sender.phone_number as phone_from
         FROM messages m
                JOIN devices d_receiver ON d_receiver.phone_number = m.phone_to
                JOIN devices d_sender ON d_sender.id_device = m.id_device
         WHERE d_receiver.id_device = $1
         ORDER BY m.created_at DESC`,
        [deviceId],
      );

    return result.rows;
  }

  async updateStatus(
    id_message: number,
    status: Message['status'],
  ): Promise<Message> {
    const result: QueryResult<Message> = await this.pool.query(
      `UPDATE messages
       SET status = $1
       WHERE id_message = $2
         RETURNING *`,
      [status, id_message],
    );

    return result.rows[0];
  }

  async deleteMessage(id_message: number): Promise<Message> {
    const result: QueryResult<Message> = await this.pool.query(
      `DELETE FROM messages
       WHERE id_message = $1
       RETURNING *`,
      [id_message],
    );

    return result.rows[0];
  }
}
