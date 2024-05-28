import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryColumn()
  token: string;

  @ManyToOne(() => User, (user) => user.tokens)
  user: User;
}
