import {MigrationInterface, QueryRunner} from "typeorm";

export class baseMigration1668673351963 implements MigrationInterface {
    name = 'baseMigration1668673351963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request-directory" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_7e3791c6351f63eaf655522c700"`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "companyId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_7e3791c6351f63eaf655522c700" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_7e3791c6351f63eaf655522c700"`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "companyId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_7e3791c6351f63eaf655522c700" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request-directory" ALTER COLUMN "status" SET DEFAULT 'pending'-directory_status_enum"`);
    }

}
