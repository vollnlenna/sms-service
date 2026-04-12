import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post(':deviceId')
  create(@Param('deviceId', ParseIntPipe) deviceId: number) {
    return this.apiKeysService.createKey(deviceId);
  }

  @Get(':deviceId')
  getByDevice(@Param('deviceId', ParseIntPipe) deviceId: number) {
    return this.apiKeysService.getKeysByDevice(deviceId);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.apiKeysService.deleteKey(id);
  }
}
