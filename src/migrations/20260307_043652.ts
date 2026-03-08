import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "treks_group_pricing_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"price" numeric NOT NULL
  );
  
  ALTER TABLE "treks" ADD COLUMN "group_pricing_enabled" boolean DEFAULT false;
  ALTER TABLE "treks_group_pricing_tiers" ADD CONSTRAINT "treks_group_pricing_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "treks_group_pricing_tiers_order_idx" ON "treks_group_pricing_tiers" USING btree ("_order");
  CREATE INDEX "treks_group_pricing_tiers_parent_id_idx" ON "treks_group_pricing_tiers" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "treks_group_pricing_tiers" CASCADE;
  ALTER TABLE "treks" DROP COLUMN "group_pricing_enabled";`)
}
