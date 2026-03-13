import 'dotenv/config'

import { getPayload } from 'payload'
import config from '../src/payload.config'

type LegacyDifficulty = 'Easy' | 'Moderate' | 'Hard' | '初級' | '中級' | '上級'

const difficultyMap: Record<'Easy' | 'Moderate' | 'Hard', '初級' | '中級' | '上級'> = {
  Easy: '初級',
  Moderate: '中級',
  Hard: '上級',
}

function parseArgs(argv: string[]) {
  const apply = argv.includes('--apply')
  const help = argv.includes('--help') || argv.includes('-h')

  if (help) {
    console.log(`
Migrate trek difficulty values (English -> Japanese)

Usage:
  pnpm migrate:trek-difficulty-jp
  pnpm migrate:trek-difficulty-jp -- --apply

Options:
  --apply     Execute updates. Without this flag, script runs in dry-run mode.
  -h, --help  Show this help message
`)
    process.exit(0)
  }

  return { apply }
}

async function run() {
  const { apply } = parseArgs(process.argv.slice(2))
  const payload = await getPayload({ config })

  let page = 1
  let scanned = 0
  let updated = 0
  let skipped = 0

  console.log(apply ? 'Mode: APPLY' : 'Mode: DRY-RUN')

  while (true) {
    const result = await payload.find({
      collection: 'treks',
      depth: 0,
      limit: 100,
      page,
      where: {
        difficulty: {
          in: ['Easy', 'Moderate', 'Hard'],
        },
      },
    })

    const docs = result.docs as Array<{
      id: number | string
      name?: string
      difficulty?: LegacyDifficulty
    }>
    if (docs.length === 0) break

    for (const doc of docs) {
      scanned += 1

      if (!doc.difficulty || !(doc.difficulty in difficultyMap)) {
        skipped += 1
        continue
      }

      const nextDifficulty = difficultyMap[doc.difficulty as 'Easy' | 'Moderate' | 'Hard']

      if (!apply) {
        console.log(
          `[dry-run] ${String(doc.id)}${doc.name ? ` (${doc.name})` : ''}: ${doc.difficulty} -> ${nextDifficulty}`,
        )
        continue
      }

      await payload.update({
        collection: 'treks',
        id: doc.id,
        data: {
          difficulty: nextDifficulty,
        },
      })

      console.log(
        `[updated] ${String(doc.id)}${doc.name ? ` (${doc.name})` : ''}: ${doc.difficulty} -> ${nextDifficulty}`,
      )
      updated += 1
    }

    if (!result.hasNextPage) break
    page += 1
  }

  console.log('\nSummary')
  console.log(`Scanned: ${scanned}`)
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)

  if (!apply) {
    console.log('No data was changed (dry-run). Re-run with --apply to persist changes.')
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
