import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticleRequest } from './dto/article-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Category, Pagination, generateUniqueValue } from '../shared';
import { User } from '../user/user.entity';
import { ArticleWithContent, ShortArticle } from './dto/article-response.dto';
import { ReactionService } from '../reaction/reaction.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    private reactionService: ReactionService,
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

  async getArticles(page: Pagination, user: User) {
    const where: FindOptionsWhere<Article> = { published: true };
    return this.getArticlePage(page, where, user);
  }

  async getArticlesOfUser(page: Pagination, idOrHandle: string, user: User) {
    const where: FindOptionsWhere<Article> = {};

    if (Number.isInteger(Number(idOrHandle))) {
      where.user = { id: Number(idOrHandle) };
      where.published = user?.id === Number(idOrHandle) ? undefined : true;
    } else {
      where.user = { handle: idOrHandle };
      where.published = user?.handle === idOrHandle ? undefined : true;
    }
    return this.getArticlePage(page, where, user);
  }

  async getReactedArticles(page: Pagination, user: User, reaction: Category) {
    const where: FindOptionsWhere<Article> = {
      published: true,
      reactions: {
        category: reaction,
        user: {
          id: user.id,
        },
      },
    };
    return this.getArticlePage(page, where, user);
  }

  private async getArticlePage(
    { size, page, sort, direction }: Pagination,
    where: FindOptionsWhere<Article>,
    user: User,
  ) {
    const skip = page * size;
    const [content, count] = await this.articleRepository.findAndCount({
      where,
      skip,
      take: size,
      order: this.getOrder(sort, direction),
      relations: ['user'],
    });

    const mappedContent = await this.mapToArticleWithReactions(content, user);

    return {
      content: mappedContent,
      page,
      size,
      total: Math.ceil(count / size),
    };
  }

  private async mapToArticleWithReactions(articles: Article[], user: User) {
    const articlesWithReactions = [];
    for (const article of articles) {
      const reactions = await this.reactionService.getArticleReactions(
        article,
        user,
      );
      articlesWithReactions.push(new ShortArticle(article, reactions));
    }
    return articlesWithReactions;
  }

  private getOrder(sort: string, direction: string) {
    if (['id', 'published_at'].indexOf(sort) > -1) {
      return { [sort]: direction };
    }
    return {};
  }

  async getArticleByIdOrSlug(
    idOrSlug: string,
    user: User,
  ): Promise<ArticleWithContent> {
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

    if (!article.published) {
      if (!user) throw new NotFoundException();
      if (article.user.id !== user.id) throw new NotFoundException();
    }

    const reactions = await this.reactionService.getArticleReactions(
      article,
      user,
    );

    return new ArticleWithContent(article, reactions);
  }
}
