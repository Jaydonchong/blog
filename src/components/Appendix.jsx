/**
 * The appendix table, on its own route.
 *
 * It used to live at the bottom of the deck's custom overview grid. Reveal's
 * built-in slide grid (Esc) replaced that screen, so the table moved here and
 * the deck links to it.
 */
import { APPENDIX } from '../content/slides.js'

export default function AppendixPage() {
  return (
    <div className="appendixpage">
      <section className="appendix">
        <h2>Appendix — published, not presented</h2>
        <p>
          Q&amp;A backstop, and the reason nothing from the original outline had to be dropped.
        </p>
        <table>
          <tbody>
            {APPENDIX.map(([id, title, covers]) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{title}</td>
                <td className={covers.startsWith('BLOCKED') ? 'blocked' : undefined}>{covers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
