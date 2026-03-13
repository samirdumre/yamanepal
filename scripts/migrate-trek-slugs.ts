import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'

import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { Trek } from '../src/payload-types'

type SlugMapEntry = {
  oldSlug: string
  newSlug: string
  // Optional Japanese trek name to update in the same pass.
  newName?: string
}

type CliOptions = {
  mapPath: string
  apply: boolean
}

function parseArgs(argv: string[]): CliOptions {
  let mapPath = 'scripts/trek-slug-map.json'
  let apply = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === '--apply') {
      apply = true
      continue
    }

    if (arg === '--map') {
      const next = argv[i + 1]
      if (!next) {
        throw new Error('Missing value for --map')
      }
      mapPath = next
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return { mapPath, apply }
}

function printHelp() {
  console.log(`
Bulk migrate trek slugs (English -> Japanese) with redirect safety.

Usage:
  pnpm migrate:trek-slugs -- --map scripts/trek-slug-map.json [--apply]

Options:
  --map <path>   JSON mapping file path (default: scripts/trek-slug-map.json)
  --apply        Execute updates. Without this flag, script runs in dry-run mode.
  -h, --help     Show this help message
`)
}

async function readMapping(filePath: string): Promise<SlugMapEntry[]> {
  const absolutePath = path.resolve(process.cwd(), filePath)
  const raw = await fs.readFile(absolutePath, 'utf8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('Mapping file must be a JSON array')
  }

  const entries: SlugMapEntry[] = parsed.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`Entry at index ${index} must be an object`)
    }

    const oldSlug = typeof entry.oldSlug === 'string' ? entry.oldSlug.trim() : ''
    const newSlug = typeof entry.newSlug === 'string' ? entry.newSlug.trim() : ''
    const newName = typeof entry.newName === 'string' ? entry.newName.trim() : undefined

    if (!oldSlug || !newSlug) {
      throw new Error(`Entry at index ${index} must include non-empty oldSlug and newSlug`)
    }

    return { oldSlug, newSlug, newName }
  })

  const oldSlugSet = new Set<string>()
  for (const entry of entries) {
    if (oldSlugSet.has(entry.oldSlug)) {
      throw new Error(`Duplicate oldSlug in mapping: ${entry.oldSlug}`)
    }
    oldSlugSet.add(entry.oldSlug)
  }

  return entries
}

async function findBySlug(payload: Awaited<ReturnType<typeof getPayload>>, slug: string) {
  const result = await payload.find({
    collection: 'treks',
    where: { slug: { equals: slug } },
    limit: 2,
    depth: 0,
  })

  return result.docs as Trek[]
}

async function run() {
  const options = parseArgs(process.argv.slice(2))
  const mappings = await readMapping(options.mapPath)
  const payload = await getPayload({ config })

  let updated = 0
  let skipped = 0
  let errors = 0

  console.log(`Loaded ${mappings.length} mapping rows from ${options.mapPath}`)
  console.log(options.apply ? 'Mode: APPLY' : 'Mode: DRY-RUN')

  for (const [index, row] of mappings.entries()) {
    const label = `[${index + 1}/${mappings.length}] ${row.oldSlug} -> ${row.newSlug}`

    try {
      const oldMatches = await findBySlug(payload, row.oldSlug)
      const oldDoc = oldMatches[0]

      if (!oldDoc) {
        const newMatches = await findBySlug(payload, row.newSlug)
        if (newMatches[0]) {
          console.log(`${label} | skipped (already migrated)`)
          skipped += 1
          continue
        }

        console.log(`${label} | skipped (old slug not found)`)
        skipped += 1
        continue
      }

      const conflictMatches = await findBySlug(payload, row.newSlug)
      const hasConflict = conflictMatches.some((doc) => doc.id !== oldDoc.id)
      if (hasConflict) {
        console.log(`${label} | error (new slug already used by another trek)`)
        errors += 1
        continue
      }

      if (!options.apply) {
        console.log(`${label} | dry-run ok${row.newName ? ' (name will update)' : ''}`)
        continue
      }

      await payload.update({
        collection: 'treks',
        id: oldDoc.id,
        data: {
          slug: row.newSlug,
          ...(row.newName ? { name: row.newName } : {}),
        },
      })

      console.log(`${label} | updated`)
      updated += 1
    } catch (err) {
      console.log(`${label} | error (${err instanceof Error ? err.message : String(err)})`)
      errors += 1
    }
  }

  console.log('\nSummary')
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Errors: ${errors}`)

  if (errors > 0) {
    process.exitCode = 1
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
