import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ARTICLES } from '../content/topics/index.js'

export default function Articles() {
  const [activeTag, setActiveTag] = useState('')

  const tags = useMemo(
    () => [...new Set(ARTICLES.flatMap((a) => a.tags))].sort(),
    []
  )

  const visible = activeTag
    ? ARTICLES.filter((a) => a.tags.includes(activeTag))
    : ARTICLES

  return (
    <div className="gallery">
      <h1 className="gallery__heading">Articles</h1>

      {tags.length > 0 && (
        <div className="tagbar">
          <button
            className={'tagbar__item' + (activeTag === '' ? ' is-on' : '')}
            onClick={() => setActiveTag('')}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={'tagbar__item' + (activeTag === tag ? ' is-on' : '')}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="gallery__grid">
        {visible.map((a) => (
          <Link key={a.slug} to={`/articles/${a.slug}`} className="topic-card">
            <h2 className="topic-card__title">{a.title}</h2>
            <p className="topic-card__desc">{a.summary}</p>
            {a.tags.length > 0 && (
              <div className="article-card__tags">
                {a.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
            <span className="topic-card__cta">Read article →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
