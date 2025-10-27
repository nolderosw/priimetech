import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InsertDefaultAdmin1761523621030 implements MigrationInterface {
  name = 'InsertDefaultAdmin1761523621030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash('admin', 10);

    await queryRunner.query(
      `
            INSERT INTO "users" ("id", "name", "email", "password", "role", "createdAt", "updatedAt")
            VALUES (
                gen_random_uuid(),
                'admin',
                'admin@priimetech.com',
                $1,
                'admin',
                NOW(),
                NOW()
            )
            ON CONFLICT ("email") DO NOTHING
        `,
      [hashedPassword],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "users" WHERE "email" = 'admin@priimetech.com'
        `);
  }
}
