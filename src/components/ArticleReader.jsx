import { Link, Navigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ARTICLES } from '../content/topics/index.js'
import Article from '@shared/components/Article.jsx'

// The article's own title comes from meta, so the source's leading `# ` line is dropped.
const dropLeadingTitle = (source) => source.replace(/^#\s+.+\n/, '')

export default function ArticleReader() {
  const { slug } = useParams()
  const meta = ARTICLES.find((a) => a.slug === slug)
  if (!meta) return <Navigate to="/articles" replace />

  return (
    <div className="article-page">
      <Link className="article-page__back" to="/articles">
        <span aria-hidden="true">←</span> All articles
      </Link>
      <Article meta={meta}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {dropLeadingTitle(meta.source)}
        </ReactMarkdown>
      </Article>
    </div>
  )
}
