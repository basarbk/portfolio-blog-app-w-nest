import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './reaction.entity';
import { Repository } from 'typeorm';
import { ReactionDTO } from './dto/reaction.dto';
import { User } from '../user/user.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
  ) {}

  async toggleReaction(
    reactionDto: ReactionDTO,
    user: User,
  ): Promise<{ result: boolean }> {
    const reactionInDB = await this.reactionRepository.findOne({
      where: {
        category: reactionDto.category,
        article: {
          id: reactionDto.entityId,
        },
        user: {
          id: user.id,
        },
      },
    });
    if (reactionInDB) {
      await this.reactionRepository.delete(reactionInDB);
      return { result: false };
    } else {
      try {
        await this.reactionRepository.save({
          category: reactionDto.category,
          article: { id: reactionDto.entityId },
          user,
        });
        return { result: true };
      } catch {
        throw new NotFoundException('Entity not found');
      }
    }
  }
}
