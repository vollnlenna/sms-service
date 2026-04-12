import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register')
  register(@Body() body: RegisterDeviceDto) {
    return this.devicesService.registerDevice(body.name, body.phone_number);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.devicesService.getDeviceById(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.devicesService.deleteDevice(id);
  }

  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.devicesService.toggleDevice(id, true);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.devicesService.toggleDevice(id, false);
  }
}
