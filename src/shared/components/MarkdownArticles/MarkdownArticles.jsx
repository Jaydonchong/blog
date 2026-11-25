import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
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
  const { slug: routeSlug } = useParams()
  const location = useLocation()
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
  const fragment = location.hash.slice(1)
  const fragmentIndex = headings.findIndex(({ id }) => id === fragment)
  const fragmentSection = headings
    .slice(0, fragmentIndex + 1)
    .reverse()
    .find(({ level }) => level === 2)?.id
  const [active, setActive] = useState(() => fragmentSection ?? toc[0]?.id ?? '')
  const tocListRef = useRef(null)
  const previousHash = useRef(location.hash)
  const skipHashScroll = useRef('')

  useEffect(() => {
    if (!location.hash) return
    if (skipHashScroll.current === location.hash) {
      skipHashScroll.current = ''
      return
    }

    const id = location.hash.slice(1)
    if (headings.some((heading) => heading.id === id)) {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
    }
  }, [location.hash, headings])

  useEffect(() => {
    const headingElements = toc
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)
    if (!headingElements.length) return

    let frame = 0
    const updateActiveHeading = () => {
      frame = 0
      const readingLine = window.innerHeight * 0.5
      const current = headingElements
        .map((heading) => ({ heading, top: heading.getBoundingClientRect().top }))
        .filter(({ top }) => top <= readingLine)
        .sort((a, b) => b.top - a.top)[0]?.heading
      setActive((current ?? headingElements[0]).id)
    }
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveHeading)
    }
    const observer = new IntersectionObserver(scheduleUpdate)
    const fragmentTarget = fragment ? document.getElementById(fragment) : null

    scheduleUpdate()
    headingElements.forEach((heading) => observer.observe(heading))
    if (fragmentTarget && !headingElements.includes(fragmentTarget)) observer.observe(fragmentTarget)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    document.addEventListener('scroll', scheduleUpdate, { capture: true, passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      document.removeEventListener('scroll', scheduleUpdate, true)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [headings, fragment])

  useEffect(() => {
    if (!active) return

    const scrollActiveIntoView = () => {
      const list = tocListRef.current
      if (!list || !window.matchMedia('(max-width: 820px)').matches) return

      const item = document.getElementById(`toc-${active}`)
      if (!item) return

      const left =
        list.scrollLeft +
        item.getBoundingClientRect().left -
        list.getBoundingClientRect().left -
        (list.clientWidth - item.clientWidth) / 2
      list.scrollTo({ left, behavior: 'smooth' })
    }
    scrollActiveIntoView()
    window.addEventListener('resize', scrollActiveIntoView)
    return () => window.removeEventListener('resize', scrollActiveIntoView)
  }, [active])

  useEffect(() => {
    const fragmentChanged = previousHash.current !== location.hash
    previousHash.current = location.hash
    if (fragmentChanged && fragmentSection) {
      setActive(fragmentSection)
      return
    }
    if (!active || location.hash === `#${active}`) return
    const hash = `#${active}`
    skipHashScroll.current = hash
    navigate({ hash }, { replace: true, preventScrollReset: true })
  }, [active, fragmentSection, location.hash, navigate])

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
        <nav ref={tocListRef} className="toc__list" aria-label="Article contents">
          {toc.map(({ text, id }) => (
            <Link
              key={id}
              id={`toc-${id}`}
              className={`toc__item${activeHeading === id ? ' is-on' : ''}`}
              aria-current={activeHeading === id ? 'location' : undefined}
              to={{ pathname: location.pathname, hash: `#${id}` }}
            >
              {text}
            </Link>
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
