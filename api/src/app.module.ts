import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { DevicesModule } from './devices/devices.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env'],
    }),
    DatabaseModule,
    DevicesModule,
    ApiKeysModule,
    MessagesModule,
  ],
})
export class AppModule {}
