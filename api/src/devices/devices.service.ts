import { Injectable, Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

export interface Device {
  id_device: number;
  name: string;
  phone_number: string;
  is_active: boolean;
  created_at: Date;
}

@Injectable()
export class DevicesService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  private generateDeviceId(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private async generateUniqueDeviceId(): Promise<number> {
    while (true) {
      const id = this.generateDeviceId();

      const check: QueryResult = await this.pool.query(
        'SELECT 1 FROM devices WHERE id_device = $1',
        [id],
      );

      if (check.rows.length === 0) return id;
    }
  }

  async registerDevice(name: string, phone: string): Promise<Device> {
    const existing: QueryResult<Device> = await this.pool.query(
      `SELECT *
     FROM devices
     WHERE phone_number = $1
     LIMIT 1`,
      [phone],
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const id_device = await this.generateUniqueDeviceId();

    const result: QueryResult<Device> = await this.pool.query(
      `INSERT INTO devices (id_device, name, phone_number)
       VALUES ($1, $2, $3)
         RETURNING *`,
      [id_device, name, phone],
    );

    return result.rows[0];
  }

  async getDeviceById(id: number): Promise<Device> {
    const result: QueryResult<Device> = await this.pool.query(
      `SELECT * FROM devices WHERE id_device = $1`,
      [id],
    );

    return result.rows[0];
  }

  async deleteDevice(id: number): Promise<Device> {
    const result: QueryResult<Device> = await this.pool.query(
      `DELETE FROM devices
       WHERE id_device = $1
         RETURNING *`,
      [id],
    );

    return result.rows[0];
  }

  async toggleDevice(id: number, isActive: boolean): Promise<Device> {
    const result: QueryResult<Device> = await this.pool.query(
      `UPDATE devices
       SET is_active = $1
       WHERE id_device = $2
         RETURNING *`,
      [isActive, id],
    );

    return result.rows[0];
  }
}
