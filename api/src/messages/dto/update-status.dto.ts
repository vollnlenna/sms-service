import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['pending', 'sent', 'failed'])
  status!: 'pending' | 'sent' | 'failed';
}
