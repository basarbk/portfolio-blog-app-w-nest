import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Reaction } from '../reaction/reaction.entity';

@Entity({ name: 'articles' })
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ nullable: true })
  published_at: Date;

  @ManyToOne(() => User, (user) => user.articles)
  user: User;

  @OneToMany(() => Reaction, (reaction) => reaction.article)
  reactions: Reaction[];
}
