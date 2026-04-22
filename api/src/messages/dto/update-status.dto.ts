import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['pending', 'sent', 'delivered', 'failed'])
  status!: 'pending' | 'sent' | 'delivered' | 'failed';
}
