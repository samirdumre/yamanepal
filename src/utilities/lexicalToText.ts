type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

type LexicalRoot = {
  root?: LexicalNode
  [key: string]: unknown
}

function walkNode(node: LexicalNode): string {
  if (node.text) return node.text

  if (Array.isArray(node.children)) {
    return node.children.map(walkNode).join(' ')
  }

  return ''
}

/**
 * Converts a Lexical rich-text JSON value to a plain string.
 * Recursively walks the node tree and joins all `text` leaf values.
 */
export function lexicalToText(data: unknown): string {
  if (!data || typeof data !== 'object') return ''

  const root = (data as LexicalRoot).root
  if (!root) return ''

  return walkNode(root).replace(/\s+/g, ' ').trim()
}
