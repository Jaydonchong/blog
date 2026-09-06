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

      <div className="article-list">
        {visible.map((a) => (
          <Link key={a.slug} to={`/articles/${a.slug}`} className="article-row">
            <div className="article-row__main">
              <h2 className="article-row__title">{a.title}</h2>
              <p className="article-row__desc">{a.summary}</p>
            </div>
            <div className="article-row__meta">
              {a.tags.length > 0 && (
                <div className="article-card__tags">
                  {a.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <span className="article-row__cta">Read article →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
