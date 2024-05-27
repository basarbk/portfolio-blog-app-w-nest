import { IsEmail, Validate } from 'class-validator';
import { UniqueEmail } from '../validator/unique-email.validator';

export class CreateUser {
  @IsEmail({}, { message: 'Invalid email format' })
  @Validate(UniqueEmail)
  email: string;
}
