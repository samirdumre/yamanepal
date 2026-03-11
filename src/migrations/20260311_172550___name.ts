import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_nav_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_trekking_dropdown_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header_trekking_dropdown_items" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP INDEX "users_email_idx";
  ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "username" varchar;
  UPDATE "users" SET "username" = lower(regexp_replace(regexp_replace(coalesce("name", ''), '[^a-zA-Z0-9\\s]', '', 'g'), '\\s+', '_', 'g'));
  UPDATE "users" SET "username" = 'user_' || "id" WHERE "username" IS NULL OR "username" = '';
  ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
  CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");
  DROP TYPE "public"."enum_header_nav_items_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "header_trekking_dropdown_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"trek_id" integer NOT NULL
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  DROP INDEX "users_username_idx";
  ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_trekking_dropdown_items" ADD CONSTRAINT "header_trekking_dropdown_items_trek_id_treks_id_fk" FOREIGN KEY ("trek_id") REFERENCES "public"."treks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_trekking_dropdown_items" ADD CONSTRAINT "header_trekking_dropdown_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_trekking_dropdown_items_order_idx" ON "header_trekking_dropdown_items" USING btree ("_order");
  CREATE INDEX "header_trekking_dropdown_items_parent_id_idx" ON "header_trekking_dropdown_items" USING btree ("_parent_id");
  CREATE INDEX "header_trekking_dropdown_items_trek_idx" ON "header_trekking_dropdown_items" USING btree ("trek_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  ALTER TABLE "users" DROP COLUMN "username";`)
}
