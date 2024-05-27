import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUser } from './dto/create-user.dto';
import { EmailService } from '../email/email.service';
import { generateUniqueValue } from '../shared';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async createUser(body: CreateUser): Promise<void> {
    const user = new User();
    user.email = body.email;
    user.name = body.email.split('@')[0];
    user.handle = user.name;

    const userInDB = await this.userRepository.findOneBy({
      handle: user.handle,
    });
    if (userInDB) {
      user.handle = user.name + generateUniqueValue(true);
    }

    user.registrationToken = generateUniqueValue();
    try {
      await this.userRepository.save(user);
      await this.emailService.sendSignUpEmail(
        user.email,
        user.registrationToken,
      );
    } catch (exception) {
      if (exception.message.includes('UNIQUE constraint')) {
        throw new BadRequestException('Invalid request', {
          cause: [{ property: 'email', constraints: ['Email is in use'] }],
        });
      }
      throw new BadGatewayException('Server error');
    }
  }
}
