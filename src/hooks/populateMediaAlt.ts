import path from 'path'
import type { CollectionBeforeValidateHook } from 'payload'

type MediaLikeData = {
  alt?: unknown
  filename?: unknown
}

type MediaLikeDoc = {
  filename?: unknown
}

const getBaseName = (filename?: string): string => {
  if (!filename) return ''

  const baseName = path.basename(filename, path.extname(filename)).trim()
  return baseName
}

export const populateMediaAlt: CollectionBeforeValidateHook = ({ data, originalDoc, req }) => {
  const nextData = (data ?? {}) as MediaLikeData
  const altValue = typeof nextData.alt === 'string' ? nextData.alt.trim() : ''

  if (altValue.length > 0) {
    return data
  }

  const original = originalDoc as MediaLikeDoc | undefined
  const filenameFromUpload = req.file?.name
  const filenameFromData = typeof nextData.filename === 'string' ? nextData.filename : undefined
  const filenameFromOriginal =
    typeof original?.filename === 'string' ? original.filename : undefined

  const inferredAlt =
    getBaseName(filenameFromUpload) ||
    getBaseName(filenameFromData) ||
    getBaseName(filenameFromOriginal)

  if (!inferredAlt) {
    return data
  }

  return {
    ...nextData,
    alt: inferredAlt,
  }
}
