import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApiKeyGuard } from './api-key.guard';
import type { RequestWithDevice } from './request-with-device';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(ApiKeyGuard)
  @Post()
  createApi(@Body() body: CreateMessageDto, @Req() req: RequestWithDevice) {
    return this.messagesService.createMessage(
      req.device!.id_device,
      body.phone_to,
      body.text,
    );
  }

  @Post('internal')
  createInternal(@Body() body: CreateMessageDto & { id_device: number }) {
    return this.messagesService.createMessage(
      body.id_device,
      body.phone_to,
      body.text,
    );
  }

  @Get(':deviceId/sent')
  getSent(@Param('deviceId', ParseIntPipe) deviceId: number) {
    return this.messagesService.getSentMessages(deviceId);
  }

  @Get(':deviceId/received')
  getReceived(@Param('deviceId', ParseIntPipe) deviceId: number) {
    return this.messagesService.getReceivedMessages(deviceId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStatusDto,
  ) {
    return this.messagesService.updateStatus(id, body.status);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.deleteMessage(id);
  }
}
