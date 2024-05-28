import { Injectable } from '@nestjs/common';
import { ArticleRequest } from './dto/article-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { generateUniqueValue } from '../shared';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  async save(value: ArticleRequest): Promise<{ id: number }> {
    const article = new Article();
    article.title = value.title;
    article.content = value.content;
    article.image = value.image;
    article.slug =
      encodeURIComponent(value.title.toLocaleLowerCase().replaceAll(' ', '-')) +
      '-' +
      generateUniqueValue(true);

    await this.articleRepository.save(article);
    return { id: article.id };
  }
}
