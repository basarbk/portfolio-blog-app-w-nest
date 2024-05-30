import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Token } from '../auth/token.entity';
import { Article } from '../article/article.entity';
import { Reaction } from '../reaction/reaction.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  handle: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  registrationToken: string;

  @Column({ nullable: true })
  loginToken: string;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];
}
