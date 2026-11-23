import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

const slug = (s) =>
  s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')

export default function MarkdownArticles({ source, articleSlug, components: customComponents = {} }) {
  const { slug: routeSlug, section } = useParams()
  const navigate = useNavigate()
  const [active, setActive] = useState('')

  const toc = useMemo(
    () =>
      source
        .split('\n')
        .filter((line) => /^# /.test(line))
        .map((line) => {
          const text = line.replace(/^# /, '').trim()
          return { text, id: slug(text) }
        }),
    [source]
  )

  useEffect(() => {
    if (section) {
      document.getElementById(section)?.scrollIntoView({ block: 'start' })
    }
  }, [section])

  useEffect(() => {
    const headings = toc
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-70px 0px -70% 0px' }
    )
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [toc])

  if (routeSlug !== articleSlug) return <Navigate to="/articles" replace />

  const heading = (Tag) =>
    function Heading({ children }) {
      const text = String(children)
      return <Tag id={slug(text)}>{children}</Tag>
    }

  return (
    <div className="reader">
      <nav className="toc" aria-label="Article contents">
        <div className="toc__title">Contents</div>
        <div className="toc__list">
          {toc.map(({ text, id }) => (
            <button
              key={id}
              className={'toc__item' + (active === id ? ' is-on' : '')}
              onClick={() => navigate(`/articles/${articleSlug}/${id}`)}
            >
              {text}
            </button>
          ))}
        </div>
      </nav>

      <article className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ h1: heading('h1'), h2: heading('h2'), ...customComponents }}
        >
          {source}
        </ReactMarkdown>
      </article>
    </div>
  )
}
