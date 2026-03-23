import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header_travel_info_dropdown_items"
      ADD COLUMN IF NOT EXISTS "trek_id" integer;

    ALTER TABLE "header_travel_info_dropdown_items"
      DROP COLUMN IF EXISTS "label";

    ALTER TABLE "header_travel_info_dropdown_items"
      DROP COLUMN IF EXISTS "url";

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'header_travel_info_dropdown_items_trek_id_treks_id_fk'
      ) THEN
        ALTER TABLE "header_travel_info_dropdown_items"
          ADD CONSTRAINT "header_travel_info_dropdown_items_trek_id_treks_id_fk"
          FOREIGN KEY ("trek_id")
          REFERENCES "public"."treks"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "header_travel_info_dropdown_items_trek_idx"
      ON "header_travel_info_dropdown_items" USING btree ("trek_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header_travel_info_dropdown_items"
      DROP CONSTRAINT IF EXISTS "header_travel_info_dropdown_items_trek_id_treks_id_fk";

    DROP INDEX IF EXISTS "header_travel_info_dropdown_items_trek_idx";

    ALTER TABLE "header_travel_info_dropdown_items"
      ADD COLUMN IF NOT EXISTS "label" varchar;

    ALTER TABLE "header_travel_info_dropdown_items"
      ADD COLUMN IF NOT EXISTS "url" varchar;

    ALTER TABLE "header_travel_info_dropdown_items"
      DROP COLUMN IF EXISTS "trek_id";
  `)
}
