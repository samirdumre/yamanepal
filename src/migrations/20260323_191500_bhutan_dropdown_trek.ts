import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "header_bhutan_treks_dropdown_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "trek_id" integer NOT NULL
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'header_bhutan_treks_dropdown_items_trek_id_treks_id_fk'
      ) THEN
        ALTER TABLE "header_bhutan_treks_dropdown_items"
          ADD CONSTRAINT "header_bhutan_treks_dropdown_items_trek_id_treks_id_fk"
          FOREIGN KEY ("trek_id")
          REFERENCES "public"."treks"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'header_bhutan_treks_dropdown_items_parent_id_fk'
      ) THEN
        ALTER TABLE "header_bhutan_treks_dropdown_items"
          ADD CONSTRAINT "header_bhutan_treks_dropdown_items_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."header"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "header_bhutan_treks_dropdown_items_order_idx"
      ON "header_bhutan_treks_dropdown_items" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "header_bhutan_treks_dropdown_items_parent_id_idx"
      ON "header_bhutan_treks_dropdown_items" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "header_bhutan_treks_dropdown_items_trek_idx"
      ON "header_bhutan_treks_dropdown_items" USING btree ("trek_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "header_bhutan_treks_dropdown_items" CASCADE;
  `)
}
