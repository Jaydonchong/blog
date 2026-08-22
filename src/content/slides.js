/**
 * Parses content/slides.md into the structures the deck renders.
 *
 * The markdown file is the source of truth. Nothing here holds content —
 * edit content/slides.md and the deck follows. The grammar is documented
 * in a comment at the top of that file; this is the implementation of it.
 *
 * Exports:
 *   SECTIONS  [{ id, label, short, minor? }]
 *   SLIDES    [{ n, section, kind, title, subtitle?, bullets?, table?,
 *                compare?, map?, asset?, quote?, notes }]
 *   APPENDIX  [[ref, title, covers]]
 */
import source from '../../content/slides.md?raw'

const SECTION_RE = /^#\s+(.+?)\s*\{(.+?)\}\s*$/
const SLIDE_RE = /^##\s+S(\d+)\s+·\s+(.+?)\s*$/
const SUBTITLE_RE = /^###\s+(.+?)\s*$/
const BULLET_RE = /^(\s*)-\s+(.*)$/
const TERM_RE = /^\*\*(.+?)\*\*(?:\s+—\s+(.*))?$/
const TAGS_RE = /\s*\{([a-z\s]+)\}\s*$/
const TITLE_TAG_RE = /\s*\{title\}\s*$/
const TABLE_RE = /^\|(.+)\|\s*$/
const DIVIDER_RE = /^\|[\s|:-]+\|\s*$/
const QUOTE_RE = /^>\s?(.*)$/
const NOTES_RE = /^\*\*Notes\*\*\s+—\s+(.*)$/

const cells = (line) => line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())

/** `- **Term** — text {strong mono}` → { term, text, strong, mono } */
function parseBullet(raw) {
  const b = {}
  let body = raw

  const tags = body.match(TAGS_RE)
  if (tags) {
    body = body.replace(TAGS_RE, '')
    for (const t of tags[1].trim().split(/\s+/)) {
      if (t === 'strong') b.strong = true
      if (t === 'mono') b.mono = true
    }
  }

  const term = body.match(TERM_RE)
  if (term) {
    b.term = term[1]
    if (term[2] !== undefined) b.text = term[2]
  } else {
    b.text = body
  }
  return b
}

function parse(md) {
  const sections = []
  const slides = []
  const appendix = []
  let section = null
  let slide = null
  // Open multi-line construct: 'compare' | 'notes' | null
  let open = null
  // `# Appendix {appendix}` switches the rest of the file into list mode.
  let inAppendix = false

  const commit = () => {
    if (!slide) return
    if (!slide.kind) slide.kind = slide.table ? 'table' : slide.compare ? 'compare' : 'standard'
    slide.notes = slide.notes.join(' ').trim()
    slides.push(slide)
    slide = null
  }

  const lines = md.replace(/<!--[\s\S]*?-->/g, '').split('\n')

  for (const line of lines) {
    const trimmed = line.trim()

    if (open === 'compare') {
      if (trimmed === ':::') { open = null; continue }
      const [label, body, result] = trimmed.split('|').map((c) => c.trim())
      slide.compare[slide.compare.left ? 'right' : 'left'] = { label, body, result }
      continue
    }

    // A blank line closes any single-paragraph construct.
    if (!trimmed) { open = null; continue }

    if (open === 'notes') { slide.notes.push(trimmed); continue }

    const sec = trimmed.match(SECTION_RE)
    if (sec) {
      commit()
      const [id, short, ...flags] = sec[2].split('|').map((s) => s.trim())
      if (id === 'appendix') { inAppendix = true; continue }
      section = { id, label: sec[1], short }
      if (flags.includes('minor')) section.minor = true
      sections.push(section)
      continue
    }

    if (inAppendix) {
      // Table rows only; the header row and divider are ignored.
      if (DIVIDER_RE.test(trimmed)) continue
      if (TABLE_RE.test(trimmed)) {
        const row = cells(trimmed)
        if (!/^ref$/i.test(row[0])) appendix.push(row)
      }
      continue
    }

    const sl = trimmed.match(SLIDE_RE)
    if (sl) {
      commit()
      let title = sl[2]
      const isTitle = TITLE_TAG_RE.test(title)
      if (isTitle) title = title.replace(TITLE_TAG_RE, '')
      slide = { n: Number(sl[1]), section: section.id, title, notes: [] }
      if (isTitle) slide.kind = 'title'
      continue
    }

    if (!slide) continue

    const sub = trimmed.match(SUBTITLE_RE)
    if (sub) { slide.subtitle = sub[1]; continue }

    if (trimmed === ':::map') { slide.map = true; continue }
    if (trimmed === ':::compare') { slide.compare = {}; open = 'compare'; continue }
    if (trimmed.startsWith(':::asset')) {
      slide.asset = trimmed.slice(':::asset'.length).trim()
      continue
    }

    const notes = trimmed.match(NOTES_RE)
    if (notes) { slide.notes = [notes[1]]; open = 'notes'; continue }

    const bullet = line.match(BULLET_RE)
    if (bullet) {
      const item = parseBullet(bullet[2].trim())
      if (bullet[1].length >= 2) {
        const parent = slide.bullets[slide.bullets.length - 1]
        ;(parent.sub ??= []).push(item)
      } else {
        ;(slide.bullets ??= []).push(item)
      }
      continue
    }

    if (DIVIDER_RE.test(trimmed)) continue
    const row = trimmed.match(TABLE_RE)
    if (row) {
      if (!slide.table) slide.table = { head: cells(trimmed), rows: [] }
      else slide.table.rows.push(cells(trimmed))
      continue
    }

    const quote = trimmed.match(QUOTE_RE)
    if (quote) { slide.quote = quote[1]; continue }
  }

  commit()
  return { sections, slides, appendix }
}

const parsed = parse(source)

export const SECTIONS = parsed.sections
export const SLIDES = parsed.slides.sort((a, b) => a.n - b.n)
export const APPENDIX = parsed.appendix
