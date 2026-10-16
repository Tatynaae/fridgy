import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1791857602677 implements MigrationInterface {
  name = 'Init1791857602677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recipe_ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "recipe_id" uuid NOT NULL, "position" smallint NOT NULL DEFAULT '0', "name" character varying(120) NOT NULL, "quantity" numeric(10,2), "unit" character varying(30), "note" character varying(200), "is_available" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_8f15a314e55970414fc92ffb532" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f240137e0e13bed80bdf64fed5" ON "recipe_ingredients"  ("recipe_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "scan_ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scan_id" uuid NOT NULL, "name" character varying(120) NOT NULL, "quantity" numeric(10,2), "unit" character varying(30), "confidence" real, CONSTRAINT "PK_22b5e1a8797d41b37a8592e49dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e7389c05a7b2eca23cce104021" ON "scan_ingredients"  ("scan_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "suggestions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "recipe_id" uuid NOT NULL, "position" smallint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_cc3bb0c7eccc6689a1547c8c3b9" UNIQUE ("user_id", "position"), CONSTRAINT "PK_745bbcb037ac379969b5fc7b352" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7901b39ce6dc375f1f91c9a08" ON "suggestions"  ("recipe_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password_hash" character varying(255), "display_name" character varying(100), "preferences" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."scan_status" AS ENUM('pending', 'processing', 'completed', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "scans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "image_url" text, "description" text, "status" "public"."scan_status" NOT NULL DEFAULT 'pending', "error" text, "ai_response" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_41156c08314b9e541c1cb18c588" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd5a1474797f39e58fcbdccc48" ON "scans"  ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4e35c80d435d5ffd0d18642251" ON "scans"  ("user_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."recipe_source" AS ENUM('scan', 'suggestion')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."recipe_difficulty" AS ENUM('easy', 'medium', 'hard')`,
    );
    await queryRunner.query(
      `CREATE TABLE "recipes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "scan_id" uuid, "source" "public"."recipe_source" NOT NULL, "title" character varying(200) NOT NULL, "description" text, "instructions" jsonb NOT NULL DEFAULT '[]', "prep_time_minutes" smallint, "cook_time_minutes" smallint, "servings" smallint, "difficulty" "public"."recipe_difficulty", "calories" integer, "cuisine" character varying(60), "tags" text array NOT NULL DEFAULT '{}', "image_url" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8f09680a51bf3669c1598a21682" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9ee11de45ebc1b7fbd28336121" ON "recipes"  ("scan_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1bd21a3f9caec7cb59522f49ae" ON "recipes"  ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d3ef01959ac7684f9e544f87b" ON "recipes"  ("user_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites" ("user_id" uuid NOT NULL, "recipe_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_833a2c29bdd2e66eb4edd8e1b10" PRIMARY KEY ("user_id", "recipe_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f013a5737104974aa8b5716370" ON "favorites"  ("recipe_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_f240137e0e13bed80bdf64fed53" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scan_ingredients" ADD CONSTRAINT "FK_e7389c05a7b2eca23cce1040219" FOREIGN KEY ("scan_id") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suggestions" ADD CONSTRAINT "FK_d5f8b29a35d481f2c4200dae9e8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "suggestions" ADD CONSTRAINT "FK_c7901b39ce6dc375f1f91c9a08d" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scans" ADD CONSTRAINT "FK_b1d041293c86a1bfbd15c559385" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" ADD CONSTRAINT "FK_67d98fd6ff56c4340a811402154" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" ADD CONSTRAINT "FK_9ee11de45ebc1b7fbd283361211" FOREIGN KEY ("scan_id") REFERENCES "scans"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_f013a5737104974aa8b57163708" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_f013a5737104974aa8b57163708"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" DROP CONSTRAINT "FK_9ee11de45ebc1b7fbd283361211"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" DROP CONSTRAINT "FK_67d98fd6ff56c4340a811402154"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scans" DROP CONSTRAINT "FK_b1d041293c86a1bfbd15c559385"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suggestions" DROP CONSTRAINT "FK_c7901b39ce6dc375f1f91c9a08d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "suggestions" DROP CONSTRAINT "FK_d5f8b29a35d481f2c4200dae9e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scan_ingredients" DROP CONSTRAINT "FK_e7389c05a7b2eca23cce1040219"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_f240137e0e13bed80bdf64fed53"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f013a5737104974aa8b5716370"`,
    );
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d3ef01959ac7684f9e544f87b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1bd21a3f9caec7cb59522f49ae"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9ee11de45ebc1b7fbd28336121"`,
    );
    await queryRunner.query(`DROP TABLE "recipes"`);
    await queryRunner.query(`DROP TYPE "public"."recipe_difficulty"`);
    await queryRunner.query(`DROP TYPE "public"."recipe_source"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4e35c80d435d5ffd0d18642251"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd5a1474797f39e58fcbdccc48"`,
    );
    await queryRunner.query(`DROP TABLE "scans"`);
    await queryRunner.query(`DROP TYPE "public"."scan_status"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c7901b39ce6dc375f1f91c9a08"`,
    );
    await queryRunner.query(`DROP TABLE "suggestions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e7389c05a7b2eca23cce104021"`,
    );
    await queryRunner.query(`DROP TABLE "scan_ingredients"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f240137e0e13bed80bdf64fed5"`,
    );
    await queryRunner.query(`DROP TABLE "recipe_ingredients"`);
  }
}
