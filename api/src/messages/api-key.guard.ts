import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { RequestWithDevice } from './request-with-device';

type ApiKeyRow = {
  id_device: number;
};

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithDevice>();

    const apiKey = req.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('API key required');
    }

    const result: QueryResult<ApiKeyRow> = await this.pool.query(
      `SELECT id_device FROM api_keys WHERE key = $1`,
      [apiKey],
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid API key');
    }

    const device = result.rows[0];

    req.device = {
      id_device: device.id_device,
    };

    return true;
  }
}
