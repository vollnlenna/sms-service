import { Injectable, Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

export interface Message {
  id_message: number;
  id_device: number;
  phone_to: string;
  text: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
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
    const result: QueryResult<Message> = await this.pool.query(
      `INSERT INTO messages (id_device, phone_to, text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id_device, phone_to, text],
    );

    return result.rows[0];
  }

  async getMessagesByDevice(id_device: number): Promise<Message[]> {
    const result: QueryResult<Message> = await this.pool.query(
      `SELECT * FROM messages
       WHERE id_device = $1
       ORDER BY created_at DESC`,
      [id_device],
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
