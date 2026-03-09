import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "header_trekking_dropdown_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"trek_id" integer NOT NULL
  );
  
  CREATE TABLE "header_top_treks_dropdown_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"trek_id" integer NOT NULL
  );
  
  CREATE TABLE "header_travel_info_dropdown_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "header_company_dropdown_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "header_trekking_dropdown_items" ADD CONSTRAINT "header_trekking_dropdown_items_trek_id_treks_id_fk" FOREIGN KEY ("trek_id") REFERENCES "public"."treks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_trekking_dropdown_items" ADD CONSTRAINT "header_trekking_dropdown_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_top_treks_dropdown_items" ADD CONSTRAINT "header_top_treks_dropdown_items_trek_id_treks_id_fk" FOREIGN KEY ("trek_id") REFERENCES "public"."treks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_top_treks_dropdown_items" ADD CONSTRAINT "header_top_treks_dropdown_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_travel_info_dropdown_items" ADD CONSTRAINT "header_travel_info_dropdown_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_company_dropdown_items" ADD CONSTRAINT "header_company_dropdown_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_trekking_dropdown_items_order_idx" ON "header_trekking_dropdown_items" USING btree ("_order");
  CREATE INDEX "header_trekking_dropdown_items_parent_id_idx" ON "header_trekking_dropdown_items" USING btree ("_parent_id");
  CREATE INDEX "header_trekking_dropdown_items_trek_idx" ON "header_trekking_dropdown_items" USING btree ("trek_id");
  CREATE INDEX "header_top_treks_dropdown_items_order_idx" ON "header_top_treks_dropdown_items" USING btree ("_order");
  CREATE INDEX "header_top_treks_dropdown_items_parent_id_idx" ON "header_top_treks_dropdown_items" USING btree ("_parent_id");
  CREATE INDEX "header_top_treks_dropdown_items_trek_idx" ON "header_top_treks_dropdown_items" USING btree ("trek_id");
  CREATE INDEX "header_travel_info_dropdown_items_order_idx" ON "header_travel_info_dropdown_items" USING btree ("_order");
  CREATE INDEX "header_travel_info_dropdown_items_parent_id_idx" ON "header_travel_info_dropdown_items" USING btree ("_parent_id");
  CREATE INDEX "header_company_dropdown_items_order_idx" ON "header_company_dropdown_items" USING btree ("_order");
  CREATE INDEX "header_company_dropdown_items_parent_id_idx" ON "header_company_dropdown_items" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "header_trekking_dropdown_items" CASCADE;
  DROP TABLE "header_top_treks_dropdown_items" CASCADE;
  DROP TABLE "header_travel_info_dropdown_items" CASCADE;
  DROP TABLE "header_company_dropdown_items" CASCADE;`)
}
