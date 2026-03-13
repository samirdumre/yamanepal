import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TYPE enum_treks_difficulty RENAME VALUE 'Easy' TO '初級';`)
  await db.execute(sql`ALTER TYPE enum_treks_difficulty RENAME VALUE 'Moderate' TO '中級';`)
  await db.execute(sql`ALTER TYPE enum_treks_difficulty RENAME VALUE 'Hard' TO '上級';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TYPE enum_treks_difficulty RENAME VALUE '初級' TO 'Easy';`)
  await db.execute(sql`ALTER TYPE enum_treks_difficulty RENAME VALUE '中級' TO 'Moderate';`)
  await db.execute(sql`ALTER TYPE enum_treks_difficulty RENAME VALUE '上級' TO 'Hard';`)
}
