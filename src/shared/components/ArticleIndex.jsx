import { Link } from 'react-router-dom'

const ARTICLES = [
  {
    slug: 'evolution-of-my-coding-workflow',
    title: 'An evolution of my coding workflow',
    description: 'How my agentic workflow grew from one-shot prompts into a process that can guide, check, and improve its own work.',
  },
]

export default function ArticleIndex() {
  return (
    <main className="gallery">
      <h1 className="gallery__heading">Articles</h1>
      <div className="gallery__grid">
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            to={`/articles/${article.slug}`}
            className="topic-card"
          >
            <h2 className="topic-card__title">{article.title}</h2>
            <p className="topic-card__desc">{article.description}</p>
            <span className="topic-card__cta">Read article →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
