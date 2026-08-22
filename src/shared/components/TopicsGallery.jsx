import { Link } from 'react-router-dom'
import { TOPICS } from '../../content/topics/index.js'

export default function TopicsGallery() {
  return (
    <div className="gallery">
      <h1 className="gallery__heading">Slide decks</h1>
      <div className="gallery__grid">
        {TOPICS.map((Deck) => (
          <Link
            key={Deck.meta.slug}
            to={`/slides/${Deck.meta.slug}`}
            className="topic-card"
          >
            <h2 className="topic-card__title">{Deck.meta.title}</h2>
            <p className="topic-card__desc">{Deck.meta.description}</p>
            <span className="topic-card__cta">View deck →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
