import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "destinations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "destinations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_destinations_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_destinations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "destinations_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "destinations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"packs_count" numeric NOT NULL,
  	"region" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "destinations_id" integer;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "destinations_image_idx" ON "destinations" USING btree ("image_id");
  CREATE INDEX "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
  CREATE INDEX "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_destinations_id_idx" ON "payload_locked_documents_rels" USING btree ("destinations_id");`)
}
