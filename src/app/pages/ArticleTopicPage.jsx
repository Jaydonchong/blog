import { Navigate, useParams } from 'react-router-dom'
import MarkdownArticles from '@shared/components/MarkdownArticles/MarkdownArticles.jsx'
import { ARTICLE_TOPICS } from '../../content/topics/index.js'

export default function ArticleTopicPage() {
  const { slug, section } = useParams()
  const topic = ARTICLE_TOPICS.find(({ meta }) => meta.slug === slug)

  if (!topic) return <Navigate to="/slides" replace />
  if (section) return <Navigate to={`/articles/${slug}#${section}`} replace />

  return (
    <MarkdownArticles
      source={topic.source}
      articleSlug={topic.meta.slug}
      components={topic.components}
      diagrams={topic.diagrams}
    />
  )
}
