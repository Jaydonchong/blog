import './HarnessDiagram.css'

const diagrams = {
  'read-reason-act': {
    title: 'Read, reason, act',
    caption: 'The harness prepares each request and performs actions; the model chooses the next step.',
    flows: [
      { label: 'Agent turn', nodes: [['USER', 'Task', 'A request starts the turn'], ['HARNESS', 'Assemble context', 'Instructions, history, and relevant state'], ['MODEL', 'Choose next step', 'Answer or request an action'], ['HARNESS', 'Execute action', 'Resolve, validate, and run the tool'], ['MODEL', 'Use observation', 'Continue with the returned result']] },
      { label: 'Two outcomes', nodes: [['MODEL', 'Final answer', 'Return the result to the user'], ['END', 'Complete', 'The turn ends']] },
    ],
    note: 'A tool observation is appended to the conversation before the next model request.',
  },
  'model-harness-boundary': {
    title: 'The model and harness boundary',
    caption: 'The model proposes actions. The surrounding program owns execution and continuation.',
    flows: [
      { label: 'Request', nodes: [['HARNESS', 'Select context', 'Build the request from current state'], ['MODEL', 'Generate next step', 'Return a response or tool call']] },
      { label: 'Action', nodes: [['MODEL', 'Tool call', 'Name and validated-shape arguments'], ['HARNESS', 'Execute operation', 'Resolve the tool and enforce policy'], ['MODEL', 'Tool result', 'A new observation enters context']] },
    ],
  },
  'models-by-responsibility': {
    title: 'Models by responsibility',
    caption: 'Specialized model calls are separate asynchronous operations coordinated by the harness.',
    flows: [
      { label: 'Generation', nodes: [['HARNESS', 'Agent loop', 'User-facing work'], ['MODEL', 'Generative provider', 'Select an action or write an answer']] },
      { label: 'Compaction', nodes: [['HARNESS', 'Compaction pipeline', 'Summarize older conversation'], ['MODEL', 'Summary provider', 'Produce a compact representation']] },
      { label: 'Retrieval', nodes: [['HARNESS', 'Index or query', 'Use the configured embedding space'], ['MODEL', 'Embedding model', 'Map text to vectors']] },
      { label: 'Ranking', nodes: [['HARNESS', 'Candidate passages', 'Compare evidence for the query'], ['MODEL', 'Reranker', 'Order the retrieved candidates']] },
    ],
  },
  'approaches-and-ownership': {
    title: 'Ways to build an agent',
    caption: 'These approaches differ in what the application configures, composes, or owns; hosted inference can remain provider-managed.',
    flows: [
      { label: 'Prompt level specification', nodes: [['PROMPT OR SKILL', 'Reusable instructions', 'Specialize an existing application']] },
      { label: 'Agent level specialization', nodes: [['SUBAGENTS', 'Focused workers', 'Coordinate work under an existing harness']] },
      { label: 'Automate a workflow', nodes: [['AUTOMATION', 'Fixed sequence', 'Own the surrounding steps']] },
      { label: 'Compose an SDK', nodes: [['SDK COMPOSITION', 'Reusable primitives', 'Build an application from libraries']] },
      { label: 'Integrate with an inference provider', nodes: [['APPLICATION', 'Direct inference API', 'Send requests and handle surrounding orchestration'], ['PROVIDER', 'Hosted inference', 'Serve the model and return its output']] },
      { label: 'Build a harness', nodes: [['CUSTOM HARNESS', 'Loop and state', 'Own continuation, tools, and context']] },
    ],
  },
  'provider-contract': {
    title: 'Provider contract',
    caption: 'Provider-specific adapters normalize request and response shapes for the execution loop.',
    flows: [
      { label: 'Provider implementations', nodes: [['VERCEL SDK', 'Vercel adapter', 'Translates SDK calls and results'], ['CONTRACT', 'ILlmProvider', 'Stable request and response boundary']] },
      { label: 'Provider implementations', nodes: [['OPENCODE GO', 'OpenCode Go adapter', 'Translates provider-specific results'], ['CONTRACT', 'ILlmProvider', 'Same boundary used by the loop']] },
      { label: 'Consumer', nodes: [['AGENT LOOP', 'Provider contract', 'Does not depend on an SDK response shape']] },
    ],
  },
  'tool-contract-invocation': {
    title: 'Tool contract and invocation',
    caption: 'A model-visible definition describes a tool; the harness resolves and executes its implementation.',
    flows: [
      { label: 'Definition and implementation', nodes: [['CONTRACT', 'AgentTool', 'Name, description, input schema'], ['TOOLS', 'Concrete tools', 'Implement useTool()']] },
      { label: 'Invocation', nodes: [['LOOP', 'useTool()', 'Pass the selected tool call'], ['INVOKER', 'ToolInvoker', 'Resolve name in the registry'], ['REGISTRY', 'Registered tools', 'Find implementation and execute()'], ['RESULT', 'Tool result', 'Retain the original call ID']] },
    ],
  },
  'tool-invocation': {
    title: 'Tool invocation',
    caption: 'The invoker resolves a registered tool and returns a result tied to the request that produced it.',
    flows: [
      { label: 'Execution path', nodes: [['MODEL', 'Tool call', 'Name, arguments, call ID'], ['INVOKER', 'Registry lookup', 'Resolve the exposed name'], ['TOOL', 'Execute', 'Run the registered operation'], ['INVOKER', 'Package result', 'Format a tool-result message'], ['LOOP', 'Append result', 'Keep the matching call ID']] },
    ],
  },
  'deferred-tool-discovery': {
    title: 'Deferred tool discovery',
    caption: 'Discovery can expand the model-visible catalog without replacing runtime permission checks.',
    flows: [
      { label: 'At request time', nodes: [['MODEL', 'Request capability', 'A tool signals that discovery is needed'], ['HARNESS', 'Search catalog', 'Find eligible capability matches'], ['POLICY', 'Filter candidates', 'Apply availability and scope rules'], ['REGISTRY', 'Update definitions', 'Register the selected tools'], ['NEXT REQUEST', 'Expose definitions', 'The model can choose from the updated catalog']] },
    ],
    note: 'Discovery makes eligible capabilities visible; permission policy still decides whether a requested action may run.',
  },
  'happy-path-agent-loop': {
    title: 'The agent loop',
    caption: 'A tool result continues the same turn; a final answer or the step limit ends it.',
    flows: [
      { label: 'Each model step', nodes: [['CONVERSATION', 'Append user message', 'The turn starts with current history'], ['LOOP', 'Request model step', 'Send messages and available tools'], ['MODEL', 'Interpret stop reason', 'Tool call or final answer']] },
      { label: 'Tool-call branch', nodes: [['MODEL', 'Tool calls', 'One or more requested operations'], ['HARNESS', 'Execute tools', 'Collect tool results'], ['CONVERSATION', 'Append results', 'Continue with the updated history'], ['LOOP', 'Next model step', 'Repeat until a stop condition']] },
      { label: 'Stop conditions', nodes: [['MODEL', 'Final answer', 'Return the answer'], ['LIMIT', 'Step limit', 'Stop when the configured maximum is reached']] },
    ],
  },
  'retry-extension': {
    title: 'Provider retries around the loop',
    caption: 'Retry only the provider request that failed; keep completed side effects outside that retry boundary.',
    flows: [
      { label: 'Provider boundary', nodes: [['LOOP', 'Request provider', 'Start a bounded attempt'], ['PROVIDER', 'Classify failure', 'Retryable or terminal'], ['RETRY', 'Attempt limit', 'Retry only while budget remains']] },
      { label: 'Successful response', nodes: [['PROVIDER', 'Successful result', 'Exit the retry block'], ['HARNESS', 'Execute tool', 'A completed side effect is not repeated by provider retry'], ['LOOP', 'Continue turn', 'Append result and request the next step']] },
    ],
  },
  'agent-permissions': {
    title: 'Agent permissions',
    caption: 'The harness resolves a requested action and applies policy before execution.',
    flows: [
      { label: 'Decision boundary', nodes: [['MODEL', 'Tool request', 'Name and arguments'], ['HARNESS', 'Validate inputs', 'Resolve tool and check its schema'], ['POLICY', 'Permission decision', 'Allow, deny, or request approval']] },
      { label: 'Allowed', nodes: [['POLICY', 'Allow', 'Operation is within policy'], ['TOOL', 'Execute', 'Return result to the loop']] },
      { label: 'Approval required', nodes: [['POLICY', 'Ask for approval', 'Pause before side effects'], ['HUMAN', 'Approve or deny', 'Make the requested decision'], ['HARNESS', 'Execute or stop', 'Continue only when allowed']] },
      { label: 'Denied', nodes: [['POLICY', 'Deny', 'Do not run the operation'], ['LOOP', 'Return decision', 'Expose the denial to the model']] },
    ],
  },
  'session-ownership': {
    title: 'Session ownership',
    caption: 'The harness creates a session and gives it explicit conversation, loop, and lifecycle ownership.',
    flows: [
      { label: 'Construction', nodes: [['HARNESS', 'Create', 'Initialize a new session'], ['SESSION', 'AgentSession', 'Owns state for one conversation']] },
      { label: 'Session-owned state', nodes: [['SESSION', 'Conversation', 'Messages and compacted summary'], ['SESSION', 'Agent loop', 'Continuation within a turn'], ['SESSION', 'Lifecycle state', 'Waiting, reasoning, tool use, or finished']] },
      { label: 'Dependency', nodes: [['SESSION', 'Logger', 'Records lifecycle and execution events']] },
    ],
  },
  'durable-session-recovery': {
    title: 'Durable session recovery',
    caption: 'Capture a checkpoint at a stable boundary so recovery can distinguish completed work from work still to do.',
    flows: [
      { label: 'Checkpoint', nodes: [['SESSION', 'Stable boundary', 'No ambiguous action in flight'], ['HARNESS', 'Capture state', 'Session ID, messages, summary, lifecycle'], ['STORE', 'Persist checkpoint', 'Durable session record']] },
      { label: 'Restart and resume', nodes: [['PROCESS', 'Restart', 'The in-memory session is gone'], ['STORE', 'Load by session ID', 'Read the saved checkpoint'], ['HARNESS', 'Restore state', 'Rebuild conversation and lifecycle'], ['SESSION', 'Resume safely', 'Continue after completed side effects']] },
    ],
  },
  'memory-stores-access-paths': {
    title: 'Memory stores and access paths',
    caption: 'Scope filters candidate memories before type routing; session injection and on-demand recall are separate paths.',
    flows: [
      { label: 'Candidate selection', nodes: [['REQUEST', 'Recall request', 'Agent, scope, and requested type'], ['POLICY', 'Enforce scope', 'Limit which records are visible'], ['ROUTER', 'Route by type', 'Choose the memory-specific store']] },
      { label: 'Session start', nodes: [['STORE', 'Selected preferences', 'A bounded baseline'], ['ASSEMBLER', 'Inject context', 'Include them with the next session request']] },
      { label: 'During execution', nodes: [['MODEL', 'Recall tool', 'Request information when it becomes relevant'], ['ROUTER', 'Read permitted store', 'Return records with their scope']] },
    ],
  },
  'memory-distillation-injection': {
    title: 'Memory distillation and injection',
    caption: 'Stored preferences can seed a session, while recall tools remain available for information discovered later.',
    flows: [
      { label: 'Before a session', nodes: [['MEMORY STORE', 'Stored preferences', 'Longer-lived user information'], ['DISTILL', 'Select relevant facts', 'Prepare a concise session baseline'], ['ASSEMBLER', 'Inject context', 'Combine with instructions and conversation state']] },
      { label: 'During a turn', nodes: [['MODEL', 'New information need', 'A later question requires recall'], ['TOOL', 'Memory recall', 'Fetch scoped records on demand'], ['ASSEMBLER', 'Next request', 'Add the observation to current context']] },
    ],
  },
  'context-sources-assembly': {
    title: 'Context sources and assembly',
    caption: 'Prepared datasets and live observations meet at request time, where selection and budget policy determine what the model sees.',
    flows: [
      { label: 'Prepared sources', nodes: [['DATASETS', 'Indexed information', 'Prepared independently'], ['MEMORY', 'Scoped records', 'Persistent user or project knowledge'], ['HISTORY', 'Conversation', 'Messages and summary'], ['INSTRUCTIONS', 'System and task rules', 'Required behavior']] },
      { label: 'Request-time boundary', nodes: [['ASSEMBLER', 'Select context', 'Check access, relevance, freshness, and budget'], ['MODEL', 'Next request', 'Receive selected context and live results']] },
      { label: 'Fresh observation', nodes: [['LIVE TOOL', 'Current system state', 'Fetch information at execution time'], ['ASSEMBLER', 'Add observation', 'Use when prepared data is not current enough']] },
    ],
  },
  'rag-indexing': {
    title: 'RAG indexing',
    caption: 'Text, vectors, and provenance are prepared together so retrieved passages can be inspected later.',
    flows: [
      { label: 'Index pipeline', nodes: [['CORPUS', 'Source documents', 'Preserve source identity'], ['EXTRACT', 'Clean content', 'Normalize without losing useful structure'], ['CHUNK', 'Overlapping passages', 'Keep source offsets or references'], ['DEDUP', 'Detect repeated content', 'Avoid indexing duplicate passages'], ['EMBED', 'Create vectors', 'Use the configured embedding space'], ['STORE', 'Persist records', 'Text, vector, and provenance']] },
    ],
    note: 'Query and document vectors must use a compatible embedding model and configuration.',
  },
  'retrieval-result-compaction': {
    title: 'Retrieval-result compaction',
    caption: 'Shorten selected evidence for one question while preserving source text and provenance for inspection.',
    flows: [
      { label: 'Question-specific preparation', nodes: [['RETRIEVAL', 'Selected passages', 'May overlap or contain extra detail'], ['COMPACTOR', 'Shorten evidence', 'Keep facts needed for the current question'], ['RESULT', 'Focused evidence', 'Retain source references and original text']] },
    ],
    note: 'This prepares retrieved evidence; it does not rewrite the session history or persistent memory.',
  },
  'query-transformation': {
    title: 'Query transformation',
    caption: 'Focused retrieval queries can improve matching while the original question remains the source of intent.',
    flows: [
      { label: 'Transform and retrieve', nodes: [['USER', 'Original question', 'Keep the request intact'], ['MODEL', 'Focused queries', 'Rewrite or split compound requests'], ['RETRIEVAL', 'Search each query', 'Collect candidate evidence'], ['ASSEMBLER', 'Select evidence', 'Relate results back to the original question']] },
    ],
  },
  'rag-recall': {
    title: 'RAG recall',
    caption: 'Semantic and lexical candidate lists are fused before reranking; returned passages keep their source references.',
    flows: [
      { label: 'Parallel candidate search', nodes: [['QUERY', 'Question', 'Embed and tokenize as needed'], ['SEMANTIC', 'Vector search', 'Match meaning'], ['FUSION', 'Rank fusion', 'Combine candidate positions'], ['RERANKER', 'Model-based ranking', 'Score candidates against the query'], ['RESULT', 'Top passages', 'Chunks with source references']] },
      { label: 'Lexical candidate search', nodes: [['QUERY', 'Question', 'Exact terms and identifiers'], ['LEXICAL', 'Text search', 'Match important words'], ['FUSION', 'Rank fusion', 'Join with semantic candidates']] },
    ],
  },
  'compaction-structure': {
    title: 'Compaction structure',
    caption: 'The engine runs an ordered pipeline of nodes; concrete handlers share a node contract and use injected dependencies.',
    flows: [
      { label: 'Composition', nodes: [['ENGINE', 'Compaction engine', 'Coordinates a compaction run'], ['PIPELINE', 'CompactionPipeline', 'Runs configured nodes in order'], ['CONTRACT', 'CompactionNode', 'Shared handler interface']] },
      { label: 'Concrete handlers', nodes: [['NODE', 'Retain recent', 'Keep recent exchanges'], ['NODE', 'Deduplicate tools', 'Preserve valid call/result pairs'], ['NODE', 'Summarize older', 'Replace older context with a summary']] },
      { label: 'Dependencies', nodes: [['TOKENIZER', 'Token counts', 'Measure message size'], ['PROVIDER', 'Summary call', 'Used by model-backed summarization']] },
    ],
  },
  'session-message-compaction': {
    title: 'Session-message compaction',
    caption: 'The pipeline preserves recent exchanges, transforms older messages, then combines both for continuation.',
    flows: [
      { label: 'Split context', nodes: [['CONVERSATION', 'Session messages', 'Current ordered history'], ['RETENTION', 'Recent exchanges', 'Keep complete user, assistant, and tool groups'], ['PIPELINE', 'Older messages', 'Process the remaining history']] },
      { label: 'Older-message pipeline', nodes: [['DEDUPLICATION', 'Remove repeated tool pairs', 'Keep call/result validity'], ['SUMMARIZATION', 'Summarize older context', 'May produce no summary when input is empty']] },
      { label: 'Continue', nodes: [['SUMMARY', 'Older context', 'Compact representation'], ['MERGE', 'Summary + retained messages', 'Prepare the next request'], ['LOOP', 'Continue session', 'Keep this distinct from a durable restart checkpoint']] },
    ],
  },
  'observability-backends': {
    title: 'Collector and observability backends',
    caption: 'The collector routes telemetry; Grafana queries the trace and metrics backends for display.',
    flows: [
      { label: 'Trace export', nodes: [['HARNESS', 'OTLP signals', 'Emit spans and telemetry'], ['COLLECTOR', 'OpenTelemetry Collector', 'Receive and route signals'], ['TEMPO', 'Trace storage', 'Persist trace data']] },
      { label: 'Metrics scrape', nodes: [['COLLECTOR', 'Metrics endpoint', 'Expose the configured exporter'], ['PROMETHEUS', 'Scrape endpoint', 'Store time-series metrics']] },
      { label: 'Dashboard queries', nodes: [['GRAFANA', 'Query traces', 'Read from Tempo'], ['GRAFANA', 'Query metrics', 'Read from Prometheus']] },
    ],
  },
  'agent-turn-trace': {
    title: 'Agent turn trace hierarchy',
    caption: 'Provider attempts belong to a provider step inside the turn; tool batches and tool calls are separate children.',
    flows: [
      { label: 'Turn span', nodes: [['ROOT SPAN', 'agent.turn', 'One user-facing execution turn'], ['CHILD SPAN', 'agent.provider_step', 'Each model request and retry scope'], ['ATTEMPTS', 'Provider attempts', 'Retry details stay inside this step']] },
      { label: 'Tool execution spans', nodes: [['ROOT SPAN', 'agent.turn', 'Same turn context'], ['CHILD SPAN', 'agent.tool_batch', 'A set of requested tool calls'], ['CHILD SPAN', 'agent.tool', 'Individual operation and result']] },
    ],
  },
  'compaction-trace': {
    title: 'Compaction trace hierarchy',
    caption: 'A pipeline span contains its transformation nodes; summarization may contain provider activity.',
    flows: [
      { label: 'Trace tree', nodes: [['ROOT SPAN', 'compaction.pipeline', 'One compaction run'], ['CHILD SPAN', 'compaction.node', 'A named transformation'], ['CHILD SPAN', 'compaction.summarize', 'Model-backed summary node'], ['PROVIDER', 'Provider activity', 'Nested when instrumented']] },
    ],
    note: 'A separately requested compaction starts its own trace instead of attaching to an already completed turn.',
  },
  'evaluation-contracts': {
    title: 'Shared evaluation contracts',
    caption: 'Online and offline evaluators share target, grader, and trial-storage contracts while supplying different targets.',
    flows: [
      { label: 'Harness uses contracts', nodes: [['HARNESS', 'EvaluationHarness', 'Coordinates trial execution'], ['TARGET', 'EvaluationTarget', 'Supplies the execution under evaluation'], ['GRADER', 'EvaluationGrader', 'Applies a criterion to captured evidence'], ['STORE', 'EvaluationTrialStore', 'Persists outcomes for comparison']] },
      { label: 'Target implementations', nodes: [['ONLINE', 'Trace-backed target', 'Reads a completed production execution'], ['OFFLINE', 'Session-backed target', 'Runs a controlled task in a fresh session']] },
    ],
  },
  'online-evaluation-boundaries': {
    title: 'Online evaluation boundaries',
    caption: 'Execution publishes a trace reference for an asynchronous worker, which reads evidence by ID and stores grading outcomes.',
    flows: [
      { label: 'Execution and queue', nodes: [['APPLICATION', 'Completed execution', 'Answer delivery has its own path'], ['TRACE STORE', 'Export trace', 'Trace can become available after execution'], ['QUEUE', 'Publish trace reference', 'Carry execution identity and trace ID']] },
      { label: 'Asynchronous grading', nodes: [['WORKER', 'Read trace by ID', 'Load captured execution evidence'], ['GRADERS', 'Apply profiles', 'Run deterministic or model-based criteria'], ['TRIAL STORE', 'Persist trial', 'Record evidence and outcome']] },
    ],
  },
  'online-evaluation-lifecycle': {
    title: 'Online evaluation lifecycle',
    caption: 'Evaluation runs after the user-facing execution; a publication failure does not need to fail answer delivery.',
    flows: [
      { label: 'User-facing path', nodes: [['APPLICATION', 'Complete execution', 'Produce the requested response'], ['USER', 'Deliver answer', 'Independent from asynchronous grading']] },
      { label: 'Evaluation path', nodes: [['SELECTOR', 'Select execution', 'Choose a completed trace for grading'], ['PUBLISHER', 'Publish trace reference', 'Queue evaluation work'], ['WORKER', 'Read trace with bounded retries', 'Wait for trace export and extract evidence'], ['GRADER', 'Evaluate evidence', 'Apply configured criteria'], ['STORE', 'Persist outcome', 'Keep trial and findings']] },
      { label: 'Publication failure', nodes: [['PUBLISHER', 'Queue unavailable', 'Record evaluation failure'], ['APPLICATION', 'Keep delivered answer', 'Do not turn grading publication into answer failure']] },
    ],
  },
  'retrieval-evaluation': {
    title: 'Retrieval evaluation',
    caption: 'Grade the evidence and citations that support an answer; a tool name alone is not enough to assess recall quality.',
    flows: [
      { label: 'Evidence captured for grading', nodes: [['QUERY', 'User question', 'Original retrieval need'], ['RETRIEVAL', 'Ranked evidence', 'Passages and provenance'], ['ANSWER', 'Citations', 'References used in the response']] },
      { label: 'Checks and result', nodes: [['GRADER', 'Relevance', 'Do retrieved passages address the query?'], ['GRADER', 'Citation support', 'Do cited sources support answer claims?'], ['TRIAL STORE', 'Scores and findings', 'Persist evidence and outcomes']] },
      { label: 'Evidence missing', nodes: [['GRADER', 'Missing evidence', 'Record a missing-evidence outcome rather than guessing']] },
    ],
  },
  'compaction-evaluation': {
    title: 'Compaction evaluation',
    caption: 'Semantic preservation and token size are separate outcomes: meeting one does not imply meeting the other.',
    flows: [
      { label: 'Compare contexts', nodes: [['BEFORE', 'Original context', 'Goals, requirements, decisions, open questions'], ['AFTER', 'Replacement context', 'Summary and retained messages'], ['GRADER', 'Preservation and consistency', 'Check what survived and whether claims are supported']] },
      { label: 'Independent outcomes', nodes: [['SEMANTIC', 'Meaning result', 'Preserved, lost, or unsupported information'], ['SIZE', 'Token result', 'Measured against the target budget']] },
    ],
  },
  'offline-suite-execution': {
    title: 'Offline suite execution',
    caption: 'A suite runs controlled tasks in fresh sessions, grades captured results, and aggregates persisted trials.',
    flows: [
      { label: 'Suite run', nodes: [['SUITE', 'Evaluation tasks', 'A repeatable set of scenarios'], ['TARGET', 'Fresh session', 'Run each task against the configured agent'], ['CAPTURE', 'Execution result', 'Answer and tool-use evidence'], ['GRADERS', 'Apply criteria', 'Check defined behavior'], ['TRIAL STORE', 'Persist trials', 'Keep result and grader findings'], ['RUNNER', 'Aggregate suite', 'Summarize results or set CI status']] },
    ],
    note: 'Live model, prompt, tool data, and corpus changes can still affect reproducibility; record those dependencies with the run.',
  },
  'evaluation-run-manifest': {
    title: 'Evaluation run manifest',
    caption: 'Capture run identity when the trial is created so later comparisons do not depend on reconstructing an old checkout.',
    flows: [
      { label: 'Inputs identified at run time', nodes: [['CODE', 'Revision', 'Exact source revision'], ['AGENT', 'Model and prompt', 'Configuration used for execution'], ['EVAL', 'Suite and graders', 'Tasks and criteria'], ['RAG', 'Corpus and index strategy', 'Include when they can affect answers']] },
      { label: 'Persisted together', nodes: [['RUN MANIFEST', 'Evaluation identity', 'Capture the inputs before the run completes'], ['TRIAL STORE', 'Trial outcome + manifest', 'Enable like-for-like comparison later']] },
    ],
  },
}

