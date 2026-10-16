import { MigrationInterface, QueryRunner } from 'typeorm';

export class ScanImagePath1791859742371 implements MigrationInterface {
  name = 'ScanImagePath1791859742371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scans" RENAME COLUMN "image_url" TO "image_path"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scans" RENAME COLUMN "image_path" TO "image_url"`,
    );
  }
}
