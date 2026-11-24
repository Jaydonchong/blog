# Building my own agent harness

I had already built workflows around agents before I started building a harness.
I used them for automated pull request reviews and for coordinating issue triage and investigation.
Those workflows taught me how to give agents work, but they did not give me a clear picture of what happened underneath.
When conversations moved from using agents to building agentic products, I found gaps in my understanding.
I could describe the workflow I wanted, but I could not always explain the machinery that would make the workflow work.

That gap led me to [jharness](https://github.com/Jaydonchong/jharness), my personal project for understanding and building that machinery.
I wanted to see where context came from, how a model response became an action, what survived between requests, and how to judge the result.
The project became a way to turn those questions into components with responsibilities I could inspect.

This article is an architecture walkthrough for developers comfortable with TypeScript and APIs.
The phases follow the responsibilities as they accumulate, from model access and tools to memory, context management, and evaluation.
They describe the intended design as well as code already present in the project; some capabilities remain work I want to build.

The code excerpts introduce one concern at a time.
They begin with contracts and happy paths, then add error handling, retries, and instrumentation where those topics become relevant.
Imports and surrounding declarations are omitted when they are not the subject of an excerpt.
A later fragment replaces the earlier operation it names rather than adding another execution of that operation.
Diagram locations remain marked as placeholders in this review draft.

## Contents

- [Phase 1: Understanding the agent and its harness](#phase-1-understanding-the-agent-and-its-harness)
  - [What the harness owns](#what-the-harness-owns)
  - [Model specialization](#model-specialization)
  - [Ways to build an agent](#ways-to-build-an-agent)
- [Phase 2: Integrating with language models](#phase-2-integrating-with-language-models)
  - [The provider boundary](#the-provider-boundary)
  - [Buffered and streamed output](#buffered-and-streamed-output)
- [Phase 3: Giving the model tools](#phase-3-giving-the-model-tools)
  - [Definitions, calls, and results](#definitions-calls-and-results)
  - [Exposing a tool without delegating execution](#exposing-a-tool-without-delegating-execution)
  - [Tool invocation](#tool-invocation)
  - [Deferred tool calling](#deferred-tool-calling)
- [Phase 4: Connecting the execution loop](#phase-4-connecting-the-execution-loop)
  - [The agentic loop](#the-agentic-loop)
  - [Errors and retries](#errors-and-retries)
- [Phase 5: Configuring behavior and permissions](#phase-5-configuring-behavior-and-permissions)
  - [System prompts and dynamic context](#system-prompts-and-dynamic-context)
  - [Agent capabilities and permissions](#agent-capabilities-and-permissions)
- [Phase 6: Maintaining a session](#phase-6-maintaining-a-session)
  - [Conversation state and lifecycle](#conversation-state-and-lifecycle)
  - [Logs and recovery checkpoints](#logs-and-recovery-checkpoints)
- [Phase 7: Managing context and memory](#phase-7-managing-context-and-memory)
  - [Memory](#memory)
    - [Memory boundaries](#memory-boundaries)
    - [Memory as a tool](#memory-as-a-tool)
    - [Distillation and initial context](#distillation-and-initial-context)
  - [ContextAssembler](#contextassembler)
    - [Where production context comes from](#where-production-context-comes-from)
    - [Data pipelines prepare sources](#data-pipelines-prepare-sources)
    - [Selection is more than concatenation](#selection-is-more-than-concatenation)
  - [RAG](#rag)
    - [Preparing and indexing content](#preparing-and-indexing-content)
    - [Vector similarity and retrieval](#vector-similarity-and-retrieval)
  - [RAG improvement techniques](#rag-improvement-techniques)
    - [Retrieved-evidence compaction](#retrieved-evidence-compaction)
    - [Hybrid search](#hybrid-search)
    - [Query transformation](#query-transformation)
    - [Rank fusion](#rank-fusion)
    - [Reranking](#reranking)
    - [GraphRAG and agent-directed retrieval](#graphrag-and-agent-directed-retrieval)
- [Phase 8: Compacting session messages](#phase-8-compacting-session-messages)
  - [The compaction pipeline](#the-compaction-pipeline)
  - [Token budgets and nudges](#token-budgets-and-nudges)
- [Phase 9: Observability](#phase-9-observability)
  - [Architecture](#architecture)
  - [Instrumentation](#instrumentation)
    - [Tracing](#tracing)
      - [Tracing agent loop](#tracing-agent-loop)
      - [Tracing compaction](#tracing-compaction)
    - [Metrics](#metrics)
      - [Metrics for agent loop](#metrics-for-agent-loop)
      - [Metrics for compaction](#metrics-for-compaction)
      - [Metrics for memory](#metrics-for-memory)
  - [Evals](#evals)
    - [Online evals](#online-evals)
      - [Evals on conversation](#evals-on-conversation)
      - [Evals on Retrieval](#evals-on-retrieval)
      - [Evals on compaction](#evals-on-compaction)
    - [Offline evals](#offline-evals)
- [Closing thoughts](#closing-thoughts)
- [References](#references)

## Phase 1: Understanding the agent and its harness

The word “agent” can describe several different things: a configured assistant, an automated workflow, a program that selects tools, or a system coordinating several such programs.
The definition that helped me reason about the implementation was a system in which a model selects actions toward a goal and a surrounding program makes those actions possible.
The model receives context and decides what to request next.
The surrounding program supplies that context, executes permitted actions, and determines how execution continues.

[Anthropic's distinction between workflows and agents](https://www.anthropic.com/research/building-effective-agents) is useful here: a fixed sequence of model calls and a model-directed process can share components while giving the model different control over the next step.
In this article, I focus on the machinery around the model-directed process.

> **Diagram placeholder — Process: read, reason, act.**
> Show a task entering the model-directed loop, actions returning observations, and an explicit completion branch.

### What the harness owns

I find it useful to imagine each model request reaching a new intern who can learn quickly from the material in front of them but has no independent recollection of the conversation.
That material can include earlier messages, instructions, decisions, and results from actions already taken.
If an important fact is absent, the model does not automatically acquire that fact because the application knows it elsewhere.

The model sees one request at a time.
A request can contain multiple messages with different roles, including the conversation history that the harness chooses to retain.
The harness maintains that history and decides what should enter the next request.
This is why a conversation can feel continuous even though continuity is managed by the application around the model.

The harness also owns the boundary between a request for an action and execution of the action.
A model can ask to read a calendar or retrieve a memory, but a program must resolve the operation, check its inputs, enforce its policy, and return the result.
Once those responsibilities span multiple requests, the harness also needs continuation rules, state, and limits.

> **Diagram placeholder — Architecture: model and harness boundary.**
> Show the harness supplying context to the model and executing model-selected actions.

### Model specialization

One of the most useful shifts in my understanding was seeing an agentic application as an orchestration of asynchronous operations, rather than one language model producing every output.
The work includes deterministic transformations and model-backed steps with different responsibilities.
An embedding model produces vectors, a reranker produces relevance scores, a classifier produces labels, and a generative model produces text or tool requests.
Generated outputs can vary across calls, so the process needs explicit contracts for what the next step consumes.

I found that advice such as “normalize words” often skipped the implementation question I needed answered.
Was normalization a text-processing function, a model request, or a transformation owned by the retrieval pipeline?
Once I separated the operation from the component performing it, designing the process became more intuitive.
A fixed text transformation and a generated summary have different behavior even when both help prepare context.
Asynchronous execution adds another distinction: operations can wait on external results without every stage being independent or running in parallel.

A production harness can assign different models to different responsibilities, balancing quality, latency, and cost for each task.
[Anthropic's production research system](https://www.anthropic.com/research/multi-agent-research-system) is one example of using different models for different responsibilities.
The same principle applies to supporting components within a harness.

| Task | Model role | Selection goal |
| --- | --- | --- |
| Reasoning and answer generation | A generative language model selects actions and produces the response. | Reliable reasoning, tool use, and answer quality. |
| Compaction | A summarization model condenses earlier context. | Preserve requirements and decisions within a token budget. |
| Retrieval | An embedding model represents queries and source content as vectors. | Useful matches for the corpus and query types. |
| Reranking | A relevance model scores retrieved candidates against the query. | Put stronger supporting material ahead of weaker matches. |

A smaller summarization model is useful only if its summaries preserve what later steps need.
Embedding and reranking models do not need to be conversational models, and selecting them does not require creating another autonomous agent for every operation.
A deployment can also reuse a model across roles when that meets its requirements.

One compatibility detail matters even in this overview: query vectors and indexed content must belong to the same embedding space.
In the usual setup, that means using the same embedding model and configuration for both.
Changing that space is an indexing decision, not simply a substitution of the query model.
The project's [embedding adapter][embedding-adapter] and [reranking adapter][reranking-adapter] illustrate specialized interfaces alongside the generative provider.

> **Diagram placeholder — Architecture: models by responsibility.**
> Show generation, compaction, embedding, and reranking as distinct model roles coordinated by the harness.

### Ways to build an agent

There are several places to take ownership of this machinery.
A reusable prompt or skill can specialize an existing agent application.
Subagents can divide responsibilities within an existing harness.
Automation can decide when an agent starts, while an SDK can supply model access and higher-level orchestration primitives.
These choices can coexist; a webhook trigger is a different decision from who owns the execution loop.

For this project, I wanted to own the loop, conversation state, tool orchestration, and context management.
I still use lower-level libraries where they provide a useful boundary.
The Vercel AI SDK, for example, remains underneath the provider adapter.
Owning a harness does not require implementing every layer below it, including model inference infrastructure.

> **Diagram placeholder — Comparison: approaches and ownership.**
> Compare configuration, subagents, automation, SDK composition, and ownership of the harness without implying a strict infrastructure ladder.

## Phase 2: Integrating with language models

Before a harness can manage the process around a model request, it needs a stable way to make that request and interpret the result.
Provider APIs have their own message formats, response shapes, and delivery options.
If those details spread through the execution loop, changing an integration means changing the loop as well.

### The provider boundary

I separate the model, its hosted provider or gateway, the SDK used to call it, and the adapter exposed to the harness.
The model is the capability being invoked.
The provider or gateway supplies access to that capability.
The adapter translates the integration's request and response into the contract the rest of the harness uses.

The [provider contract][provider-contract] exposes buffered and streaming generation while keeping the model type generic:

```typescript
type ILlmProvider<TModel> = {
  generateText(
    input: ILlmGenerateTextInput<TModel>,
  ): Promise<ILlmGenerateTextOutput>;

  streamText(
    input: ILlmStreamTextInput<TModel>,
  ): Promise<ILlmStreamTextOutput>;
};
```

The request and response types carry the normalized conversation and completion information.
The execution loop can therefore depend on a stable result shape instead of knowing which SDK produced the result.

> **Diagram placeholder — Class: provider contract.**
> Show ILlmProvider, VercelSDK, and OpenCodeGo, distinguishing contract implementation from delegation.

A reduced [Vercel adapter][vercel-adapter] excerpt shows the happy path before tool metadata enters the picture:

```typescript
const result = await generateText({
  model: config.model,
  messages: messages as ModelMessage[],
});

const response = {
  reply: result.text,
  messages: result.responseMessages,
  stopReason: result.finishReason,
};
```

At this stage, the useful idea is the translation boundary: the adapter returns text, messages, and a stop reason that the harness can interpret.
Tool calls add another kind of result, which I introduce with tools in the next phase.
The [OpenCode Go adapter][opencode-adapter] illustrates the same separation by adapting a different model endpoint while reusing the SDK-facing integration.

### Buffered and streamed output

Buffered generation returns the completed output together.
Streaming exposes output incrementally so a caller can consume text before the whole turn has finished.
The delivery mode does not remove the need for a final result containing messages and completion metadata.

The streaming contract separates those two concerns:

```typescript
const stream = await provider.streamText({ config, messages });
for await (const chunk of stream.reply) {
  renderText(chunk);
}
const completed = await stream.completed;
```

The caller consumes text chunks from the iterable, then reads the completed metadata.
A streaming failure also needs different retry handling once text has already reached the consumer.
I return to that distinction after establishing the basic execution loop.

## Phase 3: Giving the model tools

A model response can describe an action without carrying out that action.
An agent that needs information outside the conversation, or needs to change something outside it, requires executable operations.
Tools connect the model's requested action to a function the harness can invoke.

### Definitions, calls, and results

A tool has an exposed definition and an executable implementation.
The definition tells the model what the operation does and what inputs it accepts.
The implementation performs the operation after the harness resolves a tool call.
The result then becomes information available to the next model step.

> **Diagram placeholder — Class: tool contract and invocation.**
> Show AgentTool, concrete tools, ToolInvoker, and the registry; include useTool() and execute().

The provider adapter first translates SDK tool-call fields into the [harness contract][provider-contract]:

```typescript
const toolCalls: ILlmToolCall[] = result.toolCalls.map((call) => ({
  id: call.toolCallId,
  name: call.toolName,
  input: call.input,
}));
const responseWithTools = { ...response, toolCalls };
```

A small arithmetic operation makes the relationship between a call and its result easier to see without involving an external service:

```typescript
const call: ILlmToolCall = {
  id: 'call-1',
  name: 'add_numbers',
  input: { left: 2, right: 3 },
};

const result: ModelConversationMessage = {
  role: 'tool',
  content: [{
    type: 'tool-result',
    toolCallId: call.id,
    toolName: call.name,
    output: { type: 'json', value: { total: 5 } },
  }],
};
```

The call ID matters because a turn can request more than one operation.
A result needs to identify which request it answers, independently of the order in which the model mentioned the operations.
The result is data supplied back to the model; executing a function does not itself produce the user's final answer.

### Exposing a tool without delegating execution

The [SDK tool definition][vercel-adapter] can be built from the same schemas used by the executable tool:

```typescript
const tools = Object.fromEntries(
  agentTools.map((agentTool) => [agentTool.name, tool({
    description: agentTool.description,
    inputSchema: agentTool.inputSchema,
    outputSchema: agentTool.outputSchema,
  })]),
);
```

This excerpt exposes descriptions and schemas without supplying an SDK execution callback.
The harness retains control of execution through its own invoker.
That boundary is where validation, policy, and later instrumentation can be applied consistently.
The [AI SDK documentation](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling) also distinguishes defining a tool from supplying its execution behavior.

A concrete teaching tool can use the project's [AgentTool base class][agent-tool]:

```typescript
const inputSchema = z.object({ left: z.number(), right: z.number() });
const outputSchema = z.object({ total: z.number() });

class AddNumbersTool extends AgentTool<typeof inputSchema, typeof outputSchema> {
  constructor() {
    super({ name: 'add_numbers', inputSchema, outputSchema });
  }

  protected async execute(input: z.infer<typeof inputSchema>) {
    return { total: input.left + input.right };
  }
}
```

The body only adds two numbers.
The base class provides the shared invocation boundary, so each concrete tool does not need to reimplement every surrounding concern.
I leave error handling out of this body and introduce it at the boundary where errors are interpreted.

### Tool invocation

A registry connects the model-visible name to an executable tool.
The invoker resolves the requested name, runs the operation, and packages the output as a tool-result message.

> **Diagram placeholder — Process: tool invocation.**
> Show registry lookup, tool execution, and packaging a result linked to the original call ID.

This happy-path excerpt from [ToolInvoker][tool-invoker] assumes registered tools and valid inputs:

```typescript
const toolRegistry = new Map(agentTools.map((tool) => [tool.name, tool]));
const results: Record<string, unknown>[] = [];

for (const call of toolCalls) {
  const selectedTool = toolRegistry.get(call.name)!;
  const output = await selectedTool.useTool(call.input);
  results.push({
    type: 'tool-result',
    toolCallId: call.id,
    toolName: call.name,
    output: { type: 'json', value: output },
  });
}

const message: ModelConversationMessage = { role: 'tool', content: results };
```

The loop awaits each tool before starting the next, so this version executes a batch serially.
Parallel execution is a separate policy decision, especially when one action depends on another action's result.
Retries, caching, and permission checks likewise belong to the invocation design rather than being implied by the existence of a registry.

### Deferred tool calling

As the number of tools grows, exposing every definition in every request can consume context and make selection less clear.
Deferred tool discovery is a way to reveal additional capabilities when the model needs them.
An initial discovery operation can return eligible matches, after which the harness registers those implementations and includes their definitions in the next request.
Returning descriptions alone does not make the corresponding operations executable.

This is a context-management extension to the tool boundary.
Discovery determines which eligible capabilities become visible; permission policy still determines which requested actions can run.
The basic loop does not depend on having a large tool catalog, so I keep discovery as a brief aside here.

> **Diagram placeholder — Process: deferred tool discovery.**
> Show discovery, eligible catalog matches, registry updates, and definitions added to the next model request.

## Phase 4: Connecting the execution loop

A provider can return a tool call, and a tool can return a result, but those capabilities still need a continuation rule.
The result must enter the conversation before the model can decide what happens next.
The agent loop connects those steps and defines when execution finishes.

### The agentic loop

The caller begins with the user message already appended to the conversation.
The loop makes a model request, appends the returned messages, and interprets the stop reason.
A final answer ends the turn.
A tool request leads to execution, appending the tool results, and another model step.

> **Diagram placeholder — Process: happy-path agent loop.**
> Show final-answer/tool-call branching, tool results returning to the next model step, and the step limit.

The first [AgentLoop teaching version][agent-loop] has no retry or telemetry layer:

```typescript
async function runAgent<TModel>(
  provider: ILlmProvider<TModel>,
  config: ILlmGenerateTextInput<TModel>['config'],
  conversation: AgentConversation,
  toolInvoker: Pick<ToolInvoker, 'invoke'>,
): Promise<string> {
  for (let step = 0; step < 10; step++) {
    const response = await provider.generateText({
      config,
      messages: conversation.messages,
    });
    conversation.append(response.messages);

    if (response.stopReason === LlmTextStopReason.STOP) return response.reply;
    if (response.stopReason !== LlmTextStopReason.TOOL_CALL || !response.toolCalls?.length) {
      throw new Error('Expected a final answer or tool calls');
    }
    conversation.append(await toolInvoker.invoke(response.toolCalls));
  }
  throw new Error('Agent loop reached its step limit');
}
```

The ten-step limit prevents a turn from continuing indefinitely.
The loop also rejects a response that is neither a supported final answer nor a usable tool-call result.
Those rules establish a bounded execution structure before adding recovery behavior.

Tool use is one continuation pattern, rather than the only reason to request another model step.
A harness can also feed an intermediate response into a critique or validation step without executing a tool.
That alternative still needs an explicit completion condition and a limit; continuing should be a design decision, not an automatic repetition of the last answer.

### Errors and retries

A failed provider request and a failed tool action are different failure boundaries.
Another model request does not necessarily repeat a side effect, while retrying an action that already succeeded can.
For that reason, I keep tool execution outside the provider retry block.

> **Diagram placeholder — Process: retry extension to the loop.**
> Add retry classification and an attempt limit around the provider request while leaving completed tools outside the return path.

A reduced retry helper for buffered generation makes the attempt limit explicit:

```typescript
async function generateWithRetries<TModel>(
  provider: ILlmProvider<TModel>,
  input: ILlmGenerateTextInput<TModel>,
  shouldRetry: (error: unknown) => boolean,
): Promise<ILlmGenerateTextOutput> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await provider.generateText(input);
    } catch (error) {
      if (attempt >= 3 || !shouldRetry(error)) throw error;
    }
  }
}
```

The supplied policy decides whether the error merits another attempt.
Configuration and authentication errors should stop instead of consuming the retry budget.
The helper attempts generation at most three times and preserves the error when another attempt is not permitted.

For the retry-enabled version of runAgent, add a `shouldRetry: (error: unknown) => boolean` parameter and replace only the provider call with:

```typescript
const response = await generateWithRetries(
  provider,
  { config, messages: conversation.messages },
  shouldRetry,
);
```

Appending messages and invoking tools stay outside that helper.
SDK retries also need to be coordinated with harness retries so that two layers do not multiply attempts unintentionally.
For streaming, retry safety additionally depends on whether any output has already been delivered.
The buffered helper does not resolve partial streamed output.

At the tool boundary, [AgentTool.useTool][agent-tool] owns input and output validation.
The invoker passes the original arguments to that method instead of parsing them again, which matters for schemas that transform their input.
A validation failure can be returned as a tool error so the model has a chance to repair the arguments:

```typescript
try {
  const output = await selectedTool.useTool(call.input);
  return { type: 'json', value: output };
} catch (error) {
  if (error instanceof DomainError && error.code === ErrorCode.VALIDATION_ERROR) {
    return { type: 'error-text', value: error.message };
  }
  throw error;
}
```

This fragment sits inside the per-call invocation method.
Its return value is still packaged with the original tool-call ID by the surrounding invoker.
Other execution errors propagate; the example does not silently replay an action merely because something failed after the action began.

## Phase 5: Configuring behavior and permissions

The same execution loop can support agents with different responsibilities.
The differences are in the guidance the model receives, the operations exposed to it, and the policies governing those operations.
Configuration gives those differences a home without requiring a separate loop for every agent.

### System prompts and dynamic context

A system prompt supplies consistent guidance about the agent's role, behavior, and constraints.
The harness includes that guidance with the context for a model request.
Its exact representation as messages or provider fields is an integration detail; the architectural responsibility is to make the intended guidance available consistently.

Applications can behave differently with the same underlying model because prompts, tools, context selection, and execution rules differ.
The model is only one component determining what the user experiences.

The need for dynamic context became concrete when I tested an agent that tracked my Google Calendar.
I asked, “What's on this month?”
The agent returned results for the same month in the previous year.
The request did not give the agent a reliable reference for the current date, leaving an important part of the calendar query unspecified.

The lesson was that even an ordinary fact such as the current date must be available in the context the model receives.
Training data provides background knowledge, but it is not a reliable clock for a live calendar request.
Current date and timezone are runtime facts the harness can include alongside the user's request.
The role prompt describes the behavior I want; dynamic context grounds that behavior in the situation at the time of execution.

The [agent configuration][agent-config] brings guidance and selected tools together:

```typescript
class ResearchAgent extends AbstractAgentConfig {
  readonly name = 'research-agent';
  readonly version = '1.0.0';

  constructor(researchTools: AgentTool<z.ZodType, z.ZodType>[]) {
    super({
      systemPrompt: 'Research the question and cite the supporting sources.',
      agentTools: researchTools,
    });
  }
}
```

The example uses a fixed research instruction and a supplied collection of tools.
A calendar assistant can use a different instruction and tool set while retaining the same session and execution machinery.
Runtime facts such as the current date can be added when preparing a request rather than being mistaken for timeless instructions.

### Agent capabilities and permissions

Exposing a tool and authorizing an action are related but distinct responsibilities.
Configuration describes the agent's available capabilities and its permission policy.
Invocation evaluates the requested action against that policy before execution.

For the intended permission design, a decision can allow the action, deny it, or require approval.
The decision can depend on the requested arguments as well as the tool name.
The same boundary should apply to tools discovered dynamically, so discovery does not grant authority by itself.
A prompt instruction describes expected behavior, while enforcement belongs to the harness executing the action.

> **Diagram placeholder — Process: agent permissions.**
> Show configuration supplying the policy and the invocation boundary handling allow, deny, and approval decisions.

## Phase 6: Maintaining a session

Completing one turn does not explain how the next request relates to the conversation already in progress.
The harness needs somewhere to keep messages, identify the session, track execution state, and record what happened.
Session management supplies that continuity.

### Conversation state and lifecycle

A session can contain several user turns, and a turn can require several model steps.
The conversation owns the current message sequence and the summary used after compaction.
The loop owns continuation within a turn.
Lifecycle state identifies whether the session is waiting, reasoning, using a tool, compacting, interrupted, or finished.

> **Diagram placeholder — Class: session ownership.**
> Show Harness creating AgentSession, with session-owned conversation, loop, and state, plus the logger dependency.

A reduced excerpt illustrates using the same conversation across turns:

```typescript
sessionState.transitionTo(SessionStatus.REASONING);
conversation.append({ role: 'user', content: userMessage });
const reply = await runAgent(provider, config, conversation, toolInvoker, shouldRetry);
sessionState.transitionTo(SessionStatus.WAITING);
```

The completed provider messages are already appended by runAgent, so the caller does not append the final answer again.
Lifecycle transitions make the execution state explicit even when the work is asynchronous.
The full session also needs to preserve interruption details when a turn fails or stops partway through.

### Logs and recovery checkpoints

A session log records what happened.
A recovery checkpoint records enough state to reconstruct a session after restart.
A conversation summary produced by compaction serves another purpose: replacing older context with a smaller representation for later model requests.
These artifacts can support each other, but one does not automatically provide the guarantees of another.

The [session logger][session-logger] receives events such as user and assistant messages:

```typescript
sessionLogger.onSessionEvent(sessionId, AgentSessionEventType.USER_MESSAGE, {
  message: userMessage,
});
sessionLogger.onSessionEvent(sessionId, AgentSessionEventType.ASSISTANT_MESSAGE, {
  message: reply,
});
```

The logger can serialize writes for a session and keep file handling outside the execution loop.
That record helps inspection, but replaying a log into a correct session is a separate design responsibility.

For durable recovery, the intended checkpoint needs the session identity, message state, summary, and lifecycle information required to continue safely.
A stable turn boundary is easier to restore than an ambiguous point in the middle of a side effect.
The recovery design must know what completed before it resumes execution.

> **Diagram placeholder — Process: durable session recovery.**
> Show a checkpoint captured at a stable boundary, persisted, loaded after restart, and used to restore session state.

## Phase 7: Managing context and memory

A session can preserve what has been said without containing everything required for the next decision.
Relevant information can live in earlier sessions, user preferences, documents, or external systems.
Context management determines which sources contribute to a model request and how their information remains useful over time.

### Memory

Memory gives information a life beyond the current active message list.
The conceptual categories semantic, episodic, and procedural memory help describe different purposes: knowledge, experience, and ways of doing work.
They do not dictate a single storage implementation.
The project's concrete types are facts, decisions, preferences, and session summaries.

Those types have different update patterns.
A decision can be added to a ledger, a preference can replace an earlier preference, and a session summary can provide a compact account of an earlier interaction.
Facts in a corpus can be indexed into searchable chunks.
Treating all four as interchangeable text misses the differences in how the information should be written and retrieved.

#### Memory boundaries

Sharing a retrieval space across sessions and agent responsibilities introduced a retrieval problem.
Two agents with different responsibilities would sometimes retrieve irrelevant memories because records used similar words and matched semantically.
A result could be close to the query in meaning while belonging to the wrong agent's work.
Using that result as context created a risk of building an answer on an irrelevant premise.
Configuring memory boundaries improved the results I observed.

That experience left two separate questions for the design.
Memory type describes what a record represents and how it should be stored.
Memory scope describes which agent, responsibility, or conversation should be allowed to use that record.
A shared physical store can still enforce logical boundaries, and shared knowledge should cross those boundaries deliberately.
Scope constrains the candidate records before relevance ranking chooses among them.

> **Diagram placeholder — Architecture: memory stores and access paths.**
> Show permitted memory scope, routing by memory type, and the separate paths for session injection and on-demand tools.

The following [ContextAssembler excerpt][context-assembler] illustrates storage routing and a typed recall request.
The memory-type filter identifies the category being requested; scope enforcement is a separate policy concern.

```typescript
const memoryStore = memory.type === MEMORY_TYPE.FACT
  ? pgChunkMemoryStore
  : localMemoryStore;
await memoryStore.store(memory);

const recalled = await contextAssembler.recall({
  context: { query: 'What requirements did we agree on?' },
  filters: { types: [MEMORY_TYPE.DECISION] },
});
```

#### Memory as a tool

I also came to understand memory as a capability the agent can use during a conversation, rather than a deterministic preparation step that happens once before the conversation starts.
The agent can discover missing information, recall a relevant memory, or remember something learned during the task.

A general Bash tool leaves the agent to choose commands, paths, and a query strategy for finding that information.
I wanted the memory interface to make the operations explicit through tools for accessing different memory types.
Typed remember and recall tools make their inputs and available operations clearer.
The model still decides when an operation is useful, while the harness validates and executes the operation within the allowed memory boundary.

This is also a form of progressive disclosure.
The request can describe how memory is accessed without loading every stored record into the model's context.
The agent requests more specific information when the task requires it.
The result still needs interpretation: a successful recall call does not establish that every returned statement is relevant or correct.

#### Distillation and initial context

Persistent memory can itself accumulate repetition or conflicting fragments.
Distillation uses a model to turn accumulated information into a smaller representation suitable for later use, while the storage policy determines how that representation is maintained.
A retrieval cursor that tracks how far a ledger has been read is different from a summary of the ledger's contents.

Session-start injection can provide a baseline such as selected preferences.
That optional initialization path complements memory tools used during the conversation.
It does not make all future recall predictable or eliminate the need to fetch information discovered to be relevant later.
Memory distillation concerns persistent knowledge; the session-message compaction phase later concerns the conversation being continued.

> **Diagram placeholder — Process: memory distillation and injection.**
> Show selected stored preferences distilled into context and combined with instructions and conversation state, while memory tools remain available during execution.

### ContextAssembler

Memory gives information somewhere to live.
Context assembly decides which information the model should receive for the next step.
A user message is only one input: the model also needs instructions, relevant conversation state, selected memories, and observations from tools.
That selection changes as the task progresses.

The project's [ContextAssembler][context-assembler] provides a starting point by routing memory writes and retrieval between local and searchable stores and exposing a session-context preparation path for preferences.
AgentSession and AgentConversation combine session context with system guidance, conversation messages, and the compaction checkpoint.
The broader production design extends those sources without making the assembler perform every upstream data-processing task itself.

#### Where production context comes from

In that design, a model request can draw on instructions and tool definitions, recent messages, retained decisions, persistent preferences, retrieved passages, and current observations from operational systems.
Each contributes a different kind of information.
A document might support an explanation, while a live API result establishes the current state of a particular record.

Consider a support agent explaining a delayed delivery.
The answer can require the customer's latest message, the current order record, tracking events from a carrier, the applicable delivery policy, and a preference about how to contact the customer.
A policy document and a recent tracking event have different freshness requirements.
The assembler needs the relevant facts and their origins, not an undifferentiated block of text.
This is an illustrative production scenario rather than a feature claim about my project.

[Anthropic's context-engineering explanation](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) describes context as the material curated for each model call, including sources beyond the prompt itself.
That is the responsibility I am trying to make explicit here.

#### Data pipelines prepare sources

Some context is fetched directly when the agent asks for it.
Other context arrives through data pipelines collecting records from business databases, documents, APIs, or event feeds.
A pipeline can run on a schedule or react to incoming changes.
Its output is a queryable source, not a requirement to place every ingested record into every conversation.

For the production design, document preparation can include extraction, cleanup, deduplication, chunking, and embedding.
Operational records can instead become normalized rows or a current-state view.
Source identifiers, observation times, and access metadata need to survive the preparation steps so that retrieval can apply the appropriate constraints.

Microsoft's [data-platform guidance](https://learn.microsoft.com/en-us/azure/well-architected/ai/data-platform) separates ingestion, processing, storage, and retrieval concerns.
That separation helps keep ContextAssembler focused on selecting request-relevant information from prepared sources.
A live tool can supply a fresher observation when the prepared source is not current enough for the task.

> **Diagram placeholder — Architecture: context sources and assembly boundary.**
> Show independently prepared datasets and live tool observations feeding request-time context selection alongside memory, history, and instructions.

#### Selection is more than concatenation

The assembler needs a policy for which sources to request, which records the caller can access, and how relevance and freshness affect selection.
It also needs to fit selected information into the context budget while retaining the current request and necessary instructions.
Source material should remain distinguishable from instructions, with references available for citations and inspection.

When a required source is unavailable or stale, that gap should remain visible to the agent.
A missing observation should not quietly become an established fact in the answer.
The next section examines one source path in more detail: retrieving reference material from a corpus.

### RAG

Keeping reference material in a store does not tell the harness which parts are useful for a question.
Retrieval-augmented generation, or RAG, connects the selection of supporting material to the context supplied for generation.
The model can then answer from retrieved evidence rather than relying solely on its existing background knowledge.

#### Preparing and indexing content

There are two different flows to understand: preparing a corpus and retrieving from that corpus for a request.
During preparation, extraction turns the source into usable content, cleanup removes source-specific noise, and chunking creates units suitable for retrieval.
The original text and its source references should remain available even when the embedding representation is prepared differently.

The [RAG pipeline guidance from Databricks](https://learn.microsoft.com/en-us/azure/databricks/agents/tutorials/ai-cookbook/quality-data-pipeline-rag) discusses ingestion, parsing, enrichment, deduplication, and chunking as distinct concerns.
That distinction matters when diagnosing whether an irrelevant result came from retrieval or from damaged source material.

Text normalization is a good example of a small deterministic stage.
The project's [TextNormalizer][text-normalizer] standardizes line endings, applies Unicode NFC, and trims outer whitespace.
That utility is a building block; its existence does not imply that every ingestion path applies every possible cleanup operation.
The [Unicode normalization FAQ](https://www.unicode.org/faq/normalization.html) explains how normalization chooses a consistent representation for equivalent strings.
It is a different operation from lowercasing, removing words, or correcting spelling.

Those linguistic transformations need their own justification.
Removing a word such as “not” can change meaning, and flattening paragraph or code structure can remove useful context.
If an embedding-specific representation is transformed, the source text used for results and citations should remain distinguishable.

> **Diagram placeholder — Process: RAG indexing.**
> Show extraction and cleanup, overlapping chunks, duplicate-content detection, embeddings, and persistence of text, vectors, and provenance.

The [indexing excerpt][pg-memory-store] makes chunking and embedding separate operations:

```typescript
const chunks = chunker.chunk(
  { content: memory.content },
  ChunkingStrategyType.FIXED_WINDOW,
  1000,
  100,
);
const embeddings = await embedder.embed(
  chunks.map(({ content }) => content),
  EmbeddingPurpose.INDEXING,
  OllamaEmbeddingModel.EMBEDDINGGEMMA_2_270M,
);
```

The window and overlap in this example are character counts: up to 1,000 characters with 100 characters of overlap.
An embedding is computed for each chunk, while the store retains the chunk text and document metadata alongside it.
The project's deduplication key includes the content and the chunking and embedding strategy, so reusing an existing indexed document is tied to how that document was represented.

#### Vector similarity and retrieval

An embedding model represents a query and source content as vectors in a compatible space.
The database search compares those vectors to select candidates.
The embedding model is not itself reading the entire corpus and writing the final answer.

In this project, [semantic retrieval][chunk-repository] uses pgvector's inner-product operator.
Indexed vectors and query vectors are normalized using the same policy:

```typescript
function normalizeEmbedding(embedding: number[]): number[] {
  const norm = Math.hypot(...embedding);
  if (norm === 0) throw new RangeError('Cannot normalize a zero-length embedding');
  return embedding.map((value) => value / norm);
}
```

For unit-length vectors, dot product and cosine similarity produce equivalent rankings.
The similarity function and normalization policy therefore need to be understood together.
The query should use the embedding model and configuration associated with the indexed content, rather than treating an arbitrary new model as interchangeable.

Exact nearest-neighbor search compares against the candidate space directly.
Approximate approaches trade some retrieval accuracy for search efficiency, which becomes a separate index-design consideration as a corpus grows.
I keep that as an aside here because selecting an approximate index does not change the responsibility of the retrieval boundary.

### RAG improvement techniques

Once the basic corpus and query paths are visible, improvements become easier to place.
Some change the question sent to retrieval, some change how candidates are combined or scored, and others reduce the evidence passed onward.
The following are brief extensions to the same retrieval path rather than separate systems to build in this walkthrough.

#### Retrieved-evidence compaction

A search can return passages that overlap or contain more detail than the current answer needs.
Shortening that evidence can make the request more focused, provided the source references and the facts needed for the answer survive.
This operation prepares evidence for a particular question.
It does not replace the session's message history or rewrite persistent user memory.

> **Diagram placeholder — Process: retrieval-result compaction.**
> Show selected passages shortened for the current question while retaining source text and provenance for inspection.

#### Hybrid search

Semantic matching helps when relevant content uses different wording from the query.
Lexical matching helps when exact terms, identifiers, or names matter.
Combining both produces candidate lists with complementary signals.

BM25 is one lexical-ranking technique, but it is not another name for every full-text search implementation.
The project's PostgreSQL lexical path uses its full-text search facilities and ranking function.
That distinction prevents an algorithm name from obscuring what the code actually does.

#### Query transformation

A broad or compound question can be difficult to retrieve against as one vector.
A model can rewrite the query or divide it into focused subquestions, after which the retrieval path runs against those formulations.
The design still needs to preserve the user's original intent and assess whether the transformations help rather than merely producing more searches.
This is another place where a specialized model can serve a narrower task than answer generation.

> **Diagram placeholder — Process: query transformation.**
> Show the original question becoming focused retrieval queries, followed by retrieval and evidence selection.

#### Rank fusion

Hybrid retrieval produces rankings whose underlying scores need not have the same scale.
Rank fusion combines candidate positions across those lists without pretending that an embedding score and a lexical score are directly comparable.
The project's reciprocal rank fusion uses contributions based on each candidate's position and merges candidates by identity.

#### Reranking

Reranking then evaluates the combined candidates against the query using a relevance model.
It is separate from merging the original rankings.
In the [retrieval excerpt][pg-memory-store], semantic and lexical search run concurrently, fusion produces the candidate set, and the reranker returns the ordering used to select results:

```typescript
const [semanticChunks, lexicalChunks] = await Promise.all([
  retrieveSemanticChunks(context),
  retrieveLexicalChunks(context),
]);
const fused = reciprocalRankFusion(semanticChunks, lexicalChunks);
const ranking = await reranker.rerank(
  context.context.query,
  fused.map(({ content }) => content),
  CloudflareRerankerModel.BGE_RERANKER_BASE,
);
const results = ranking.slice(0, 5).map(({ index }) => fused[index]);
```

The example returns up to five candidates after reranking.
Whether those candidates support the answer remains an evaluation question, not a guarantee supplied by the number five or the use of a reranker.

> **Diagram placeholder — Process: RAG recall.**
> Show parallel semantic/lexical retrieval, rank fusion, model-based reranking, and returned chunks with source references.

#### GraphRAG and agent-directed retrieval

[Microsoft's GraphRAG](https://microsoft.github.io/graphrag/) builds graph structures and summaries from a corpus to support retrieval beyond isolated text matches.
It represents a different way to organize evidence when relationships across material matter.
[Agent-directed retrieval](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-agentic) changes who decides when and where to search: an agent can inspect a result and request another focused retrieval step.
A recall tool can participate in that pattern without making every retrieval strategy graph-based.

## Phase 8: Compacting session messages

A continuing session accumulates user messages, model responses, and tool results.
Keeping every message eventually consumes context space that could be used for the next decision.
Session-message compaction reduces that history while retaining recent exchanges and information needed to continue the task.

The input here is the session's message history.
The output is a summary plus retained messages that later requests can use.
Memory distillation remains a persistent-memory concern, and shortening retrieved evidence remains a retrieval concern.
They can all involve summarization, but the information being replaced and its lifetime differ.

### The compaction pipeline

The pipeline separates transformations that can be performed directly from the model-generated summary.
Recent exchanges can be retained, repeated tool call/result content can be deduplicated, and older material can be summarized.
Removing a repeated tool pair needs to preserve the validity of the message sequence rather than leaving a result disconnected from its call.

> **Diagram placeholder — Class: compaction structure.**
> Show the engine, pipeline, abstract node contract, concrete handlers, tokenizer, and provider dependencies.

The [pipeline composition][compaction-pipeline] expresses the order of those transformations:

```typescript
const pipeline = new CompactionPipeline()
  .addNode(new RecentMessageRetainHandler({ threshold: 2 }))
  .addNode(new DedupeRepeatedContent())
  .addNode(new ModelSummarizer({ llmProvider, model }));
```

A threshold of two retains recent user exchanges together with their following assistant and tool messages.
Retention can also leave nothing to summarize, so the pipeline needs to account for empty remaining input.
The summary is then combined with the retained messages when preparing future context.
The compaction checkpoint is a representation of older conversation, not automatically a durable restart checkpoint.

> **Diagram placeholder — Process: session-message compaction.**
> Show recent exchanges retained separately while older messages are deduplicated and summarized, then combined for continuation.

### Token budgets and nudges

Tokenization gives the compaction process a measurable size target.
The project's baseline tokenizer provides a consistent estimate for comparison; those counts should not be assumed to equal every provider's tokenizer or billing usage.
Both the original and resulting context need to include the material actually passed onward, including retained exchanges.

A generated summary can exceed the target even when the request specifies a length.
A nudge is a new instruction to revise that summary using feedback about the missed budget.
It is different from retrying a failed API request, because the earlier request succeeded and produced an output that needs improvement.

This [ModelSummarizer teaching version][model-summarizer] allows two nudges and fails if the summary still misses the target:

```typescript
const targetTokens = Math.ceil(originalTokenCount * factor);
let messages = sourceMessages;
let summary = '';

for (let nudges = 0; nudges <= 2; nudges++) {
  const result = await llmProvider.generateText({
    config: { model, availableTools: [], systemPrompt: compactionPrompt },
    messages,
  });
  summary = result.reply;
  if (summary.trim() && tokenizer.tokenize(summary).length <= targetTokens) break;
  if (nudges === 2) throw new Error('Summary did not meet its token budget');
  messages = [
    ...sourceMessages,
    { role: 'assistant', content: summary },
    { role: 'user', content: `Rewrite the summary within ${targetTokens} tokens.` },
  ];
}
```

The code makes the size criterion explicit, including rejection of an empty summary.
A complete product also needs a policy for preserving usable context when compaction cannot meet that criterion.
Meeting the token budget alone does not establish that the summary preserved the task's requirements or decisions.
That second question belongs to evaluation.

## Phase 9: Observability

As execution crosses model calls, tools, memory, and compaction, a final response reveals only part of what happened.
The harness needs evidence about the path an operation followed and the work performed along that path.
Observability makes execution inspectable, while evals use captured evidence to assess whether the result meets its purpose.

### Architecture

The harness instruments operations with OpenTelemetry and exports telemetry to a collector.
The [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) receives signals, processes them, and exports them to configured backends.
[Tempo](https://grafana.com/docs/tempo/latest/) stores and queries traces.
[Prometheus](https://prometheus.io/docs/introduction/overview/) stores metric time series.
[Grafana](https://grafana.com/docs/grafana/latest/datasources/) queries those backends to display traces and dashboards.

One integration is to export traces from the collector to Tempo and expose a metrics endpoint that Prometheus scrapes.
The collector's [Prometheus exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusexporter/README.md) supplies that pull-based metrics boundary.
These are backend roles around the harness; exporter configuration is separate from deciding which agent operations deserve instrumentation.

> **Diagram placeholder — Architecture: collector and observability backends.**
> Show OTLP signals entering the collector, traces reaching Tempo, Prometheus scraping exposed metrics, and Grafana querying both backends.

The online evaluation worker can read stored traces from Tempo directly.
It does not need to scrape a Grafana dashboard to obtain execution evidence.

### Instrumentation

Instrumentation belongs at the operation that owns the work.
A turn, a provider request, a tool batch, a memory operation, and a compaction node each have different boundaries.
Choosing those boundaries determines what can be inspected later.

Tracing and metrics describe the same executions at different resolutions.
A trace connects operations within one execution path.
Counters and histograms summarize how often operations occur, how long they take, and how their outcomes vary across executions.

#### Tracing

An active span allows nested work to become part of the same trace.
The project's tracer wrapper handles exception recording, error status, and span completion so callers do not need to duplicate that lifecycle in every method.
The examples assume that the OpenTelemetry runtime and context management have already been initialized.

##### Tracing agent loop

The earlier runAgent remains the execution core.
A tracing wrapper can surround that turn without changing the loop's continuation rules:

```typescript
const tracer = getTracer('agent-session');

async function runObservedAgent(invoke: () => Promise<string>): Promise<string> {
  return tracer.startActiveSpan('agent.turn', () => invoke());
}

const reply = await runObservedAgent(() =>
  runAgent(provider, config, conversation, toolInvoker, shouldRetry),
);
```

The [Tracer implementation][tracer] ends the span even when the operation fails and records an exception before propagating the error.
Child spans at the provider and tool boundaries then explain where time and failures occur within the turn.

> **Diagram placeholder — Trace hierarchy: agent turn instrumentation.**
> Show provider steps and tool batches inside a turn, with retry attempts scoped to the provider step.

Replace the provider call in the retry-enabled runAgent with:

```typescript
const response = await tracer.startActiveSpan('agent.provider_step', () =>
  generateWithRetries(provider, { config, messages: conversation.messages }, shouldRetry),
);
```

Keep the response-message append and final-answer check after that call.
Inside the existing guarded tool-call branch, replace the invocation with:

```typescript
const toolResult = await tracer.startActiveSpan('agent.tool_call_batch', (span) => {
  span.setAttribute('tool.call_count', response.toolCalls!.length);
  return toolInvoker.invoke(response.toolCalls!);
});
conversation.append(toolResult);
```

The tool batch still runs once at that point in the loop.
Adding a span does not introduce another execution of the action.

##### Tracing compaction

A pipeline span identifies one compaction run, while node spans identify the transformations within it.
The node name and message counts help distinguish retention or deduplication from model summarization.
A separately requested compaction does not need to be attached to a previous turn whose span has already finished.

> **Diagram placeholder — Trace hierarchy: compaction pipeline.**
> Show the pipeline span containing node spans, with provider activity beneath summarization where instrumented.

This excerpt sits inside the existing [CompactionPipeline class][compaction-pipeline], whose tracing scope is supplied by the class:

```typescript
@WithSpan('compactionPipeline.node')
private async executeNode(
  node: AbstractCompactionPipelineNode,
  input: CompactionOutput,
): Promise<CompactionOutput> {
  const span = getActiveSpan();
  span?.setAttribute('compactionPipeline.node.name', node.name);
  span?.setAttribute('compaction.input_message_count', input.compactedResult.length);
  const output = await node.execute(input);
  span?.setAttribute('compaction.output_message_count', output.compactedResult.length);
  return output;
}
```

The method records structural information about the transformation and returns the node's output.
Metric recording is omitted here so that the tracing boundary remains visible on its own.

#### Metrics

Counters record accumulated event counts.
Histograms record distributions such as duration, token counts, or reduction ratios.
Bounded attributes such as operation, node name, and outcome allow useful comparisons without treating every execution as a separate metric definition.

##### Metrics for agent loop

Turn attempts, outcomes, and duration describe the basic execution behavior.
Provider token counters and tool count/duration instruments add detail at their respective boundaries.
Those instruments help explain cost and reliability, but they do not establish that the answer was correct.

A metric wrapper based on [AgentSession][agent-session] records successful and failed turns:

```typescript
const meter = getMeter('agent-session');
const turnCount = meter.createCounter('agent-session.turns.count');
const turnDuration = meter.createHistogram('agent-session.turn.duration', { unit: 's' });

async function runMeasuredAgent(invoke: () => Promise<string>): Promise<string> {
  const startedAt = performance.now();
  let outcome = 'error';
  try {
    const reply = await invoke();
    outcome = 'success';
    return reply;
  } finally {
    turnCount.add(1, { outcome });
    turnDuration.record((performance.now() - startedAt) / 1000, { outcome });
  }
}
```

The finally block preserves the result or error while recording the attempt.
Wrapping the earlier traced turn with runMeasuredAgent collects both kinds of evidence from the same execution.
When a provider supplies token usage, that usage can be recorded separately from baseline estimates used for context-size comparison.

##### Metrics for compaction

For compaction, I want to know the original and resulting size, the amount removed, the amount added when a summary grows, and how long the pipeline took.
Node duration and summary nudge counts provide more detail when the operation becomes expensive or repeatedly misses its budget.

The before/after comparison should use the same baseline tokenizer and include the context retained for future requests.
This teaching version records savings and growth separately because [histogram measurements are nonnegative](https://opentelemetry.io/docs/specs/otel/metrics/api/#histogram):

```typescript
const meter = getMeter('compaction-engine');
const tokensBefore = meter.createHistogram('compaction.tokens.before');
const tokensAfter = meter.createHistogram('compaction.tokens.after');
const tokensSaved = meter.createHistogram('compaction.tokens.saved');
const tokensGrowth = meter.createHistogram('compaction.tokens.growth');
const reduction = meter.createHistogram('compaction.token.reduction.ratio');

const saved = Math.max(0, beforeTokens - afterTokens);
const growth = Math.max(0, afterTokens - beforeTokens);
tokensBefore.record(beforeTokens);
tokensAfter.record(afterTokens);
tokensSaved.record(saved);
tokensGrowth.record(growth);
if (beforeTokens > 0) reduction.record(saved / beforeTokens);
```

The reduction ratio is zero when the context grows, and the example skips the ratio when the original context is empty.
These size measurements remain separate from whether the summary preserved important information.

##### Metrics for memory

Remember, recall, and session-context preparation need distinct measurements.
For RAG-backed recall, embedding the query, semantic search, lexical search, and reranking are also separate operations.
Otherwise, a slow source or failing stage can be hidden inside one broad memory duration.

The [ContextAssembler pattern][context-assembler] records the operation and outcome around a callback:

```typescript
const memoryMeter = getMeter('context-assembler');
const operationCount = memoryMeter.createCounter('context.operation.count');
const operationDuration = memoryMeter.createHistogram('context.operation.duration', { unit: 's' });

async function measureMemoryOperation<T>(
  operation: 'context.remember' | 'context.recall' | 'context.prepare_session_context',
  invoke: () => Promise<T>,
): Promise<T> {
  const startedAt = performance.now();
  let outcome = 'error';
  try {
    const result = await invoke();
    outcome = 'success';
    return result;
  } finally {
    const attributes = { 'context.operation': operation, 'context.outcome': outcome };
    operationCount.add(1, attributes);
    operationDuration.record((performance.now() - startedAt) / 1000, attributes);
  }
}
```

The same pattern is used for RAG stages with their own operation attributes.
Recording a success outcome means that the operation completed, not that its returned evidence was useful to the task.

### Evals

Evals were by far the hardest part of the harness for me to understand.
Much of the discussion I encountered described their purpose at a high level without showing how an implementation obtained evidence, ran a grader, or recorded a result.
Separating offline evals from online evals made the concept easier to reason about.

Offline evals gave me a concrete execution path: supply a controlled task, run the agent, and grade the captured result.
Online evals answered a different question: how can a real execution be inspected and graded from the evidence it leaves behind?
That separation made it easier to place the pieces of the system and decide which evidence each grader needed.

An eval combines evidence, a criterion, and a grader outcome.
Both modes can use deterministic checks or model-based judges.
Both can also persist results so that changes in behavior can be compared rather than judged from memory.
A fast answer, a successful recall call, and a short summary are operational observations; whether they helped complete the task requires a criterion.

> **Diagram placeholder — Class: shared evaluation contracts.**
> Show EvaluationHarness, EvaluationTarget, EvaluationGrader, and EvaluationTrialStore, including the session-backed target and shared online grader contracts.

#### Online evals

Online evals inspect executions that occur while the application is being used.
The design can select executions for grading, publish a reference to the completed trace, and let a worker evaluate the captured evidence asynchronously.
The user's answer should not depend on waiting for that worker's quality judgment.
A publication failure likewise should not replace the agent's answer with an evaluation error.

The queue carries the trace reference and execution identity, while the worker obtains the data needed by its grading profile.
Trace export can complete after execution, so the reader needs to account for evidence that has not reached storage yet.
The project's [Tempo reader][tempo-reader] includes bounded retries around trace availability and extraction.

> **Diagram placeholder — Architecture: online evaluation boundaries.**
> Show the completed execution, trace store, queue, worker, graders, and trial store, with the worker reading the trace by ID.

> **Diagram placeholder — Process: online evaluation lifecycle.**
> Show selection, publication, trace retrieval with retries, grading, and persisted outcomes; separate publication failure from answer delivery.

The [processor excerpt][online-processor] starts after the trace has been located:

```typescript
const traceData = await traceReader.read(message);
for (const grader of profile.graders) {
  const outcome = await grader.grade(traceData);
  await recordOutcome(grader.id, outcome);
}
```

This excerpt omits surrounding profile selection and storage details.
The worker grades captured evidence rather than running the original task again.
The identity used for queue deduplication and stored trials also determines whether grading is attached to a turn or a broader session; those scopes need to be intentional.

##### Evals on conversation

A response can be graded for addressing the request, respecting relevant prior constraints, and grounding its claims in the available evidence.
A conversation-level check needs the relevant history or retained decisions as well as the final reply.
An input/output pair alone cannot establish whether an earlier instruction was respected if that instruction is absent from the evidence.

The [LLM judge configuration][llm-judge] illustrates an explicit rubric for the captured answer:

```typescript
const judge = new LlmJudgeGrader({
  id: 'grounded-answer',
  provider: judgeProvider,
  model: judgeModel,
  passThreshold: 0.8,
  rubric: 'The answer addresses the question and supports corpus claims with cited evidence.',
});
```

The grader requests a structured judgment and validates the quoted evidence against the supplied sources.
That helps make a judgment inspectable, but a coherent explanation from a judge is not independent proof of factual correctness.
If evidence is insufficient, the outcome needs to preserve that distinction rather than treating a fluent answer as a pass.

##### Evals on Retrieval

Retrieval should be evaluated separately from the answer that follows it.
The evidence includes the query, ranked chunks, source references, and the answer that used those chunks.
The checks ask whether the material addresses the question and whether cited claims are supported by that material.

A trace containing only the name of a recall tool establishes that a call occurred.
It does not show which passages were returned or whether they were relevant.
For retrieval-quality grading, the design therefore needs to retain the artifacts required by the grader instead of assuming that every trace already contains them.
Missing evidence should produce a missing-evidence outcome.

> **Diagram placeholder — Process: retrieval evaluation.**
> Show query, ranked evidence, sources, and answer citations entering relevance and support checks, with scores and findings persisted.

##### Evals on compaction

Compaction evaluation compares the original context with the summary and retained messages that replace it.
The important questions are whether active goals, requirements, decisions, and unresolved questions survive, and whether the replacement introduces unsupported claims.
A summary alone cannot establish what was omitted, so both sides of the boundary need to be retained for that comparison.

The token budget is a separate size criterion.
A summary can be small enough and still lose the constraint that determines the next correct action.
Conversely, an accurate summary can miss the requested size target.
Recording those outcomes separately makes the failure easier to understand and the next change easier to evaluate.

> **Diagram placeholder — Process: compaction evaluation.**
> Compare original and replacement context for preservation and consistency, then report the semantic result alongside the size result.

#### Offline evals

Offline evals run controlled tasks through an evaluation target and apply defined graders to the captured outputs.
A suite groups those tasks so that an agent change can be checked against more than one manually selected conversation.
The [session-backed target][evaluation-target] creates an agent session for a task, while the evaluation harness owns task execution, grading, and trial recording.

A smoke suite from the project checks that a response is present and that the recall tool was called:

```typescript
const suite: EvaluationSuite = {
  id: 'system-design-smoke',
  tasks: [{
    id: 'explain-acid-from-corpus',
    input: 'What is ACID in relational databases?',
    graders: [
      new ResponsePresentGrader(),
      new ToolCallExpectationGrader({
        id: 'recall-tool-called',
        toolName: 'recall',
        expected: 'called',
      }),
    ],
  }],
};

const result = await evaluationHarness.runSuite(suite);
if (!result.passed) process.exitCode = 1;
```

These are useful behavioral checks with a deliberately narrow claim.
A response-presence grader does not verify the explanation, and a tool-use grader does not establish that the tool returned appropriate evidence.
The captured tool-call record must be reliable for the latter check to mean anything.
More demanding criteria need their own graders and evidence.

> **Diagram placeholder — Process: offline suite execution.**
> Show tasks running in fresh evaluation sessions, captured results entering graders, persisted trials, and the suite outcome.

A runner can turn the suite result into a process exit status for a CI check.
Controlling the input is only part of reproducibility, however: changes to the model, prompt, tool data, or corpus can also change the result.
Where a dependency is intentionally live, that choice should remain visible when interpreting a failed run.

For comparison across runs, I want the result record to identify the code revision, agent configuration, prompt, model, suite, and graders.
Retrieval also needs corpus and indexing-strategy identity when those affect the answer.
Those details should be captured at run time rather than reconstructed from whichever checkout happens to exist later.

> **Diagram placeholder — Process: evaluation run manifest.**
> Show model, prompt, code, suite, grader, corpus, and indexing identities attached to the stored trial.

## Closing thoughts

Building a harness gave me a more concrete way to think about agents.
The calendar failure showed why runtime facts have to enter context, the memory experiments showed why relevance needs boundaries, and separating online from offline evals made quality checks easier to reason about.

The broader change was being able to name which component performs a piece of work and what the next component expects from its output.
That made the architecture easier to design, inspect, and question.
The project is still developing, but the model call is now one part of a process I can explain.

## References

Repository links are pinned to commit `e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695`.
The references include the code and background material consulted for this walkthrough, including supporting research beyond the excerpts shown.

### External sources

- [Unicode — Normalization FAQ](https://www.unicode.org/faq/normalization.html): canonical normalization and the distinction from compatibility normalization.
- [Microsoft — GraphRAG](https://microsoft.github.io/graphrag/): graph-based corpus organization and retrieval.
- [Microsoft — Agentic RAG](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-agentic): tool-based retrieval selected and refined during an agent's execution.
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/research/multi-agent-research-system): production use of different models for different responsibilities.
- [Microsoft — Information retrieval](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-information-retrieval): query embeddings, compatible embedding spaces, search, and reranking.
- [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents): workflows, model-directed agents, and the role of frameworks.
- [Vercel AI SDK — Tool calling](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling): tool definitions, calls, results, and multi-step generation.
- [OpenTelemetry — Collector](https://opentelemetry.io/docs/collector/): telemetry collection, processing, and export.
- [OpenTelemetry — Metrics API](https://opentelemetry.io/docs/specs/otel/metrics/api/#histogram): histogram instrument semantics and nonnegative measurements.
- [OpenTelemetry JS — Metric instruments](https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/sdk-metrics/src/Instruments.ts): histogram measurement validation checked during snippet review.
- [OpenTelemetry — Prometheus exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusexporter/README.md): exposing collector metrics for Prometheus to scrape.
- [Grafana — Tempo](https://grafana.com/docs/tempo/latest/): trace storage and querying.
- [Prometheus — Overview](https://prometheus.io/docs/introduction/overview/): metric time series and collection.
- [Grafana — Data sources](https://grafana.com/docs/grafana/latest/datasources/): querying telemetry backends from dashboards and Explore.
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents): context sources, repeated selection, and just-in-time retrieval.
- [Microsoft — Data platform for AI workloads](https://learn.microsoft.com/en-us/azure/well-architected/ai/data-platform): ingestion, processing, source aggregation, freshness, and retrieval storage.
- [Microsoft / Databricks — Build an unstructured data pipeline for RAG](https://learn.microsoft.com/en-us/azure/databricks/agents/tutorials/ai-cookbook/quality-data-pipeline-rag): ingestion, parsing, enrichment, deduplication, and source metadata.

The ingestion and preprocessing discussion uses the linked Databricks guidance; Unicode normalization is referenced separately below.

### Agent architecture and model integration

- [src/agent/README.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/README.md#L3): Conversation and loop boundaries.
- [src/harness/README.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/README.md#L1): Harness, sessions, state, and logging.
- [src/providers/README.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/README.md#L1): Provider contract and adapters.
- [src/agent/core/AgentConversation.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/core/AgentConversation.ts#L19): Conversation history and compaction checkpoint.
- [src/agent/core/AgentLoop.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/core/AgentLoop.ts#L36): Model steps, tool continuation, retries, and stopping.
- [src/harness/core/Harness.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/Harness.ts#L19): Session construction and registration.
- [src/harness/core/AgentSession.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/AgentSession.ts#L63): Session composition, request context, and delivery modes.
- [src/harness/core/SessionState.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/SessionState.ts#L3): Lifecycle states and interruption details.
- [src/harness/core/AgentSessionLogger.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/AgentSessionLogger.ts#L21): Session event records.
- [src/agent/agentConfig/Interfaces.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/agentConfig/Interfaces.ts#L1): Conversation message contracts.
- [src/agent/agentConfig/AbstractAgentConfig.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/agentConfig/AbstractAgentConfig.ts#L5): Instructions, tools, output schema, and dynamic context.
- [src/agent/agentConfig/ProductivityAgent.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/agentConfig/ProductivityAgent.ts#L15): Productivity behavior and selected tools.
- [src/agent/agentConfig/SystemDesign.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/agentConfig/SystemDesign.ts#L5): Recall, provenance, and evidence instructions.
- [src/agent/agentConfig/General.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/agentConfig/General.ts#L1): General agent configuration.
- [src/providers/Interfaces.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/Interfaces.ts#L40): Generation and streaming contracts.
- [src/providers/VercelSDK.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/VercelSDK.ts#L109): SDK adaptation and normalized provider results.
- [src/providers/OpenCodeGo.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/OpenCodeGo.ts#L15): Alternative provider behind the same interface.

### Tools and invocation

- [src/tools/README.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/README.md#L1): Tool catalog and invocation flow.
- [src/tools/core/AgentTool.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/core/AgentTool.ts#L35): Tool contract and validation boundary.
- [src/tools/core/ToolInvoker.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/core/ToolInvoker.ts#L20): Invocation policy, serial execution, errors, and retry hooks.
- [src/tools/memory/RememberTool.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/memory/RememberTool.ts#L39): Explicit memory writes.
- [src/tools/memory/RecallTool.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/memory/RecallTool.ts#L6): Explicit memory retrieval.

### Memory, retrieval, and indexing

- [src/memory/README.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/README.md#L1): Memory stores, indexing, and retrieval overview.
- [src/memory/core/Interfaces.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/core/Interfaces.ts#L3): Memory categories and retrieval context.
- [src/memory/core/ContextAssembler.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/core/ContextAssembler.ts#L45): Store routing and session context assembly.
- [src/memory/memoryStore/LocalFileMemoryStore/LocalFileMemoryStore.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/memoryStore/LocalFileMemoryStore/LocalFileMemoryStore.ts#L1): Local storage strategy selection.
- [src/memory/memoryStore/LocalFileMemoryStore/DecisionStorageAndRetrievalStrategy.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/memoryStore/LocalFileMemoryStore/DecisionStorageAndRetrievalStrategy.ts#L83): Append-only decisions and retrieval checkpoints.
- [src/memory/memoryStore/LocalFileMemoryStore/PreferenceStorageAndRetrievalStrategy.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/memoryStore/LocalFileMemoryStore/PreferenceStorageAndRetrievalStrategy.ts#L71): Grouped, mutable preference documents.
- [src/memory/memoryStore/LocalFileMemoryStore/SessionSummaryStorageAndRetrievalStrategy.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/memoryStore/LocalFileMemoryStore/SessionSummaryStorageAndRetrievalStrategy.ts#L57): Per-session summaries and retrieval index.
- [src/memory/memoryStore/PGChunkMemoryStore/PGChunkMemoryStore.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/memoryStore/PGChunkMemoryStore/PGChunkMemoryStore.ts#L52): Chunking, embedding, deduplication, hybrid retrieval, fusion, and reranking.
- [src/memory/data/RAGChunkRepository.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/data/RAGChunkRepository.ts#L29): Inner-product vector search and PostgreSQL lexical ranking.
- [src/memory/data/RAGDocumentRepository.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/data/RAGDocumentRepository.ts#L1): Indexed document persistence and deduplication lookup.
- [src/scripts/RAGIndexing.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/scripts/RAGIndexing.ts#L11): Markdown indexing input.
- [src/migrations/1793946600000-CreateRagChunkTables.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/migrations/1793946600000-CreateRagChunkTables.ts#L5): Vector storage schema.
- [src/migrations/1793946700000-AddRagChunkSearchVector.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/migrations/1793946700000-AddRagChunkSearchVector.ts#L4): Lexical search vector and index.
- [src/utils/TextNormalizer.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/utils/TextNormalizer.ts#L1): Text normalization utility.
- [src/utils/chunking/TextChunker.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/utils/chunking/TextChunker.ts#L1): Chunking strategy boundary.
- [src/utils/chunking/strategies/FixedWindowChunkingStrategy.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/utils/chunking/strategies/FixedWindowChunkingStrategy.ts#L1): Fixed-window chunk construction.
- [src/network/embeddingModel/OllamaEmbedder.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/network/embeddingModel/OllamaEmbedder.ts#L1): Embedding adapter.
- [src/network/rerankingModel/CloudflareReranker.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/network/rerankingModel/CloudflareReranker.ts#L1): Reranking adapter.

### Compaction

- [src/compaction/README.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/README.md#L1): Compaction pipeline overview.
- [src/compaction/core/CompactionEngine.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/core/CompactionEngine.ts#L38): Conversation compaction and token measurements.
- [src/compaction/core/CompactionPipeline.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/core/CompactionPipeline.ts#L1): Ordered pipeline execution.
- [src/compaction/core/AbstractCompactionPipelineNode.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/core/AbstractCompactionPipelineNode.ts#L1): Pipeline node contract.
- [src/compaction/handlers/RecentMessageRetainHandler.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/handlers/RecentMessageRetainHandler.ts#L8): Retained user exchanges.
- [src/compaction/handlers/DedupeRepeatedContentHandler.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/handlers/DedupeRepeatedContentHandler.ts#L40): Repeated tool call/result handling.
- [src/compaction/handlers/ModelSummarizerHandler.ts.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/handlers/ModelSummarizerHandler.ts.ts#L10): Summary budget and rewrite nudges.
- [src/utils/BaselineTokenizer.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/utils/BaselineTokenizer.ts#L1): Baseline token estimates.

### Evaluation and observability

- [src/evaluation/README.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/README.md#L1): Offline and online evaluation flows.
- [src/evaluation/EvaluationModule.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/EvaluationModule.ts#L1): Evaluation module contracts and exports.
- [src/evaluation/core/Contracts.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/core/Contracts.ts#L1): Tasks, suites, graders, targets, and trials.
- [src/evaluation/core/EvaluationHarness.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/core/EvaluationHarness.ts#L24): Suite execution, grading, and trial storage.
- [src/evaluation/core/EvaluationMetrics.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/core/EvaluationMetrics.ts#L1): Evaluation metric attributes.
- [src/evaluation/AgentSuiteRegistry.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/AgentSuiteRegistry.ts#L5): Registered offline suites.
- [src/evaluation/adapters/AgentSessionEvaluationTarget.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/adapters/AgentSessionEvaluationTarget.ts#L1): Session-backed evaluation target.
- [src/evaluation/adapters/extractToolCallNames.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/adapters/extractToolCallNames.ts#L1): Tool-use evidence extraction.
- [src/evaluation/suites/gcalSummarizerSmokeSuite.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/suites/gcalSummarizerSmokeSuite.ts#L5): Calendar tool-use example.
- [src/evaluation/suites/systemDesignSmokeSuite.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/suites/systemDesignSmokeSuite.ts#L5): Recall and web-search expectations.
- [src/evaluation/graders/ResponsePresentGrader.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/graders/ResponsePresentGrader.ts#L1): Response-presence check.
- [src/evaluation/graders/ToolCallExpectationGrader.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/graders/ToolCallExpectationGrader.ts#L1): Expected tool-use check.
- [src/evaluation/graders/LlmJudgeGrader.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/graders/LlmJudgeGrader.ts#L18): Rubric grading and quoted-evidence validation.
- [src/evaluation/data/EvaluationTrialRepository.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/data/EvaluationTrialRepository.ts#L1): Persisted evaluation results.
- [src/evaluation/data/EvaluationTrialEntity.entity.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/data/EvaluationTrialEntity.entity.ts#L5): Stored trial metadata.
- [src/evaluation/online/Contracts.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/online/Contracts.ts#L1): Online evaluation contracts.
- [src/evaluation/online/createOnlineEvaluationMessage.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/online/createOnlineEvaluationMessage.ts#L1): Trace-associated evaluation payload.
- [src/evaluation/online/AgentOnlineEvaluationRegistry.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/online/AgentOnlineEvaluationRegistry.ts#L1): Agent-specific grading profiles.
- [src/evaluation/online/OnlineEvaluationProcessor.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/online/OnlineEvaluationProcessor.ts#L26): Background grading and stored-trial checks.
- [src/evaluation/online/TempoEvaluationTraceReader.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/online/TempoEvaluationTraceReader.ts#L27): Trace retrieval and retries.
- [src/scripts/RunEvaluationSuites.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/scripts/RunEvaluationSuites.ts#L36): Offline evaluation runner.
- [src/scripts/RunOnlineEvaluationWorker.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/scripts/RunOnlineEvaluationWorker.ts#L16): Online evaluation worker.
- [src/queue/OnlineEvaluationQueue.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/queue/OnlineEvaluationQueue.ts#L10): Evaluation queue publication and singleton identity.
- [src/queue/PgBossModule.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/queue/PgBossModule.ts#L1): Queue lifecycle.
- [src/telemetry/README.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/telemetry/README.md#L1): Instrumentation and metric reference.
- [src/telemetry/instrumentation.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/telemetry/instrumentation.ts#L1): OpenTelemetry instrumentation.
- [src/telemetry/Telemetry.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/telemetry/Telemetry.ts#L1): Trace and meter access.
- [src/telemetry/Decorators.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/telemetry/Decorators.ts#L1): Span instrumentation.
- [src/telemetry/Tracer.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/telemetry/Tracer.ts#L1): Tracing helper.

### Additional sources consulted during the review

These additional references preserve the research trail; application plumbing is outside the walkthrough's scope.

- [README.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/README.md#L1)
- [package.json](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/package.json#L1)
- [tsconfig.json](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/tsconfig.json#L1)
- [TODO.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/TODO.md#L1)
- [.env.example](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/.env.example#L1)
- [docker-compose.yml](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/docker-compose.yml#L1)
- [docs/plan/llmProvider/PLAN.md](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/docs/plan/llmProvider/PLAN.md#L1)
- [src/index.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/index.ts#L1)
- [src/controller/DiscordController.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/controller/DiscordController.ts#L1)
- [src/service/DiscordProductivityAssistantService.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/service/DiscordProductivityAssistantService.ts#L1)
- [src/service/SystemDesignDiscordService.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/service/SystemDesignDiscordService.ts#L1)
- [src/network/discord/DiscordBotClient.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/network/discord/DiscordBotClient.ts#L1)
- [src/utils/Logger.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/utils/Logger.ts#L1)

### Historical references

These commits document implementation history for the architecture discussed above.

- 2026-10-03: [87491e7 — init](https://github.com/Jaydonchong/jharness/commit/87491e7a111d878804b226d62bd31e610a4f0b3f).
- 2026-10-06: [75e56d8 — refactor: AI Provider](https://github.com/Jaydonchong/jharness/commit/75e56d82ffcb273643c496e6662469867aecf765).
- 2026-10-06: [9449fb2 — refactor: AbstractAgent](https://github.com/Jaydonchong/jharness/commit/9449fb282f696cf0b79e990126eaddf05b96af55).
- 2026-10-07: [7eaf285 — refactor: add harness class](https://github.com/Jaydonchong/jharness/commit/7eaf285fad0899d0896d50df3c8cb24e4f78e07b).
- 2026-10-07: [db6a64f — Add agentic loop](https://github.com/Jaydonchong/jharness/commit/db6a64fa264dabb3674ae051df0b728e80d9a0af).
- 2026-10-07: [62f2b50 — feat: streamText](https://github.com/Jaydonchong/jharness/commit/62f2b50c534327c1bc50b97e89456773aa86673d).
- 2026-10-08: [5d3427d — feat: add discord client to listen in](https://github.com/Jaydonchong/jharness/commit/5d3427d85640a6dd0bbb989065ab4eb37e49457c).
- 2026-10-08: [90b884e — discord productivity assistant service](https://github.com/Jaydonchong/jharness/commit/90b884e6a675da44fbd7eba746e63bbfa40b0823).
- 2026-10-28: [04fb86d — hand roll manual tool loop](https://github.com/Jaydonchong/jharness/commit/04fb86ddfe930f64fbff929f18c05426af754159).
- 2026-10-29: [301dc8e — build compaction engine](https://github.com/Jaydonchong/jharness/commit/301dc8e174b32f468b1dff8c039de81960177215).
- 2026-10-29: [7bd2ed0 — add compaction to Harness and session](https://github.com/Jaydonchong/jharness/commit/7bd2ed0ca70884489a6215d5c90ec65b6fe260c8).
- 2026-10-30: [7cc0997 — build memory system base](https://github.com/Jaydonchong/jharness/commit/7cc099739a7e3c67344e1f2a6a05a85c6cfcba4f).
- 2026-10-30: [3a120ce — inject preference to session system prompt](https://github.com/Jaydonchong/jharness/commit/3a120ce83bf5446f006dd13520b865e164d3b589).
- 2026-10-30: [7683bd0 — add recall and remember tool](https://github.com/Jaydonchong/jharness/commit/7683bd0b10c4ad5894b0ac7887b639c13fcc01a2).
- 2026-10-30: [1bfa9af — Add workspace read write and shell tools](https://github.com/Jaydonchong/jharness/commit/1bfa9af284bd8167da402cadcb843a21d16afe62).
- 2026-10-30: [3bd1b55 — Add asynchronous harness session logging](https://github.com/Jaydonchong/jharness/commit/3bd1b5521fbdb28fb3bec8f3a1903e163c359e05).
- 2026-10-30: [92677c5 — Track agent session state transitions](https://github.com/Jaydonchong/jharness/commit/92677c56391aea5528ff3b4dd9186da8ca025c35).
- 2026-11-03: [64ea51a — refactor: Separate AgentConversation and AgentLoop](https://github.com/Jaydonchong/jharness/commit/64ea51a3162be16cbb2f1125bdaaada6344e7a89).
- 2026-11-03: [214274c — add pgvector](https://github.com/Jaydonchong/jharness/commit/214274cfa48a4327b337b5e100895138ddeb35c1).
- 2026-11-04: [ca80032 — Add RAG chunk entities](https://github.com/Jaydonchong/jharness/commit/ca80032cec808a5e94003cc727a275bdd828a094).
- 2026-11-05: [40df711 — Add embedding](https://github.com/Jaydonchong/jharness/commit/40df7116da623ea8fd810dce93c11079f4f4a71c).
- 2026-11-05: [64dd1ff — add Chunker](https://github.com/Jaydonchong/jharness/commit/64dd1ff82a45807f13fac182b7135b9e6a128739).
- 2026-11-06: [4f7b1b2 — feat: rag dot product retrieval](https://github.com/Jaydonchong/jharness/commit/4f7b1b2d38add2d95b5221a0dcf9fdc69bf593c6).
- 2026-11-06: [dd482cb — feat: rag hybrid retrieval - add lexical search](https://github.com/Jaydonchong/jharness/commit/dd482cbc44fa8fbbbc755c290b70368bddcde6a4).
- 2026-11-06: [3c3df57 — Add RRF](https://github.com/Jaydonchong/jharness/commit/3c3df576a7f870085cdb6ffedebc996af0ebc235).
- 2026-11-06: [6fe5bbf — feat: rag rerannking](https://github.com/Jaydonchong/jharness/commit/6fe5bbf4c397564e8208f00bdd58e5bea8f8dc5a).
- 2026-11-09: [6b94e2e — feat: recall facts from RAG](https://github.com/Jaydonchong/jharness/commit/6b94e2e3b38d0e2fccd566a70d42b7ce0aba971b).
- 2026-11-09: [09ac403 — Dockerize app for telemetry](https://github.com/Jaydonchong/jharness/commit/09ac403874f128711118278ed0cca4a20c7169f6).
- 2026-11-09: [3b1abbc — Add basic telemetry](https://github.com/Jaydonchong/jharness/commit/3b1abbcd2b2100a947a542f108e61b612f145e59).
- 2026-11-10: [8d24573 — Add custom spans](https://github.com/Jaydonchong/jharness/commit/8d2457339281df333d8ece186f849e475b006600).
- 2026-11-11: [8fd4861 — Add compaction token stats and metrics](https://github.com/Jaydonchong/jharness/commit/8fd4861570aaff42382f5e40949f20aec401eeb4).
- 2026-11-11: [7189f36 — add compaction nudge](https://github.com/Jaydonchong/jharness/commit/7189f36245fedd41862b9f0659e9f36abd0d548e).
- 2026-11-12: [c58e912 — Add tool-use evaluation suites](https://github.com/Jaydonchong/jharness/commit/c58e912899290c1cf9d5509b0bd093f22bf900ee).
- 2026-11-17: [001d8ab — add offline eval command](https://github.com/Jaydonchong/jharness/commit/001d8ab2374d61731b24c6b14dda327853e12607).
- 2026-11-17: [42595a2 — add llmJudgeGrader](https://github.com/Jaydonchong/jharness/commit/42595a2c674fb7b206c4b08679b369dd8ccf6dbb).
- 2026-11-17: [35bded5 — feat: add offline eval run](https://github.com/Jaydonchong/jharness/commit/35bded50e919cb1d07806c229b39bc8bffbd71b3).
- 2026-11-17: [75c015e — Set up PgBoss lifecycle](https://github.com/Jaydonchong/jharness/commit/75c015e3eedbef6efeed43e941792dc459e9bc87).
- 2026-11-18: [a8822af — add wyd integration](https://github.com/Jaydonchong/jharness/commit/a8822afd543b585ac89c189079b4c000ffc14a5a).
- 2026-11-18: [7a889dc — add online evaluation](https://github.com/Jaydonchong/jharness/commit/7a889dcc1e9211ed99681794ff417c7e9bfd3212).
- 2026-11-18: [105f870 — improve online eval rubric](https://github.com/Jaydonchong/jharness/commit/105f870cb59ec71a659352f3dc020476c8dd52f2).
- 2026-11-18: [986c52a — Add Grafana agent metrics panels](https://github.com/Jaydonchong/jharness/commit/986c52a2739838795e82e257137c3020ffedc789).
- 2026-11-18: [56cdef9 — Wrap dashboard in Grafana resource format](https://github.com/Jaydonchong/jharness/commit/56cdef960805550d756a5ca2299d358d24d44f1c).
- 2026-11-18: [9b8018c — add controller layer](https://github.com/Jaydonchong/jharness/commit/9b8018c0e048d94af64d2cc5ac96be625439fe22).
- 2026-11-18: [475f8a2 — use discord websocket to send message](https://github.com/Jaydonchong/jharness/commit/475f8a21e2231e64c6d1a3ebcdcaac567c6e376e).
- 2026-11-18: [930737c — refactor as productivity agent](https://github.com/Jaydonchong/jharness/commit/930737c42fc2bba47b50cb3b006bb41b33ddca78).
- 2026-11-18: [e5772f1 — add wyd task create tool](https://github.com/Jaydonchong/jharness/commit/e5772f1d6065f6087f72bfa3e06c911ca7b784ff).
- 2026-11-18: [ce09f35 — consistent error handling](https://github.com/Jaydonchong/jharness/commit/ce09f35d200236aece15f730f2cc8808a8b41520).
- 2026-11-18: [9d65124 — add tool validation error loop](https://github.com/Jaydonchong/jharness/commit/9d65124659e52e3665af3bd908a4d187070d907b).
- 2026-11-18: [ba48484 — update productivitiy agent](https://github.com/Jaydonchong/jharness/commit/ba484848cdca6644d714842ffcb878217dddffc2).
- 2026-11-18: [c721be0 — update documentation](https://github.com/Jaydonchong/jharness/commit/c721be0bca8f41a7e75555fe5c64083986ab7f99).
- 2026-11-24: [e9f7a18 — Add OpenCode Go inference provider](https://github.com/Jaydonchong/jharness/commit/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695).

[agent-config]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/agentConfig/AbstractAgentConfig.ts
[agent-loop]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/core/AgentLoop.ts
[agent-session]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/AgentSession.ts
[agent-tool]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/core/AgentTool.ts
[chunk-repository]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/data/RAGChunkRepository.ts
[compaction-pipeline]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/core/CompactionPipeline.ts
[context-assembler]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/core/ContextAssembler.ts
[embedding-adapter]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/network/embeddingModel/OllamaEmbedder.ts
[evaluation-target]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/adapters/AgentSessionEvaluationTarget.ts
[llm-judge]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/graders/LlmJudgeGrader.ts
[model-summarizer]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/handlers/ModelSummarizerHandler.ts.ts
[online-processor]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/online/OnlineEvaluationProcessor.ts
[opencode-adapter]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/OpenCodeGo.ts
[pg-memory-store]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/memoryStore/PGChunkMemoryStore/PGChunkMemoryStore.ts
[provider-contract]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/Interfaces.ts
[reranking-adapter]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/network/rerankingModel/CloudflareReranker.ts
[session-logger]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/AgentSessionLogger.ts
[tempo-reader]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/online/TempoEvaluationTraceReader.ts
[text-normalizer]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/utils/TextNormalizer.ts
[tool-invoker]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/core/ToolInvoker.ts
[tracer]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/telemetry/Tracer.ts
[vercel-adapter]: https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/VercelSDK.ts
