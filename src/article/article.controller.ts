import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleRequest } from './dto/article-request.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';
import { Page } from '../shared/pagination/pagination.decorator';
import { Category, Pagination } from '../shared';
import { ArticleWithContent } from './dto/article-response.dto';

@Controller()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('articles')
  @UseGuards(AuthGuard)
  async createArticle(
    @Body() body: ArticleRequest,
    @CurrentUser() user: User,
  ): Promise<{ id: number }> {
    return this.articleService.save(body, user);
  }

  @Put('articles/:id')
  @UseGuards(AuthGuard)
  async updateArticle(
    @Body() body: ArticleRequest,
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<{ id: number }> {
    return this.articleService.update(id, body, user);
  }

  @Patch('articles/:id/publish')
  @UseGuards(AuthGuard)
  async publishArticle(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<{ published: boolean }> {
    return this.articleService.publish(id, user);
  }

  @Get('articles')
  async getArticles(
    @Page() page: Pagination,
    @CurrentUser() user: User,
    @Query('reaction') reaction: Category,
  ) {
    if (reaction) {
      return this.articleService.getReactedArticles(page, user, reaction);
    }
    return this.articleService.getArticles(page, user);
  }

  @Get('articles/:idOrSlug')
  async getArticleByIdOrSlug(
    @Param('idOrSlug') idOrSlug: string,
    @CurrentUser() user: User,
  ): Promise<ArticleWithContent> {
    return this.articleService.getArticleByIdOrSlug(idOrSlug, user);
  }

  @Get('users/:idOrHandle/articles')
  async getArticlesOfUser(
    @Page() page: Pagination,
    @Param('idOrHandle') idOrHandle: string,
    @CurrentUser() user: User,
  ) {
    return this.articleService.getArticlesOfUser(page, idOrHandle, user);
  }
}
