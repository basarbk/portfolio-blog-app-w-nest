import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticleRequest } from './dto/article-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Pagination, generateUniqueValue } from '../shared';
import { User } from '../user/user.entity';
import { ArticleWithContent, ShortArticle } from './dto/article-response.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  async save(value: ArticleRequest, user: User): Promise<{ id: number }> {
    const article = new Article();
    article.title = value.title;
    article.content = value.content;
    article.image = value.image;
    article.slug =
      encodeURIComponent(value.title.toLocaleLowerCase().replaceAll(' ', '-')) +
      '-' +
      generateUniqueValue(true);

    article.user = user;
    await this.articleRepository.save(article);
    return { id: article.id };
  }

  async update(
    id: number,
    value: ArticleRequest,
    user: User,
  ): Promise<{ id: number }> {
    const articleInDB = await this.getArticle(id, user);
    articleInDB.title = value.title;
    articleInDB.content = value.content;
    articleInDB.image = value.image;
    await this.articleRepository.save(articleInDB);
    return { id };
  }

  async publish(id: number, user: User): Promise<{ published: boolean }> {
    const articleInDB = await this.getArticle(id, user);
    articleInDB.published = !articleInDB.published;
    articleInDB.published_at = articleInDB.published ? new Date() : null;
    await this.articleRepository.save(articleInDB);
    return { published: articleInDB.published };
  }

  private async getArticle(id: number, user: User): Promise<Article> {
    const articleInDB = await this.articleRepository.findOne({
      where: { id },
      loadRelationIds: { disableMixedMap: true },
    });
    if (!articleInDB) {
      throw new NotFoundException();
    }

    if (articleInDB.user.id !== user.id) {
      throw new ForbiddenException();
    }
    return articleInDB;
  }

  async getArticles({ size, page, sort, direction }: Pagination) {
    const skip = page * size;
    const [content, count] = await this.articleRepository.findAndCount({
      where: {
        published: true,
      },
      skip,
      take: size,
      order: this.getOrder(sort, direction),
      relations: ['user'],
    });
    return {
      content: content.map((article) => new ShortArticle(article)),
      page,
      size,
      total: Math.ceil(count / size),
    };
  }

  private getOrder(sort: string, direction: string) {
    if (['id', 'published_at'].indexOf(sort) > -1) {
      return { [sort]: direction };
    }
    return {};
  }

  async getArticleByIdOrSlug(idOrSlug: string): Promise<ArticleWithContent> {
    const findOneOptions: FindOneOptions<Article> = { relations: ['user'] };
    if (Number.isInteger(Number(idOrSlug))) {
      findOneOptions.where = {
        id: Number(idOrSlug),
      };
    } else {
      findOneOptions.where = {
        slug: idOrSlug,
      };
    }
    const article = await this.articleRepository.findOne(findOneOptions);
    if (!article) {
      throw new NotFoundException();
    }
    return new ArticleWithContent(article);
  }
}
