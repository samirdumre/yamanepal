import {
  lexicalEditor,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HorizontalRuleFeature,
  BlocksFeature,
} from '@payloadcms/richtext-lexical'
import { MediaBlock } from '@/blocks/MediaBlock/config'

/**
 * Full-featured Lexical editor for rich content sections.
 * Extends the root editor (bold, italic, underline, links) with:
 *   - Headings h2–h6
 *   - Inline image blocks (via MediaBlock)
 *   - Horizontal rule
 *   - Fixed + inline toolbars
 */
export const fullLexical = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
    BlocksFeature({ blocks: [MediaBlock] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    HorizontalRuleFeature(),
  ],
})
