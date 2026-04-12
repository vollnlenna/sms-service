import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  id_device: number;

  @IsString()
  phone_to: string;

  @IsString()
  text: string;
}
