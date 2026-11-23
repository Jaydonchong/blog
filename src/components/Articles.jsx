import AppendixPage from './Appendix.jsx'
import MarkdownArticles from '../shared/components/MarkdownArticles.jsx'
import AgenticWorkflowArticle from './AgenticWorkflowArticle.jsx'
import { Navigate, useParams } from 'react-router-dom'
// Single source of truth: the canonical outline in content/.
// There is deliberately no copy under src/ — edit content/articles-outline.md.
import source from '../../content/articles-outline.md?raw'

const ARTICLE_SLUG = 'llms-prompts-agents'

export default function Articles() {
  const { slug } = useParams()

  if (slug === 'evolution-of-my-coding-workflow') return <AgenticWorkflowArticle />
  if (slug !== ARTICLE_SLUG) return <Navigate to="/articles" replace />

  return (
    <>
      <MarkdownArticles source={source} articleSlug={ARTICLE_SLUG} />
      <AppendixPage />
    </>
  )
}
