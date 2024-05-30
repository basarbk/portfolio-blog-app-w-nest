import { Controller } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}
}
