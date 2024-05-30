import { IsEnum, IsNotEmpty, IsPositive } from 'class-validator';
import { Category } from '../../shared';

export class ReactionDTO {
  @IsEnum(Category, { message: 'Invalid category' })
  category: Category;

  @IsNotEmpty()
  entityType: string;

  @IsPositive()
  entityId: number;
}
