import { IsString } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  name: string;

  @IsString()
  phone_number: string;
}
