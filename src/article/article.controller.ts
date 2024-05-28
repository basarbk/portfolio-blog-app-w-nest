import { Body, Controller, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleRequest } from './dto/article-request.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async createArticle(@Body() body: ArticleRequest): Promise<{ id: number }> {
    return this.articleService.save(body);
  }
}
