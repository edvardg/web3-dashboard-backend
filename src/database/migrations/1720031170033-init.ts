import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1720031170033 implements MigrationInterface {
  name = 'Init1720031170033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" "public"."project_type_enum" NOT NULL, "logo" character varying NOT NULL, "price" integer NOT NULL, "contractAddress" character varying NOT NULL, CONSTRAINT "UQ_ae1fd9875a2e747234a85fa1c7f" UNIQUE ("contractAddress"), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_dedfea394088ed136ddadeee89" ON "project" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "user_project" ("id" SERIAL NOT NULL, "bookmarked" boolean NOT NULL, "userId" integer, "projectId" integer, CONSTRAINT "PK_72a40468c3924e43b934542e8e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b88a18e4faeea3bce60d70a4ae" ON "user_project" ("userId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2a37107e0b3bdb06b4920a64bb" ON "user_project" ("userId", "projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "walletAddress" character varying NOT NULL, CONSTRAINT "UQ_efbd1135797e451d834bcf88cd2" UNIQUE ("walletAddress"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD CONSTRAINT "FK_b88a18e4faeea3bce60d70a4ae3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD CONSTRAINT "FK_cb5415b5e54f476329451212e9b" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_project" DROP CONSTRAINT "FK_cb5415b5e54f476329451212e9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" DROP CONSTRAINT "FK_b88a18e4faeea3bce60d70a4ae3"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2a37107e0b3bdb06b4920a64bb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b88a18e4faeea3bce60d70a4ae"`);
    await queryRunner.query(`DROP TABLE "user_project"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dedfea394088ed136ddadeee89"`);
    await queryRunner.query(`DROP TABLE "project"`);
  }
}
