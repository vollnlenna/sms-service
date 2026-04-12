import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { randomBytes } from 'crypto';

export interface ApiKey {
  id_api: number;
  id_device: number;
  key: string;
  created_at: Date;
}

@Injectable()
export class ApiKeysService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  private generateKey(): string {
    return randomBytes(32).toString('hex');
  }

  async createKey(id_device: number): Promise<ApiKey> {
    const key = this.generateKey();

    const result: QueryResult<ApiKey> = await this.pool.query(
      `INSERT INTO api_keys (id_device, key)
       VALUES ($1, $2)
       RETURNING *`,
      [id_device, key],
    );

    return result.rows[0];
  }

  async getKeysByDevice(id_device: number): Promise<ApiKey[]> {
    const result: QueryResult<ApiKey> = await this.pool.query(
      `SELECT * FROM api_keys
       WHERE id_device = $1
       ORDER BY created_at DESC`,
      [id_device],
    );

    return result.rows;
  }

  async deleteKey(id_api: number): Promise<ApiKey> {
    const result: QueryResult<ApiKey> = await this.pool.query(
      `DELETE FROM api_keys
       WHERE id_api = $1
       RETURNING *`,
      [id_api],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException('API key not found');
    }

    return result.rows[0];
  }
}
