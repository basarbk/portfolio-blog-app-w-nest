import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './reaction.entity';
import { Repository } from 'typeorm';
import { ReactionDTO } from './dto/reaction.dto';
import { User } from '../user/user.entity';
import { Reactions } from '../shared';
import { Article } from '../article/article.entity';

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

  async getArticleReactions(article: Article, user: User): Promise<Reactions> {
    const reactions: Reactions = {
      hot: {
        count: 0,
        reacted: false,
      },
      like: {
        count: 0,
        reacted: false,
      },
      readingList: {
        count: 0,
        reacted: false,
      },
    };

    let selectQuery = 'category, count(*) as count';
    if (user) {
      selectQuery += `, SUM(CASE WHEN userId=${user?.id} THEN 1 ELSE 0 END) > 0 as reacted`;
    }

    const result = await this.reactionRepository
      .createQueryBuilder()
      .select(selectQuery)
      .where('articleId = :id', { id: article.id })
      .groupBy('category')
      .getRawMany();

    for (const rawItem of result) {
      reactions[rawItem.category].count = rawItem.count;
      reactions[rawItem.category].reacted = !!rawItem.reacted;
    }

    return reactions;
  }
}
