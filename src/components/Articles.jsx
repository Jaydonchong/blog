import AppendixPage from './Appendix.jsx'
import MarkdownArticles from '../shared/components/MarkdownArticles.jsx'
// Single source of truth: the canonical outline in content/.
// There is deliberately no copy under src/ — edit content/articles-outline.md.
import source from '../../content/articles-outline.md?raw'

const ARTICLE_SLUG = 'llms-prompts-agents'

export default function Articles() {
  return (
    <>
      <MarkdownArticles source={source} articleSlug={ARTICLE_SLUG} />
      <AppendixPage />
    </>
  )
}
