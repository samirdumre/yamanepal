import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'read', 'replied');
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"trek_name" varchar,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"no_of_travellers" numeric NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "inquiries_id" integer;
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inquiries" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "inquiries" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_inquiries_fk";
  
  DROP INDEX "payload_locked_documents_rels_inquiries_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "inquiries_id";
  DROP TYPE "public"."enum_inquiries_status";`)
}
