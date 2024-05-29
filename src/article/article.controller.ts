import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleRequest } from './dto/article-request.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';
import { Page } from '../shared/pagination/pagination.decorator';
import { Pagination } from '../shared';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createArticle(
    @Body() body: ArticleRequest,
    @CurrentUser() user: User,
  ): Promise<{ id: number }> {
    return this.articleService.save(body, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateArticle(
    @Body() body: ArticleRequest,
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<{ id: number }> {
    return this.articleService.update(id, body, user);
  }

  @Patch('/:id/publish')
  @UseGuards(AuthGuard)
  async publishArticle(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<{ published: boolean }> {
    return this.articleService.publish(id, user);
  }

  @Get()
  async getArticles(@Page() page: Pagination) {
    return this.articleService.getArticles(page);
  }
}
