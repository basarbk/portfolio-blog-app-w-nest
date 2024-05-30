import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';
import { ReactionDTO } from './dto/reaction.dto';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  @UseGuards(AuthGuard)
  async toggleReaction(
    @CurrentUser() user: User,
    @Body() reaction: ReactionDTO,
  ): Promise<{ result: boolean }> {
    return this.reactionService.toggleReaction(reaction, user);
  }
}
