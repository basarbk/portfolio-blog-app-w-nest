import { IsEmail } from 'class-validator';

export class CreateUser {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
