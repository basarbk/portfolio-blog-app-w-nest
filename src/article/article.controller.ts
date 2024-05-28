import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleRequest } from './dto/article-request.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createArticle(@Body() body: ArticleRequest): Promise<{ id: number }> {
    return this.articleService.save(body);
  }
}
