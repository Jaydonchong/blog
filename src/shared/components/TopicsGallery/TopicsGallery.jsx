import { Link } from 'react-router-dom'
import { TOPICS } from '../../../content/topics/index.js'
import './TopicsGallery.css'

export default function TopicsGallery() {
  return (
    <div className="gallery">
      <h1 className="gallery__heading">Topics</h1>
      <div className="gallery__grid">
        {TOPICS.map((topic) => (
          <Link
            key={topic.meta.slug}
            to={`/${topic.kind === 'slides' ? 'slides' : 'articles'}/${topic.meta.slug}`}
            className="topic-card"
          >
            <span className="topic-card__type">{topic.kind === 'slides' ? 'Slide deck' : 'Article'}</span>
            <h2 className="topic-card__title">{topic.meta.title}</h2>
            <p className="topic-card__desc">{topic.meta.description}</p>
            <span className="topic-card__cta">{topic.kind === 'slides' ? 'View deck →' : 'Read article →'}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
