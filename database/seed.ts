import { Article } from '../src/article/article.entity';
import { Token } from '../src/auth/token.entity';
import { Reaction } from '../src/reaction/reaction.entity';
import { Category } from '../src/shared';
import { User } from '../src/user/user.entity';
import DataSource from './config';
import { LoremIpsum } from 'lorem-ipsum';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 8,
    min: 4,
  },
});

const generateSlug = (title) => {
  return (
    encodeURIComponent(title.toLocaleLowerCase().replaceAll(' ', '-')) +
    '-' +
    crypto.randomUUID().split('-')[0]
  );
};

const run = async () => {
  await DataSource.initialize();

  const userRepository = DataSource.getRepository(User);
  const articleRepository = DataSource.getRepository(Article);
  const tokenRepository = DataSource.getRepository(Token);
  const reactionRepository = DataSource.getRepository(Reaction);
  const usersInDB = await userRepository.find();
  if (usersInDB.length > 0) {
    await userRepository.remove(usersInDB);
  }

  const users = [];
  const articles = [];

  for (let i = 1; i < 11; i++) {
    const user = new User();
    user.name = `user${i}`;
    user.handle = `user${i}`;
    user.email = `user${i}@mail.com`;
    await userRepository.save(user);
    users.push(user);
    const token = new Token();
    token.token = `token-${user.name}`;
    token.user = user;
    await tokenRepository.save(token);

    for (let j = 0; j < 5; j++) {
      const article = new Article();
      lorem.format = 'plain';
      article.title = lorem.generateWords(5);
      article.slug = generateSlug(article.title);
      lorem.format = 'html';
      article.content = lorem.formatString(lorem.generateParagraphs(2));
      if (j < 4) {
        article.published = true;
        article.published_at = new Date();
      }
      article.user = user;
      await articleRepository.save(article);
      articles.push(article);
    }
  }

  const categories: Category[] = [
    Category.hot,
    Category.like,
    Category.readingList,
  ];
  for (const article of articles) {
    if (!article.published) {
      continue;
    }

    for (const user of users) {
      const index = Math.floor(Math.random() * 3);
      const reaction = new Reaction();
      reaction.article = article;
      reaction.user = user;
      reaction.category = categories[index];
      await reactionRepository.save(reaction);
    }
  }
};

run();
