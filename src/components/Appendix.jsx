const APPENDIX = [
  ['A1',  'Inference internals',                  'forward pass, KV cache, why latency scales with context'],
  ['A2',  'Quantization in practice',             'precision levels, quality/cost curve, when to self-host'],
  ['A3',  'Tokenisation',                         'worked example, bad splits, input vs output pricing'],
  ['A4',  'Reliability & consistency, in full',   'all five checks with worked examples'],
  ['A5',  'Chain of thought vs ReAct vs few-shot','when each helps, when each wastes tokens'],
  ['A6',  'The stack, as a template',             'copy-pasteable, all five slots, annotated'],
  ['A7',  'System prompts by provider',           'OpenAI vs Claude · CLAUDE.md vs AGENTS.md vs MEMORY.md'],
  ['A8',  'RAG internals',                        'chunk strategies, embedding models, vector DB choices'],
  ['A9',  'Chunking and embedding beyond text',   'the YouTube case, at depth'],
  ['A10', 'Memory types with file layouts',       'episodic / semantic / procedural, structured'],
  ['A11', 'Progressive disclosure tradeoffs',     'fragmentation vs over-normalisation'],
  ['A12', 'Indexing and knowledge graphs',        'naming as retrieval, entities and relations, traversal vs similarity'],
  ['A13', 'Subagents',                            'isolation vs management, when the parent stays dumb'],
  ['A14', 'Fine-tuning vs context engineering',   'BLOCKED ON RESEARCH'],
  ['A15', 'MCP internals',                        'transport, auth, external vs internal trust boundary'],
  ['A16', 'Skill anatomy',                        'frontmatter, project vs user scope, three build methods'],
  ['A17', 'Eval design',                          'judge prompts, golden dataset labelling, static suites'],
  ['A18', 'Distributed loop patterns',            'heartbeats, idempotency, retries, timeout budgets'],
  ['A19', '/work-on-feat in full',                'every stage, real artefacts from a real feature'],
  ['A20', 'Prompt injection and trust boundaries','untrusted content as instruction, mitigations'],
]

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
