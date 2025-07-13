import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPriceAndRemoveAmount1752439482262 implements MigrationInterface {
    name = 'AddPriceAndRemoveAmount1752439482262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_items" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "store_items" DROP COLUMN "barcode_value"`);
        await queryRunner.query(`ALTER TABLE "store_items" DROP COLUMN "amount"`);
        await queryRunner.query(`CREATE TYPE "public"."store_items_categories_enum" AS ENUM('Art', 'Household', 'Tools', 'Other')`);
        // 1) add as nullable with default
        await queryRunner.query(
          `ALTER TABLE "store_items" ADD "categories" "public"."store_items_categories_enum" array DEFAULT ARRAY['Other']::"public"."store_items_categories_enum"[]`
        );
        await queryRunner.query(`ALTER TABLE "store_items" ADD "price" numeric(5,2) NOT NULL DEFAULT '0'`);

        // 2) populate randomly
        await queryRunner.query(`
          UPDATE "store_items"
          SET "categories" = ARRAY[
            (ARRAY['Art','Household','Tools','Other']::"public"."store_items_categories_enum"[])[floor(random() * 4) + 1]
          ]
          WHERE "categories" IS NULL
        `);
        // 3) enforce NOT NULL and keep default
        await queryRunner.query(`ALTER TABLE "store_items" ALTER COLUMN "categories" SET NOT NULL`);
        await queryRunner.query(
          `UPDATE "store_items" SET "price" = ROUND((RANDOM() * (10 - 2) + 2)::numeric, 1)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_items" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "store_items" DROP COLUMN "categories"`);
        await queryRunner.query(`DROP TYPE "public"."store_items_categories_enum"`);
        await queryRunner.query(`ALTER TABLE "store_items" ADD "amount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "store_items" ADD "barcode_value" character varying`);
        await queryRunner.query(`ALTER TABLE "store_items" ADD "brand" character varying NOT NULL`);
    }

}
