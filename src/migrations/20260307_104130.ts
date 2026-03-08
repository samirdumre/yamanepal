import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "treks_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"treks_id" integer
  );
  
  ALTER TABLE "treks" ADD COLUMN "show_recommended" boolean DEFAULT false;
  ALTER TABLE "treks_rels" ADD CONSTRAINT "treks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treks_rels" ADD CONSTRAINT "treks_rels_treks_fk" FOREIGN KEY ("treks_id") REFERENCES "public"."treks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "treks_rels_order_idx" ON "treks_rels" USING btree ("order");
  CREATE INDEX "treks_rels_parent_idx" ON "treks_rels" USING btree ("parent_id");
  CREATE INDEX "treks_rels_path_idx" ON "treks_rels" USING btree ("path");
  CREATE INDEX "treks_rels_treks_id_idx" ON "treks_rels" USING btree ("treks_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "treks_rels" CASCADE;
  ALTER TABLE "treks" DROP COLUMN "show_recommended";`)
}
