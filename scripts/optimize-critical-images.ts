import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const variants = [
  { source: 'logo.avif', output: 'logo-small.avif', width: 192, quality: 60 },
  { source: 'heromax.avif', output: 'hero-mobile.avif', width: 828, quality: 50 },
  { source: 'heromax.avif', output: 'hero-desktop.avif', width: 1920, quality: 55 },
] as const

for (const variant of variants) {
  const result = await sharp(path.join(root, 'public/images', variant.source))
    .resize({ width: variant.width, withoutEnlargement: true })
    .avif({ quality: variant.quality, effort: 6 })
    .toFile(path.join(root, 'public/images', variant.output))
  console.log(`${variant.output}: ${result.width}×${result.height}, ${result.size} bytes`)
}
