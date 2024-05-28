import { IsEnum, IsNotEmpty } from 'class-validator';
import { Operation } from '../../shared';

export class AuthRequest {
  @IsNotEmpty()
  token: string;

  @IsEnum(Operation, { message: 'Invalid operation' })
  operation: Operation;
}
