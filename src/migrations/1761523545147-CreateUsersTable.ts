import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1761523545147 implements MigrationInterface {
  name = 'CreateUsersTable1761523545147';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "users_role_enum" AS ENUM('admin', 'user')
        `);

    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "users_role_enum" NOT NULL DEFAULT 'user',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "access_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "email" character varying NOT NULL,
                "action" character varying NOT NULL,
                "ip" character varying NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_access_logs" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_access_logs_userId" ON "access_logs" ("userId")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_access_logs_email" ON "access_logs" ("email")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_access_logs_email"`);
    await queryRunner.query(`DROP INDEX "IDX_access_logs_userId"`);
    await queryRunner.query(`DROP TABLE "access_logs"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "users_role_enum"`);
  }
}
