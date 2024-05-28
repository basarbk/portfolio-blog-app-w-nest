import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPublishToArticle1716926687483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'articles',
      new TableColumn({
        name: 'published',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'articles',
      new TableColumn({
        name: 'published_at',
        type: 'datetime',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('articles', 'published');
    await queryRunner.dropColumn('articles', 'published_at');
  }
}
