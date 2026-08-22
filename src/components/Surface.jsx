import { SECTIONS } from '../content/slides.js'

const MAP = `  YOU ─► [ PROMPT ] ─► ( MODEL ) ─► OUTPUT
              │
              ├── CONTEXT    what it knows
              ├── TOOLS      what it can touch
              ├── HARNESS    what it runs inside
              └── LOOP       how many times it goes around`

// Minimal inline emphasis so content can stay plain strings.
function emphasise(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith('**') && chunk.endsWith('**')
      ? <strong key={i}>{chunk.slice(2, -2)}</strong>
      : chunk
  )
}

function Bullet({ item }) {
  const cls = ['', item.strong ? 'strong' : '', item.mono ? 'mono' : ''].filter(Boolean).join(' ')
  return (
    <li>
      <span className={cls}>
        {item.term && <span className="term">{item.term}</span>}
        {item.term && item.text && ' — '}
        {item.text && emphasise(item.text)}
      </span>
      {item.sub && (
        <ul className="bullets__sub">
          {item.sub.map((s, i) => (
            <li key={i}>
              <span className="term">{s.term}</span>
              {s.text && ` — ${s.text}`}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Surface({ slide }) {
  const section = SECTIONS.find((s) => s.id === slide.section)
  const isTitle = slide.kind === 'title'

  return (
    <article
      className={'surface' + (isTitle ? ' surface--title' : '')}
      key={slide.n}
      aria-label={`Slide ${slide.n}: ${slide.title}`}
    >
      <div className="surface__kicker">
        {section && !isTitle && <span className="kicker">{section.label}</span>}
      </div>

      <h1 className="surface__title">{slide.title}</h1>
      {slide.subtitle && <p className="surface__sub">{slide.subtitle}</p>}

      <div className="surface__body">
        {slide.bullets && (
          <ul className="bullets">
            {slide.bullets.map((b, i) => <Bullet item={b} key={i} />)}
          </ul>
        )}

        {slide.map && (
          <pre className="map" aria-label="The six-layer map">
            {MAP}
          </pre>
        )}

        {slide.table && (
          <table className="sheet">
            <thead>
              <tr>{slide.table.head.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {slide.table.rows.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j}>{emphasise(cell)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        )}

        {slide.compare && (
          <div className="compare">
            {['left', 'right'].map((side) => (
              <div className="compare__col" key={side}>
                <div className="compare__label">{slide.compare[side].label}</div>
                <div className="compare__slot">{slide.compare[side].body}</div>
                <div className="compare__slot">{slide.compare[side].result}</div>
              </div>
            ))}
          </div>
        )}

        {slide.asset && <div className="asset">{slide.asset}</div>}
        {slide.quote && <p className="pull">{slide.quote}</p>}
      </div>
    </article>
  )
}
