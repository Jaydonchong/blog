import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// Single source of truth: the canonical outline in content/.
// There is deliberately no copy under src/ — edit content/articles-outline.md.
import source from '../../content/articles-outline.md?raw'

const slug = (s) =>
  s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')

export default function Articles() {
  const [active, setActive] = useState('')

  // Top-level headings drive the table of contents.
  const toc = useMemo(
    () =>
      source
        .split('\n')
        .filter((line) => /^# /.test(line))
        .map((line) => {
          const text = line.replace(/^# /, '').trim()
          return { text, id: slug(text) }
        }),
    []
  )

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
              onClick={() =>
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              {text}
            </button>
          ))}
        </div>
      </nav>

      <article className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ h1: heading('h1'), h2: heading('h2') }}
        >
          {source}
        </ReactMarkdown>
      </article>
    </div>
  )
}
