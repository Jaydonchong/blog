export default function Slide({ meta, children }) {
  const isTitle = meta.kind === 'title'
  return (
    <article
      className={'surface' + (isTitle ? ' surface--title' : '')}
      aria-label={meta.title}
    >
      <div className="surface__kicker">
        {meta.sectionLabel && !isTitle && (
          <span className="kicker">{meta.sectionLabel}</span>
        )}
      </div>
      <h1 className="surface__title">{meta.title}</h1>
      {meta.subtitle && <p className="surface__sub">{meta.subtitle}</p>}
      <div className="surface__body">
        {children}
      </div>
    </article>
  )
}
