import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_trekking_dropdown_regions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"region_id" integer NOT NULL
  );
  
  ALTER TABLE "treks" ADD COLUMN "region_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "regions_id" integer;
  ALTER TABLE "regions" ADD CONSTRAINT "regions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_trekking_dropdown_regions" ADD CONSTRAINT "header_trekking_dropdown_regions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_trekking_dropdown_regions" ADD CONSTRAINT "header_trekking_dropdown_regions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "regions_slug_idx" ON "regions" USING btree ("slug");
  CREATE INDEX "regions_image_idx" ON "regions" USING btree ("image_id");
  CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
  CREATE INDEX "header_trekking_dropdown_regions_order_idx" ON "header_trekking_dropdown_regions" USING btree ("_order");
  CREATE INDEX "header_trekking_dropdown_regions_parent_id_idx" ON "header_trekking_dropdown_regions" USING btree ("_parent_id");
  CREATE INDEX "header_trekking_dropdown_regions_region_idx" ON "header_trekking_dropdown_regions" USING btree ("region_id");
  ALTER TABLE "treks" ADD CONSTRAINT "treks_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "treks_region_idx" ON "treks" USING btree ("region_id");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "regions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_trekking_dropdown_regions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "regions" CASCADE;
  DROP TABLE "header_trekking_dropdown_regions" CASCADE;
  ALTER TABLE "treks" DROP CONSTRAINT "treks_region_id_regions_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_regions_fk";
  
  DROP INDEX "treks_region_idx";
  DROP INDEX "payload_locked_documents_rels_regions_id_idx";
  ALTER TABLE "treks" DROP COLUMN "region_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "regions_id";`)
}
