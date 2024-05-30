import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../shared';
import { User } from '../user/user.entity';
import { Article } from '../article/article.entity';

@Entity({ name: 'reactions' })
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: Category;

  @ManyToOne(() => User, (user) => user.reactions)
  user: User;

  @ManyToOne(() => Article, (article) => article.reactions)
  article: Article;
}
