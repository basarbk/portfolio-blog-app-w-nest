import { IsEmail } from 'class-validator';

export class LoginUser {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
