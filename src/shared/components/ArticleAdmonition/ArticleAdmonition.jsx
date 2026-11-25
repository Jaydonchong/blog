import './ArticleAdmonition.css'

export function parseAdmonition(source) {
  const lines = source.replace(/\n$/, '').split('\n')
  const metadata = {}

  while (lines.length) {
    const match = /^(title|subtitle|collapse):\s*(.*)$/i.exec(lines[0])
    if (!match) break
    metadata[match[1].toLowerCase()] = match[2]
    lines.shift()
  }

  if (lines[0] === '') lines.shift()

  const collapse = ['open', 'closed', 'none'].includes(metadata.collapse)
    ? metadata.collapse
    : 'none'

  return { ...metadata, collapse, body: lines.join('\n').trim() }
}

export default function ArticleAdmonition({ type, title, subtitle, collapse, children }) {
  const heading = title || type
  const headingContent = (
    <span className="article-admonition__label">
      <span className="article-admonition__title">{heading}</span>
      {subtitle && <span className="article-admonition__subtitle">{subtitle}</span>}
    </span>
  )
  const content = <div className="article-admonition__body">{children}</div>
  const className = `article-admonition article-admonition--${type}`

  if (collapse === 'none') {
    return (
      <section className={className}>
        <div className="article-admonition__heading">{headingContent}</div>
        {content}
      </section>
    )
  }

  return (
    <details className={className} open={collapse === 'open'}>
      <summary className="article-admonition__summary">{headingContent}</summary>
      {content}
    </details>
  )
}

