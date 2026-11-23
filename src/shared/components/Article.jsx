export default function Article({ meta, children }) {
  return (
    <article className="article">
      {meta.tags?.length > 0 && (
        <div className="article__tags">
          {meta.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
      <h1 className="article__title">{meta.title}</h1>
      {meta.summary && <p className="article__summary">{meta.summary}</p>}
      <div className="prose">{children}</div>
    </article>
  )
}
