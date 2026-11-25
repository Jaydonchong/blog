import './SvgDiagram.css'

export default function SvgDiagram({ source, label, size = 'full' }) {
  const themeableSource = source.replace(
    /stroke="(#[\da-f]{3,8})"/gi,
    'stroke="var(--article-svg-stroke, $1)"'
  )

  return (
    <figure
      className={`article-svg-diagram article-svg-diagram--${size}`}
      role="img"
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: themeableSource }}
    />
  )
}

