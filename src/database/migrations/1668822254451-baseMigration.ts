import {MigrationInterface, QueryRunner} from "typeorm";

export class baseMigration1668822254451 implements MigrationInterface {
    name = 'baseMigration1668822254451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" ADD "latitude" character varying`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "longitude" character varying`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "max_free_categories" integer NOT NULL DEFAULT '7'`);
        await queryRunner.query(`ALTER TABLE "request-directory" ALTER COLUMN "status" SET DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request-directory" ALTER COLUMN "status" SET DEFAULT 'pending'-directory_status_enum"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "max_free_categories"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "latitude"`);
    }

}
