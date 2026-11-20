const WAYS = [
  {
    head: 'Hand-rolled tool',
    snippet: [
      'tools: [{',
      '  name: "get_issue",',
      '  input_schema: { id: "number" }',
      '}]',
      '',
      '// you also write execute()',
    ],
    meta: [
      ['schema', 'you write it'],
      ['runs in', 'your process'],
      ['context', 'per tool, resident'],
    ],
  },
  {
    head: 'MCP',
    snippet: [
      '"mcpServers": {',
      '  "github": {',
      '    "command": "npx",',
      '    "args": ["-y", "@mcp/github"]',
      '  }',
      '}',
    ],
    meta: [
      ['schema', 'the server ships it'],
      ['runs in', 'the server'],
      ['context', 'per server, resident'],
    ],
  },
  {
    head: 'Plain API',
    snippet: [
      'const r = await fetch(',
      '  "/repos/acme/issues/42",',
      '  { headers: { auth } }',
      ')',
      '',
      '// you decide when',
    ],
    meta: [
      ['schema', 'none — unseen'],
      ['runs in', 'your process'],
      ['context', 'zero'],
    ],
  },
]

function ToolCallVsMcpVsApiSlide() {
  return (
    <div className="diag-above">
      <div className="diag-gallery diag-gallery--3">
        {WAYS.map(({ head, snippet, meta }) => (
          <div className="diag-card" key={head}>
            <div className="diag-card__head">{head}</div>
            <pre className="snip">{snippet.join('\n')}</pre>
            {meta.map(([k, v]) => (
              <div className="snip__meta" key={k}>
                <span>{k}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className="pull">An API the model cannot see is not a tool — it is just code you run.</p>
    </div>
  )
}

ToolCallVsMcpVsApiSlide.meta = {
  title: 'Tool call vs MCP vs API',
  subtitle: 'Same capability, three places to put the plumbing',
  section: 'tools',
  sectionLabel: 'Tool, MCP',
  notes: 'Read the context row across: a hand-rolled tool costs you one definition, MCP costs you everything that server exposes whether you use it or not, a plain API costs nothing because the model never learns it exists. That is the whole decision. MCP wins when someone else maintains the schema and you would otherwise write it; a plain API wins when your code already knows when to call it and the model does not need the choice.',
}

export default ToolCallVsMcpVsApiSlide
