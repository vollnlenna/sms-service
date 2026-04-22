import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  phone_to!: string;

  @IsString()
  text!: string;
}
