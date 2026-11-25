import { Suspense, useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import CodeBlock from '../CodeBlock/CodeBlock.jsx'
import ArticleAdmonition, { parseAdmonition } from '../ArticleAdmonition/ArticleAdmonition.jsx'
import './MarkdownArticles.css'

const slug = (s) =>
  s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')

export default function MarkdownArticles({
  source,
  articleSlug,
  components: customComponents = {},
  diagrams = {},
}) {
  const { slug: routeSlug, section } = useParams()
  const navigate = useNavigate()

  const headings = useMemo(
    () =>
      source
        .split('\n')
        .flatMap((line) => {
          const match = /^(#{1,3})\s+(.+)$/.exec(line)
          return match ? [{ level: match[1].length, text: match[2].trim() }] : []
        })
        .map((heading, index, allHeadings) => {
          const base = slug(heading.text)
          const suffix = allHeadings.slice(0, index).filter((prior) => slug(prior.text) === base).length
          return { ...heading, id: suffix ? `${base}-${suffix}` : base }
        }),
    [source]
  )
  const referenceDefinitions = useMemo(
    () => source.match(/^\[[^\]]+\]:\s*.+$/gm)?.join('\n') ?? '',
    [source]
  )
  const toc = useMemo(() => headings.filter(({ level }) => level === 2), [headings])
  const [active, setActive] = useState(() => toc[0]?.id ?? '')

  useEffect(() => {
    if (section) {
      const sectionIndex = headings.findIndex((heading) => heading.id === section)
      const currentSection = headings
        .slice(0, sectionIndex + 1)
        .reverse()
        .find((heading) => heading.level === 2)
      if (currentSection) setActive(currentSection.id)
      document.getElementById(section)?.scrollIntoView({ block: 'start' })
    }
  }, [section, headings])

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
  }, [headings])

  useEffect(() => {
    if (!active) return

    const scrollActiveIntoView = () => {
      document.getElementById(`toc-${active}`)?.scrollIntoView({ block: 'nearest', inline: 'center' })
    }
    scrollActiveIntoView()
    window.addEventListener('resize', scrollActiveIntoView)
    return () => window.removeEventListener('resize', scrollActiveIntoView)
  }, [active])

  if (routeSlug !== articleSlug) return <Navigate to="/articles" replace />
  const activeHeading = active

  const headingIds = new Map()
  for (const item of headings) {
    const key = `${item.level}:${slug(item.text)}`
    headingIds.set(key, [...(headingIds.get(key) ?? []), item.id])
  }
  const headingCounts = new Map()

  const heading = (Tag, level) =>
    function Heading({ children }) {
      const text = String(children)
      const key = `${level}:${slug(text)}`
      const count = headingCounts.get(key) ?? 0
      headingCounts.set(key, count + 1)
      return <Tag id={headingIds.get(key)?.[count] ?? slug(text)}>{children}</Tag>
    }

  const code = ({ className, children, ...props }) => {
    const language = /language-([\w-]+)/.exec(className ?? '')?.[1]
    const admonitionType = /^ad-([\w-]+)$/.exec(language ?? '')?.[1]
    const diagramId = /^diagram-([\w-]+)$/.exec(language ?? '')?.[1]
    if (admonitionType) {
      const { title, subtitle, collapse, body } = parseAdmonition(String(children))
      return (
        <ArticleAdmonition type={admonitionType} title={title} subtitle={subtitle} collapse={collapse}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre: ({ children }) => <>{children}</>,
              code,
              h1: heading('h1', 1),
              h2: heading('h2', 2),
              h3: heading('h3', 3),
              ...customComponents,
            }}
          >
            {`${body}\n\n${referenceDefinitions}`}
          </ReactMarkdown>
        </ArticleAdmonition>
      )
    }
    if (diagramId) {
      if (diagrams.svgIds?.includes(diagramId) && diagrams.SvgDiagram) {
        const SvgDiagram = diagrams.SvgDiagram
        return (
          <Suspense fallback={null}>
            <SvgDiagram id={diagramId} />
          </Suspense>
        )
      }

      const imageDiagram = diagrams.images?.[diagramId]
      if (imageDiagram) {
        return (
          <figure className="article-raster-diagram">
            <img src={imageDiagram.source} alt={imageDiagram.alt} />
          </figure>
        )
      }

      const Diagram = diagrams.fallback
      return Diagram ? <Diagram id={diagramId} /> : null
    }
    if (!language) return <code {...props}>{children}</code>

    return <CodeBlock code={String(children).replace(/\n$/, '')} language={language} />
  }

  return (
    <div className="reader">
      <Link className="reader__back" to="/slides">← Back to main page</Link>
      <aside className="toc" aria-label="Article navigation">
        <div className="toc__title">Contents</div>
        <nav className="toc__list" aria-label="Article contents">
          {toc.map(({ text, id }) => (
            <button
              key={id}
              id={`toc-${id}`}
              className={`toc__item${activeHeading === id ? ' is-on' : ''}`}
              aria-current={activeHeading === id ? 'location' : undefined}
              type="button"
              onClick={() => navigate(`/articles/${articleSlug}/${id}`)}
            >
              {text}
            </button>
          ))}
        </nav>
      </aside>

      <article className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: ({ children }) => <>{children}</>,
            code,
            h1: heading('h1', 1),
            h2: heading('h2', 2),
            h3: heading('h3', 3),
            ...customComponents,
          }}
        >
          {source}
        </ReactMarkdown>
      </article>
    </div>
  )
}
