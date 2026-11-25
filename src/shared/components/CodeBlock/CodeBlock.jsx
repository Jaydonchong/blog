import { useState } from 'react'
import { highlighter } from './highlighter.js'
import './CodeBlock.css'

export default function CodeBlock({ code, language }) {
  const [copyStatus, setCopyStatus] = useState('Copy code')
  const highlighted = highlighter.highlight(code, { lang: language }).html

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopyStatus('Copied')
    } catch {
      setCopyStatus('Copy failed')
    }
  }

  return (
    <figure className="code-block">
      <figcaption className="code-block__header">
        <span className="code-block__language">{language}</span>
        <button className="code-block__copy" type="button" onClick={copyCode}>
          {copyStatus}
        </button>
      </figcaption>
      <div
        className="code-block__source"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </figure>
  )
}
