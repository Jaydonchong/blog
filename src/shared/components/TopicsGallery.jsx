import { Link } from 'react-router-dom'
import { TOPICS } from '../../content/topics/index.js'
import { ARTICLES } from './ArticleIndex.jsx'

export default function TopicsGallery() {
  return (
    <div className="gallery">
      <h1 className="gallery__heading">Slides &amp; articles</h1>
      <div className="gallery__grid">
        {TOPICS.map((Deck) => (
          <Link
            key={Deck.meta.slug}
            to={`/slides/${Deck.meta.slug}`}
            className="topic-card"
          >
            <span className="topic-card__type">Slide</span>
            <h2 className="topic-card__title">{Deck.meta.title}</h2>
            <p className="topic-card__desc">{Deck.meta.description}</p>
            <span className="topic-card__cta">View deck →</span>
          </Link>
        ))}
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            to={`/articles/${article.slug}`}
            className="topic-card"
          >
            <span className="topic-card__type">Article</span>
            <h2 className="topic-card__title">{article.title}</h2>
            <p className="topic-card__desc">{article.description}</p>
            <span className="topic-card__cta">Read article →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
