export default function Slide({ meta, children, notesId, notesOpen = false, onToggleNotes }) {
  const isTitle = meta.kind === 'title'
  const hasNotes = meta.notes || meta.additionalNotes

  return (
    <article
      className={'surface' + (isTitle ? ' surface--title' : '')}
      aria-label={meta.title}
    >
      {hasNotes && (
        <>
          <button
            className="surface__notes-button"
            type="button"
            aria-label={notesOpen ? 'Hide slide notes' : 'Show slide notes'}
            title={notesOpen ? 'Hide slide notes' : 'Show slide notes'}
            aria-expanded={notesOpen}
            aria-controls={notesOpen ? notesId : undefined}
            onClick={onToggleNotes}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M7 3.75h7l4 4v12.5H7z" />
              <path d="M14 3.75v4h4M10 12h5M10 15.5h5" />
            </svg>
          </button>
          {notesOpen && (
            <aside className="decknotes surface__notes-popover" id={notesId} aria-label="Slide notes">
              {meta.notes && <p>{meta.notes}</p>}
              {meta.additionalNotes && (
                <section className="surface__additional-notes">
                  <h2>Additional notes</h2>
                  <p>{meta.additionalNotes}</p>
                </section>
              )}
            </aside>
          )}
        </>
      )}
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
