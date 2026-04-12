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
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() body: CreateMessageDto) {
    return this.messagesService.createMessage(
      body.id_device,
      body.phone_to,
      body.text,
    );
  }

  @Get(':deviceId')
  getByDevice(@Param('deviceId', ParseIntPipe) deviceId: number) {
    return this.messagesService.getMessagesByDevice(deviceId);
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