export default function HarnessDiagram({ id }) {
  const diagram = diagrams[id]
  if (!diagram) return null

  const headingId = `diagram-${id}-title`

  return (
    <figure className="harness-diagram" role="group" aria-labelledby={headingId}>
      <figcaption className="harness-diagram__caption">
        <strong id={headingId}>{diagram.title}</strong>
        <span>{diagram.caption}</span>
      </figcaption>
      <div className="harness-diagram__flows">
        {diagram.flows.map((flow, flowIndex) => (
          <section className="harness-diagram__flow" aria-label={flow.label} key={`${flow.label}-${flowIndex}`}>
            <h4 className="harness-diagram__flow-label">{flow.label}</h4>
            <div className="harness-diagram__track">
              {flow.nodes.map(([actor, title, detail], nodeIndex) => (
                <div className="harness-diagram__part" key={`${title}-${nodeIndex}`}>
                  {nodeIndex > 0 && <span className="harness-diagram__arrow" aria-hidden="true">→</span>}
                  <div className="harness-diagram__node">
                    <span className="harness-diagram__actor">{actor}</span>
                    <strong>{title}</strong>
                    <span className="harness-diagram__detail">{detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {diagram.note && <p className="harness-diagram__note">{diagram.note}</p>}
    </figure>
  )
}

