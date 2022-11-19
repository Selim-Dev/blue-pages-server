import {MigrationInterface, QueryRunner} from "typeorm";

export class baseMigration1668751429163 implements MigrationInterface {
    name = 'baseMigration1668751429163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" ADD "logo" character varying`);
        await queryRunner.query(`ALTER TABLE "offer" ADD "logo_key" character varying`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "logo_ar" character varying`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "logo_ar_key" character varying`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "logo_en" character varying`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "logo_en_key" character varying`);
        await queryRunner.query(`ALTER TABLE "request-directory" DROP CONSTRAINT "FK_f58aebe930b28580a19d3489124"`);
        await queryRunner.query(`ALTER TABLE "request-directory" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "request-directory" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "logo" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "request-directory" ADD CONSTRAINT "FK_f58aebe930b28580a19d3489124" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request-directory" DROP CONSTRAINT "FK_f58aebe930b28580a19d3489124"`);
        await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "logo" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "request-directory" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "request-directory" ALTER COLUMN "status" SET DEFAULT 'pending'-directory_status_enum"`);
        await queryRunner.query(`ALTER TABLE "request-directory" ADD CONSTRAINT "FK_f58aebe930b28580a19d3489124" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "logo_en_key"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "logo_en"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "logo_ar_key"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "logo_ar"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "logo_key"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "logo"`);
    }

}
