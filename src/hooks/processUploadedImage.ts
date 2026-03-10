import type { CollectionBeforeOperationHook } from 'payload'
import sharp from 'sharp'
import path from 'path'

const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB
const SKIP_MIMETYPES = new Set(['image/svg+xml', 'image/gif'])
const INITIAL_QUALITY = 80
const QUALITY_STEP = 10
const MIN_QUALITY = 10

export const processUploadedImage: CollectionBeforeOperationHook = async ({ operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return
  if (!req.file) return

  const { mimetype, data } = req.file

  // Skip non-images, SVGs, and GIFs
  if (!mimetype.startsWith('image/')) return
  if (SKIP_MIMETYPES.has(mimetype)) return

  let quality = INITIAL_QUALITY
  let outputBuffer: Buffer = await sharp(data).webp({ quality }).toBuffer()

  // Compress loop: reduce quality until under 2MB or quality hits minimum
  while (outputBuffer.byteLength > MAX_SIZE_BYTES && quality > MIN_QUALITY) {
    quality -= QUALITY_STEP
    outputBuffer = await sharp(data).webp({ quality }).toBuffer()
  }

  const baseName = path.basename(req.file.name, path.extname(req.file.name))

  req.file = {
    ...req.file,
    data: outputBuffer,
    mimetype: 'image/webp',
    name: `${baseName}.webp`,
    size: outputBuffer.byteLength,
  }
}
