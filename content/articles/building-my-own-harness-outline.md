# Building my own agent harness — working outline and references

## Contents

- [How to read the examples](#how-to-read-the-examples)
- [Intro](#intro)
- [What is an agent](#what-is-an-agent)
  - [What is a harness](#what-is-a-harness)
    - [Model specialization](#model-specialization)
  - [Ways to build an agent](#ways-to-build-an-agent)
- [Integrating with language models](#integrating-with-language-models)
  - [Provider](#provider)
- [Tools](#tools)
  - [Tool invocation](#tool-invocation)
  - [Deferred tool calling](#deferred-tool-calling)
- [Building the simplest agent](#building-the-simplest-agent)
  - [The agentic loop](#the-agentic-loop)
  - [Errors and retries](#errors-and-retries)
- [Personalization](#personalization)
  - [System prompt](#system-prompt)
  - [Agent capabilities and permissions](#agent-capabilities-and-permissions)
- [Session management](#session-management)
- [Context](#context)
  - [Memory](#memory)
  - [ContextAssembler](#contextassembler)
    - [Where production context comes from](#where-production-context-comes-from)
    - [Data pipelines prepare sources before the agent needs them](#data-pipelines-prepare-sources-before-the-agent-needs-them)
    - [Selection is more than concatenation](#selection-is-more-than-concatenation)
  - [RAG](#rag)
  - [RAG Improvement techniques](#rag-improvement-techniques)
- [Compaction](#compaction)
- [Observability](#observability)
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
- [Closing the tutorial](#closing-the-tutorial)
- [References](#references)
  - [External sources](#external-sources)
  - [Agent architecture and model integration](#agent-architecture-and-model-integration)
  - [Tools and invocation](#tools-and-invocation)
  - [Memory, retrieval, and indexing](#memory-retrieval-and-indexing)
  - [Compaction](#compaction-1)
  - [Evaluation and observability](#evaluation-and-observability)
  - [Additional sources consulted during the review](#additional-sources-consulted-during-the-review)
  - [Historical references](#historical-references)

This article explains the architecture and progression of my personal agent harness, [jharness](https://github.com/Jaydonchong/jharness).
The tutorial covers the intended design, including capabilities that are not yet built.
Repository examples illustrate agent components; a linked code snapshot does not establish that every discussed capability is implemented.

Authoring scope: providers, tools, the agent loop, configuration and permissions, sessions, memory, retrieval, compaction, observability, and evaluation.
Keep controller architecture, application service architecture, and application startup out of the tutorial explanation.
No implementation-status table is included.

The section order follows the supplied brain dump.
The references below preserve the sources consulted and supporting repository files identified during the architecture and outline review on 24 November 2026.

### How to read the examples

The snippets build one concern at a time.
Begin with contracts and happy paths, add validation and retries where those topics are discussed, then add instrumentation in the observability section.
Each fenced block is a separate excerpt; a later version replaces the earlier fragment it names.
Imports and surrounding declarations are omitted when they are not the subject of an excerpt.
Teaching versions simplify the linked repository code.
Sections without an example in the current implementation use ASCII process diagrams to explain the intended flow.

## Intro

- With AI being such a big growing trend, The ability to build agents is getting more and more popular.
- New abstractions that simplifies accessibility to the technology appears almost on a weekly basis at this point, and with that comes more and more layers which muddles the basics of using agent effectively
- I was at a point where I was exploring ways to understand agents, I've built automation from automated PR review routines to more coordinated and automated internal issue triage and investigation.
- This was however, a use case for my own agentic workflow, which I quickly realized is already a very abstracted understanding of agents, and when it came to conversations about agentic product, landed me in a spot where I didn't know how to answer
- What started as curiosity of understanding the internal wiring of agents, led to an attempt at building my own harness
- This article explains that journey, as well as the design of my own agent, [jharness](https://github.com/Jaydonchong/jharness).
  Not all of the components have been implemented at the time of writing.
  Some components come from research that I intend to implement in the future.

## What is an agent

> **Diagram placeholder — Process: read, reason, act.**
> Show a task entering the model-directed loop, an action returning observations, and an explicit completion branch.

- With different terminologies popping up in the space, it is easy to see why many people are confused at what it means to "build an agent", or what exactly is an agent in the first place
- The best description I've found when it comes to explaining is that an agent is simply a system which allows stateless and non-deterministic Machine learning model to have "agency" or "purpose" to complete a task by **reasoning** and **deciding** the steps to fulfill your request

### What is a harness

- The picture becomes clearer when you imagine each model request reaching a new intern who is a fast learner, with no independent recollection of the conversation.
- The model sees one request at a time.
  The harness maintains and selects the context, including conversation history, for that request.
  A single request can contain multiple messages with different roles.
- For this new intern to fulfill your request in the way you would like it, you would need to make sure in the 1 request you are giving to them you should include the necessary context which includes constraints, progress and instructions for it to decide what is the next optimal step
- As this model scales where issues might require more than a single message and context management becomes more complex and nuanced, the intuition here would be to build a system around that interaction with the model to create the right workflow (more specifically loop) for it to progress the task, and that system is what is known as a harness.
- Existing agent applications combine model access with a harness that manages context, tools, and execution.
- A useful simplified model is a language model working inside a harness.
  In an agentic system, the model selects actions toward a goal, while the harness supplies context, executes actions, and enforces boundaries.
  A model wrapped in a fixed workflow does not by itself establish model-directed action.

> **Diagram placeholder — Architecture: model and harness boundary.**
> Show the harness supplying context to the model and executing model-selected actions; keep the view at the concepts introduced here.

#### Model specialization

A harness does not need to use the same language model for every operation.
Production systems can combine models selected for different responsibilities, balancing quality, latency, and cost for each task.
[Anthropic's production research system](https://www.anthropic.com/research/multi-agent-research-system) provides one example of assigning different models to different responsibilities.
The same principle applies within a harness's supporting components.

| Task | Model role | Selection goal |
| --- | --- | --- |
| Reasoning and answer generation | A generative language model selects actions and produces the response. | Reliable reasoning, tool use, and answer quality. |
| Compaction | A summarization model condenses earlier context. | Preserve requirements and decisions within a token budget; use a smaller model when evaluations justify the trade-off. |
| Retrieval | An embedding model represents queries and source content as vectors for search. | Useful matches for the corpus and query types. |
| Reranking | A relevance model scores retrieved candidates against the query. | Put the strongest supporting material ahead of weaker matches. |

These roles can produce different kinds of output: answers, summaries, vectors, or relevance scores.
Embedding and reranking models do not need to be conversational language models.
The [information-retrieval guidance](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-information-retrieval) separates query embedding, search, and reranking as distinct operations.

```text
[Harness]
  |
  +--> [Reasoning / answer generation] --> [Generative model]
  +--> [Compaction] --------------------> [Summarization model]
  +--> [Retrieval embeddings] ----------> [Embedding model] --> [Search]
  +--> [Reranking] ---------------------> [Relevance model]
```

The harness assigns a model to an operation; each operation does not require another autonomous agent.
A deployment can reuse a model across roles when that meets its requirements.
For vector retrieval, indexed content and queries must use a compatible embedding space, normally the same embedding model and configuration.
Treat a change of embedding space as an indexing change rather than swapping the query model alone.

The project's [embedding adapter](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/network/embeddingModel/OllamaEmbedder.ts) and [reranking adapter](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/network/rerankingModel/CloudflareReranker.ts) illustrate specialized interfaces alongside the generative provider.
The later retrieval, compaction, and eval sections explain how to assess those roles separately.

### Ways to build an agent

Diagram: Comparison of approaches and which responsibilities the developer controls.
These approaches can be combined; automation triggers and sub-agents are not successive infrastructure levels.

- **Direction:** An existing agent (i.e. Codex, Claude, Opencode) is given specific, repeating context (i.e. thorugh skill or reusable prompts) to execute task as its own
- **Sub-agents:** Harness such as Claude and Codex provides user with the ability to define specific subagents with their own access permission and tool set
- **Automation:** This is where automation starts to bud, we leverage deterministic signals (i.e. webhook or routiness) to trigger agents to begin
- **SDK:** This is where code gets involved, many API providers such as Vercel AI SDK, Langgraph and OpenAI API's provide batteries included SDKs which allows you to integrate Agents with code
- **Hand-rolled harness (the focus here):** Own the agent loop, state, context management, and tool orchestration while retaining lower-level libraries where useful.
- **Inference infrastructure:** Hosting or managing model execution is a separate concern from owning the harness.
  Keep inference internals outside this tutorial.

## Integrating with language models

### Provider

- Providers are gateways that allows for API request to a hosted model
- Distinguish the model, the hosted provider or gateway, the SDK, and the harness adapter.
- Use the Vercel AI SDK adapter to explain the integration boundary.
  Author detail to supply: the reason for selecting that SDK and the model access used at the time.
- Generation can return buffered output or stream output incrementally.
  Explain both delivery modes without requiring the reader to understand a particular SDK configuration.

> **Diagram placeholder — Class: provider contract.**
> Show ILlmProvider, VercelSDK, and OpenCodeGo; distinguish implementation of the contract from OpenCodeGo delegating to VercelSDK.

Provider contract excerpt from [Interfaces.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/Interfaces.ts).
The normalized request and response types keep the loop independent of an SDK.

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

Happy-path adapter excerpt, simplified from [VercelSDK.ts](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/VercelSDK.ts).
Here the excerpt shows buffered text and normalized messages; tool metadata is added in the tools section.

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

Streaming delivery uses the same request context.
The caller consumes text chunks, then reads the completed turn metadata.

```typescript
const stream = await provider.streamText({ config, messages });
for await (const chunk of stream.reply) {
  renderText(chunk);
}
const completed = await stream.completed;
```

## Tools

> **Diagram placeholder — Class: tool contract and invocation.**
> Show AgentTool, concrete tools, and ToolInvoker; include useTool() and execute(), with the registry as the lookup relationship.

- Tools are simply functions that can be triggered
- The biggest differentiator between an agent and a raw language model is the ability to act.
  Think of the model as the brain, the response as nerve firing, and tools as the limbs.
- Tools are made up of input and output
- The tool module maintains a **Tool Registry**, which agents have access to via **Tool Definitions** and triggers them through **Tool Call**.
    - A LM decides the tool needs to be triggered, the harness executes the tool and returns the result

Add tool-call metadata to the provider response when introducing tool calling.
The adapter maps SDK names to the harness contract, as in [VercelSDK](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/VercelSDK.ts).

```typescript
const toolCalls: ILlmToolCall[] = result.toolCalls.map((call) => ({
  id: call.toolCallId,
  name: call.toolName,
  input: call.input,
}));
const responseWithTools = { ...response, toolCalls };
```

Normalized call and result shapes, adapted from [the provider contract](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/Interfaces.ts) and [ToolInvoker](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/core/ToolInvoker.ts).
The arithmetic tool is a small teaching example; the call ID connects the result to the model's request.

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

Tool definitions expose schemas to the model.
Adapted from [VercelSDK.sanitizeTool](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/providers/VercelSDK.ts); execution remains with the harness.

```typescript
const tools = Object.fromEntries(
  agentTools.map((agentTool) => [agentTool.name, tool({
    description: agentTool.description,
    inputSchema: agentTool.inputSchema,
    outputSchema: agentTool.outputSchema,
  })]),
);
```

The same teaching tool uses the [AgentTool contract](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/core/AgentTool.ts).
The body shows only the successful operation; validation is introduced separately.

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

### Tool invocation

> **Diagram placeholder — Process: tool invocation.**
> Show the model call, registry lookup, execution, and the tool result tied to its call ID; introduce validation and permission checks with their later sections.

- Treat tool interaction as interface between LM and side effects
- Like any other process, tool requires right security, reliability and performance measures
- Retries, caching, permission checks, serial vs parallel execution and error handling contributes to improving these metrics

Happy-path dispatch, simplified from [ToolInvoker.invoke](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/core/ToolInvoker.ts).
Assume registered tools and valid inputs at this stage.
The loop awaits each tool so batch execution is serial.

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

### Deferred tool calling

Diagram: Progressive disclosure to tool suites

- A context managmenet technique for managing tool loaded at start time
- Allows agent to decide if they would want to check for more tools

Process diagram: discovery changes which definitions are sent on the next model step.
Returning tool descriptions alone does not make those tools executable.
The catalog determines which tools are eligible for exposure.

```text
[Model sees available tools]
             |
             v
   [Request tool discovery]
             |
             v
  [Search eligible catalog]
             |
             v
 [Register discovered tools]
             |
             v
[Add definitions to next request]
             |
             v
[Model selects a loaded tool]
```

## Building the simplest agent

### The agentic loop

> **Diagram placeholder — Process: happy-path agent loop.**
> Show model request, final-answer/tool-call branching, tool execution, result appending, and the next step; include the step limit.

- A task can require multiple incremental steps before completion.
- To choose a next step, the model needs context about previous steps.
  The harness carries that context through an agentic loop.
  Each iteration attempts to advance the task; completion checks and limits govern when execution ends.
- A tool-driven loop requests model output, executes requested tools, appends tool results to the context, and requests the next step.
  A final answer ends that turn.
- An alternative loop can feed an intermediate response into another reasoning, critique, or validation step without calling a tool.
  Explain that alternative as a design pattern rather than a description of the repository loop.
  Define a completion condition and an iteration limit for either pattern.
- Similar to tool process, there needs to be proper retries, caching, permission checks and error handling
- Once you have a tool, a provider and the loop, congratulations you have built your first agent

Teaching version of [AgentLoop](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/core/AgentLoop.ts).
The caller has already appended the user message to the conversation.
This first version handles a buffered turn with a step limit and no retry or telemetry layer.

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

### Errors and retries

A failed provider request and a failed tool action are different failure boundaries.
Retry a provider request only when the error policy permits another attempt.
Keep tool execution outside the provider retry block so another model attempt does not replay completed tool actions.
The retry helper below is for buffered requests; retrying streamed output requires tracking whether output has already been delivered.
Coordinate SDK retries with harness retries so the two layers do not multiply attempts unexpectedly.

> **Diagram placeholder — Process: retry extension to the agent loop.**
> Extend the earlier loop view with a retryable-error decision and an attempt limit around the provider request; keep completed tool actions outside that return path.

Add a bounded retry layer around generation, adapted from [AgentLoop](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/core/AgentLoop.ts).
The supplied policy classifies retryable provider failures; configuration and authentication failures should stop.

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

For the retry-enabled version, add a `shouldRetry: (error: unknown) => boolean` parameter to runAgent.
Replace only the provider call inside runAgent with this fragment.
Message appending and tool execution remain outside the retry helper.

```typescript
const response = await generateWithRetries(
  provider,
  { config, messages: conversation.messages },
  shouldRetry,
);
```

At the tool boundary, AgentTool.useTool owns input and output validation.
Pass the original arguments to useTool so the invocation layer does not parse a transforming schema twice.
This teaching version reduces [AgentTool](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/core/AgentTool.ts) and [ToolInvoker](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/tools/core/ToolInvoker.ts) to the validation-error path.
Return the error as a tool result tied to the original call so the model can repair the arguments.
Other execution failures propagate rather than silently replaying an action.

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

## Personalization

### System prompt

- A system prompt supplies consistent instructions about the agent's role, behavior, and constraints.
  Explain the system prompt as guidance accompanying the request.
  Its exact representation in messages or provider fields is an integration detail.
- Popular AI apps (Chatgpt, Claude etc.) comes with their own, and is why using 2 apps that have the same model can result is very different results
- The harness includes system guidance with the context for each model request.
  A conversation can contain multiple user turns, and a user turn can require multiple model steps.
- Use agent configuration to manage agents with different behavior and capabilities.
  A calendar assistant and a research assistant need different instructions and tools.

Configuration excerpt adapted from [AbstractAgentConfig](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/agentConfig/AbstractAgentConfig.ts).
A fixed instruction and a selected tool set define this example's behavior.

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

### Agent capabilities and permissions

- Agent configuration describes the tools and permission policy available to an agent.
- The harness checks the permission policy before executing an action.
  Explain approval, denial, and any required user confirmation at that boundary.
- Explain both tool exposure and execution-time enforcement.
  A prompt instruction or an omitted tool is not a complete permission system.
- Use these as the intended permission semantics for the finished harness.

Process diagram: configuration supplies the policy, and invocation enforces the decision.
The same boundary applies when tools were discovered dynamically.

```text
[Tool call + configured permission policy]
                    |
                    v
          [Permission decision]
             /      |      \
           deny   allow    ask
            |       |       |
            v       v       v
        [Reject] [Execute] [User approval]
                              /     \
                            no      yes
                             |       |
                             v       v
                         [Reject] [Execute]
```

## Session management

- State Management
- Checkpointing: distinguish a compaction summary from a durable snapshot that can restore a session after restart.
  Explain the intended recovery behavior separately from logging.
- Session logging: preserve an execution record for inspection.
  A log is not automatically a restorable session.
- Message tracking

> **Diagram placeholder — Class: session ownership.**
> Show Harness creating AgentSession and the session owning AgentConversation, AgentLoop, and SessionState, with a logger dependency.

Conversation and state excerpt, adapted from [AgentConversation](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/core/AgentConversation.ts) and [SessionState](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/SessionState.ts).
The same conversation object carries messages into the next user turn.

```typescript
sessionState.transitionTo(SessionStatus.REASONING);
conversation.append({ role: 'user', content: userMessage });
const reply = await runAgent(provider, config, conversation, toolInvoker, shouldRetry);
sessionState.transitionTo(SessionStatus.WAITING);
```

Process diagram for durable recovery.
Persist enough state to reconstruct a session; a compaction summary and a log serve different purposes.
Save at a stable turn boundary to avoid treating an unfinished side effect as complete.

```text
[Turn completes at a stable boundary]
                 |
                 v
[Snapshot: messages + summary + session state]
                 |
                 v
       [Persist checkpoint]
                 |
       ... process restarts ...
                 |
                 v
         [Load checkpoint]
                 |
                 v
[Restore messages + summary + session state]
                 |
                 v
        [Continue next turn]
```

Event record shape adapted from [AgentSessionLogger](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/AgentSessionLogger.ts).
Serialization and queued file writes belong in the logger, outside the loop example.

```typescript
sessionLogger.onSessionEvent(sessionId, AgentSessionEventType.USER_MESSAGE, {
  message: userMessage,
});
sessionLogger.onSessionEvent(sessionId, AgentSessionEventType.ASSISTANT_MESSAGE, {
  message: reply,
});
```

## Context

### Memory

- Semantic, episodic, and procedural memory as conceptual categories.
  Use the project's fact, decision, preference, and session-summary types as concrete examples rather than claiming a one-to-one taxonomy.
- Storage patterns: append-only decision records, mutable preference documents, session summaries, and searchable fact chunks.
  Distinguish what the memory means from how the memory is stored.
- Distillation: use a model to summarize accumulated memory into reusable context.
  Distinguish that summary from a retrieval cursor or a storage checkpoint.
- Access pattern : Injection (i.e. inserted at the start of every session), Recall and Remember tool

> **Diagram placeholder — Architecture: memory stores and access paths.**
> Show ContextAssembler routing FACT data to PGChunkMemoryStore and the other memory types to local storage; distinguish session injection from explicit remember/recall.

Storage routing adapted from [memory types](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/core/Interfaces.ts) and [ContextAssembler](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/core/ContextAssembler.ts).
The memory category decides which store receives a write.

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

Process diagram: distillation produces context for injection.
The remember and recall tools expose explicit access during a turn; this path prepares persistent preferences for a new session.

```text
[Stored preferences]
         |
         v
[Recall preferences]
         |
         v
 [Distill memory]
         |
         v
[Distilled memory] -----+
                       |
[System guidance] -----+--> [Assemble request] --> [Model]
                       |
[Conversation history]-+
```

### ContextAssembler

Memory gives information somewhere to live.
Context assembly decides which information the model should receive for the next step.
A user message is only one input: the model also needs instructions, relevant conversation state, selected memories, and observations from tools.
The set of useful inputs changes as the task progresses, so assembly is a repeated selection step rather than loading every available source at the start.
This broader view follows [Anthropic's explanation of context engineering](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents).

In this project, [ContextAssembler](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/core/ContextAssembler.ts#L45) provides a starting point: it routes memory writes and retrieval between the local and searchable stores, and exposes a session-context preparation path for preferences.
[AgentSession](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/AgentSession.ts#L217) and AgentConversation combine that session context with system guidance, conversation history, and the compaction checkpoint.
The production design below extends those sources without moving every data preparation task into ContextAssembler.

#### Where production context comes from

A production agent can combine several kinds of information:

- **Instructions and capabilities:** the system prompt, available tool definitions, and execution constraints.
- **Conversation state:** the current request, recent exchanges, and a summary of earlier progress.
- **Persistent memory:** user preferences, prior decisions, and relevant session summaries.
- **Reference material:** selected passages from documents or other indexed knowledge.
- **Operational observations:** current database records, API responses, and tool results about the task.

For a concrete example, consider a support agent explaining a delayed delivery.
The answer can require the customer's latest message, the current order record, tracking events from a carrier, the applicable delivery policy, and a preference about how to contact the customer.
A policy document and a recent tracking event have different freshness requirements.
The assembler needs the relevant facts and their origins, rather than an undifferentiated block of retrieved text.
This is an illustrative production scenario, not an account of a feature in the personal project.

#### Data pipelines prepare sources before the agent needs them

Some context is fetched directly when the agent asks for it.
Other context arrives through real-world data pipelines that collect records from business databases, documents, external APIs, or event feeds.
A pipeline can run on a schedule or react to incoming changes.
Its job is to prepare a reliable source that an agent can query, rather than sending every ingested record directly to the model.
Microsoft's [data-platform guidance](https://learn.microsoft.com/en-us/azure/well-architected/ai/data-platform) separates ingestion, processing, storage, and the retrieval needs of an AI workload.

For documents, preparation can include extraction, cleanup, deduplication, chunking, and embedding.
For operational records, preparation can instead produce normalized rows or a current-state view.
Carry source identifiers, observation or update times, and access metadata through these transformations.
The [Databricks ingestion and preprocessing guidance](https://learn.microsoft.com/en-us/azure/databricks/agents/tutorials/ai-cookbook/quality-data-pipeline-rag) describes parsing, enrichment, deduplication, and preserving metadata alongside retrievable content.

> **Diagram placeholder — Architecture: context sources and assembly boundary.**
> Show upstream data preparation feeding queryable stores, live tools providing fresh observations, and the harness combining selected results with instructions and session state.

The intended boundary is visible in this ASCII process diagram:

```text
[Documents / business records / external events]
                         |
                         v
        [Ingest: scheduled jobs or incoming changes]
                         |
                         v
       [Validate / normalize / attach source metadata]
                         |
                         v
      [Queryable records / document indexes / views]
                         |
                         v
              [Retrieve relevant fragments] -----+
                                                  |
[Live APIs / tools] --> [Fresh observations] -------+
                                                  |
[Memory + conversation + instructions] ------------+
                                                  |
                                                  v
                                    [Assemble next model request]
                                                  |
                                                  v
                                               [Model]
```

The pipeline updates the information available for retrieval independently of a particular conversation.
The harness requests a task-relevant subset when preparing a model step.
A live tool call can supply a fresher observation when a prepared dataset is not current enough for the question.
That observation becomes part of the context for a subsequent model step.

#### Selection is more than concatenation

For the intended design, context assembly has four decisions to make:

1. Identify the sources needed for the task and retrieve only records the caller is allowed to access.
2. Check relevance, freshness, and provenance before treating a fragment as supporting evidence.
3. Fit selected information into the context budget while retaining the current request and necessary instructions.
4. Keep source data distinguishable from instructions, with identifiers available for citations and later inspection.

If a required source is unavailable or stale, the harness should expose that gap so the agent can request fresh data or explain the missing evidence.
Successful retrieval alone does not establish that a fact is current or appropriate for the task.
The next section examines one source path in detail: retrieving reference material through RAG.

### RAG

- Embedding
- Vector database (pgvector)
- Pre-Chunking
  - Before chunking, explain extraction cleanup and text normalization.
    Cover line-ending standardization, optional Unicode NFC normalization, and removal of source noise such as repeated PDF headers or HTML navigation.
    Preserve paragraph breaks, Markdown structure, tables, and code.
  -
- Post- processing
  - After chunking, discuss optional transformations for embedding separately from the original source text.
    Examples include lowercasing, spelling correction, and stop-word removal.
    Keep source text available for results and citations.
    Explain that transformations can alter meaning and need evaluation, using removal of “not” as an example.
    Resolve the original Microsoft research citation before attributing a particular recommendation.
- Vector normalization, Vector similarity
	- Dot product vs cosine similarity.
	  Explain vector normalization before discussing when the rankings are equivalent.
	- K-NN ANN

> **Diagram placeholder — Process: RAG indexing.**
> Show source extraction and cleanup, overlapping chunks, a duplicate-document shortcut, embeddings, and persistence of source text, vectors, and provenance.

Indexing excerpt adapted from [PGChunkMemoryStore](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/memoryStore/PGChunkMemoryStore/PGChunkMemoryStore.ts).
The chunk text remains available alongside its embedding and provenance.
The excerpt stops before document persistence.

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

Vector normalization excerpt from [PGChunkMemoryStore](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/memoryStore/PGChunkMemoryStore/PGChunkMemoryStore.ts).
Use the same normalization policy for indexed vectors and query vectors before comparing similarity.

```typescript
function normalizeEmbedding(embedding: number[]): number[] {
  const norm = Math.hypot(...embedding);
  if (norm === 0) throw new RangeError('Cannot normalize a zero-length embedding');
  return embedding.map((value) => value / norm);
}
```

### RAG Improvement techniques
- Compaction
  - Summarize and compact the search results
- Hybrid Search
	- Semantic vs Lexical Search
	- BM25 as a lexical-ranking technique to explain alongside PostgreSQL full-text search.
	  Do not use the names interchangeably.
- Query Transformation
  - Ask a lower model to repharase the query
  - Break the question into multiple smaller and focused question
- Reranking
  - Using a reranking model
  - Rank fusion
- Graph RAG, Agentic RAG

> **Diagram placeholder — Process: RAG recall.**
> Show a query entering semantic and lexical retrieval in parallel, rank fusion, reranking, and selected chunks returned with references; keep query transformation as a separate extension.

Hybrid retrieval excerpt, simplified from [PGChunkMemoryStore.retrieve](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/memoryStore/PGChunkMemoryStore/PGChunkMemoryStore.ts).
Fusion combines rankings from two retrieval methods; the reranker then scores the combined candidates for the query.

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

Process diagram for query transformation and retrieval-result compaction.
Keep original source references attached to the evidence selected for the answer.

```text
[Question] --> [Rewrite / decompose]
                        |
               +--------+--------+
               |                 |
               v                 v
          [Query A]         [Query B]
               |                 |
               v                 v
          [Retrieve]        [Retrieve]
               |                 |
               +--------+--------+
                        |
                        v
              [Deduplicate sources]
                        |
                        v
            [Summarize with references]
                        |
                        v
             [Evidence + source text]
```

## Compaction

- Compaction Engine
- Tokenization to evaluate performance
- Different techniques: Normalization, prefix removal, tool summarization, Use a light weight model to do compaction
- Nudging mechanism

> **Diagram placeholder — Class: compaction structure.**
> Show CompactionEngine, CompactionPipeline, AbstractCompactionPipelineNode, its concrete handlers, and tokenizer/provider dependencies.

> **Diagram placeholder — Process: compaction transformations and budget feedback.**
> Show recent exchanges retained on a side branch, older tool content deduplicated and summarized, bounded budget nudges, and the summary combined with retained exchanges.

Pipeline composition excerpt using the [compaction nodes](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/core/CompactionPipeline.ts).
This version shows only the order of transformations.

```typescript
const pipeline = new CompactionPipeline()
  .addNode(new RecentMessageRetainHandler({ threshold: 2 }))
  .addNode(new DedupeRepeatedContent())
  .addNode(new ModelSummarizer({ llmProvider, model }));
```

Budget feedback teaching version, based on [ModelSummarizer](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/handlers/ModelSummarizerHandler.ts.ts).
A nudge revises a generated summary; it is different from retrying a failed API request.
This example enforces the budget after two nudges.

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

## Observability

Observability records how the harness behaves during execution.
Traces explain one execution path; metrics summarize behavior across many executions.
Evals use captured evidence to judge whether the behavior and results satisfy explicit criteria.

### Architecture

The harness instruments agent operations with OpenTelemetry and exports telemetry to a collector.
The [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) receives signals, processes them, and exports them to the configured backends.
[Tempo](https://grafana.com/docs/tempo/latest/) stores and queries traces.
[Prometheus](https://prometheus.io/docs/introduction/overview/) stores metric time series.
[Grafana](https://grafana.com/docs/grafana/latest/datasources/) queries these backends to display traces and dashboards.

> **Diagram placeholder — Architecture: collector and observability backends.**
> Show OTLP telemetry entering the collector, traces exported to Tempo, metrics exposed for Prometheus to scrape, and Grafana querying both backends.

```text
[Harness instrumentation + OpenTelemetry SDK]
                       |
                 OTLP telemetry
                       |
                       v
          [OpenTelemetry Collector]
              /                 \
       trace export      expose metrics endpoint
            |                    |
            v                    v
         [Tempo]       [Prometheus scrapes + stores]

[Grafana] -- queries traces --> [Tempo]
[Grafana] -- queries metrics -> [Prometheus]
```

This diagram uses the collector's [Prometheus exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusexporter/README.md), which exposes a metrics endpoint for scraping.
The repository's [instrumentation module](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/telemetry/instrumentation.ts) exports traces and metrics over OTLP; the collector and backend deployment are separate from that module.
The online evaluation worker reads stored traces from Tempo rather than querying Grafana.

### Instrumentation

Keep instrumentation at the operation that owns the work.
Use spans to connect operations within a trace, then use counters and histograms to aggregate their frequency, outcomes, and duration.
The examples separate those concerns so tracing and metric collection remain understandable on their own.

#### Tracing

A trace connects a turn to its provider steps and tool actions through parent-child spans.
Compaction has its own pipeline and node spans.
A separately requested compaction operation does not need to be a child of a previous, completed agent turn.

##### Tracing agent loop

The earlier runAgent remains the execution core.
Wrap the turn in an active span, then create child spans at the provider and tool boundaries.
The repository's tracer wrapper records exceptions, sets error status, and ends each span.
An initialized OpenTelemetry runtime and context manager are assumed here.

> **Diagram placeholder — Trace hierarchy: agent turn instrumentation.**
> Show provider steps and tool batches as children of a turn, with retry attempts scoped to the relevant provider step.

Tracing-only teaching version, adapted from [AgentSession](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/AgentSession.ts) and [Tracer](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/telemetry/Tracer.ts).

```typescript
const tracer = getTracer('agent-session');

async function runObservedAgent(invoke: () => Promise<string>): Promise<string> {
  return tracer.startActiveSpan('agent.turn', () => invoke());
}

const reply = await runObservedAgent(() =>
  runAgent(provider, config, conversation, toolInvoker, shouldRetry),
);
```

Inside that active turn, wrap the provider call and tool batch with child spans.
These fragments replace the corresponding calls in the retry-enabled runAgent.
Keep the message append and STOP check between the two fragments.
The tool-batch fragment belongs after the existing TOOL_CALL guard.
Adapted from [AgentLoop](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/agent/core/AgentLoop.ts) and [its span decorators](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/telemetry/Decorators.ts).

```typescript
const response = await tracer.startActiveSpan('agent.provider_step', () =>
  generateWithRetries(provider, { config, messages: conversation.messages }, shouldRetry),
);
```

Inside the guarded tool-call branch:

```typescript
const toolResult = await tracer.startActiveSpan('agent.tool_call_batch', (span) => {
  span.setAttribute('tool.call_count', response.toolCalls!.length);
  return toolInvoker.invoke(response.toolCalls!);
});
conversation.append(toolResult);
```

##### Tracing compaction

A pipeline span identifies one compaction run.
Each node span identifies which transformation ran and how its message count changed.
Keep the node name and counts on the span so a slow summarization step can be distinguished from retention or deduplication.

> **Diagram placeholder — Trace hierarchy: compaction pipeline.**
> Show the pipeline span containing retention, deduplication, and summarization node spans, with provider calls nested under summarization when instrumented.

Excerpt inside the existing [CompactionPipeline](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/core/CompactionPipeline.ts) class.
The class supplies the tracing scope used by the decorator; the excerpt omits metric recording.

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

#### Metrics

Counters record how often an operation occurs.
Histograms record distributions such as duration, token counts, or reduction ratios.
Use bounded attributes such as operation, node name, and outcome to distinguish measurements.

##### Metrics for agent loop

Measure turn attempts, success/error outcomes, and turn duration.
Provider input/output token counters and tool count/duration instruments add detail at their respective boundaries.
These measurements describe execution cost and reliability; they do not establish answer quality.

Metric-only teaching version based on [AgentSession](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/harness/core/AgentSession.ts).
The finally block records both successful and failed turns without changing the result or error.

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

Wrap the earlier traced turn with runMeasuredAgent when both signals are needed.
Tracing and metric recording describe the same execution without running the agent twice.

##### Metrics for compaction

Record tokens before and after compaction, tokens saved, and the reduction ratio.
Also track pipeline/node duration, summary nudges, and whether the summary met its budget.
A smaller context can still lose an important requirement, so semantic preservation belongs in the compaction eval below.

Token measurements adapted from [CompactionEngine](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/compaction/core/CompactionEngine.ts).
The same baseline tokenizer should measure the full before/after contexts, including the retained messages.
This teaching version records savings and growth separately because [histogram measurements are nonnegative](https://opentelemetry.io/docs/specs/otel/metrics/api/#histogram).
The reduction ratio is zero when context grows; skip the ratio when the original context is empty.

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

##### Metrics for memory

Measure remember, recall, and session-context preparation separately.
For RAG-backed recall, query embedding, semantic search, lexical search, and reranking need their own duration and outcome measurements.
That separation helps locate a slow source or failed retrieval stage without treating all memory work as one operation.

Operation measurement adapted from [ContextAssembler](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/core/ContextAssembler.ts).
The same pattern is used with rag.operation attributes in [PGChunkMemoryStore](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/memory/memoryStore/PGChunkMemoryStore/PGChunkMemoryStore.ts).

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

### Evals

An eval combines evidence, a criterion, and a grader outcome.
Keep operational measurements separate from quality judgments: a fast response, a successful recall call, or a short summary can still fail the task.
Both online and offline evals can reuse grader contracts and persist outcomes for comparison.

> **Diagram placeholder — Class: shared evaluation contracts.**
> Show EvaluationHarness using EvaluationTarget, EvaluationGrader, and EvaluationTrialStore; relate AgentSessionEvaluationTarget to the target contract and show that online grading reuses graders and the trial store.

#### Online evals

- Sampling
- Async evaluations
- Rely more heavily on LLM as judge, as requests can vary

> **Diagram placeholder — Architecture: online evaluation boundaries.**
> Show the completed agent turn, trace store, queue, worker, graders, and trial store; connect the worker to the stored trace through its trace ID.

> **Diagram placeholder — Process: online evaluation lifecycle.**
> Expand the ASCII flow below with trace retrieval retries, grading, and persisted outcomes; keep publication failure separate from the agent answer.

Process diagram: sampling selects traces for background evaluation.
The turn has already produced its response, and the publisher is a harness dependency.
Queue publication failure should not replace the agent answer with an evaluation error.

```text
[Completed agent turn] --> [Return answer]
           |
           v
   [Sampling decision]
       /         \
     skip       select
      |           |
      v           v
 [No grading] [Publish trace reference]
                     /        \
                  queued     failed
                    |           |
                    v           v
              [Read trace] [Record publication error]
                    |           |
                    v           v
             [Grade + store] [Keep original answer]
```

Background grading excerpt adapted from [OnlineEvaluationProcessor](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/online/OnlineEvaluationProcessor.ts).
The trace reader supplies the completed turn; evaluation does not run the agent again.

```typescript
const traceData = await traceReader.read(message);
for (const grader of profile.graders) {
  const outcome = await grader.grade(traceData);
  await recordOutcome(grader.id, outcome);
}
```

##### Evals on conversation

Evaluate whether the response addresses the request, respects relevant prior constraints, and supports its claims with the available evidence.
A conversation-level check needs the relevant history or retained decisions as well as the final reply.
The input/output judge below illustrates a rubric for the captured response; it cannot establish facts that are absent from the supplied evidence.

Judge configuration based on [LlmJudgeGrader](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/graders/LlmJudgeGrader.ts).
The rubric is explicit, and the grader validates its structured judgment and quoted evidence.

```typescript
const judge = new LlmJudgeGrader({
  id: 'grounded-answer',
  provider: judgeProvider,
  model: judgeModel,
  passThreshold: 0.8,
  rubric: 'The answer addresses the question and supports corpus claims with cited evidence.',
});
```

##### Evals on Retrieval

Evaluate the returned evidence separately from the final answer.
Retain the retrieval query, ranked chunks, source references, and the answer that used them.
Check whether the chunks address the question and whether the answer's cited claims are supported by those chunks.
A recorded recall tool name proves that a call occurred; it does not establish that the returned material was relevant.

> **Diagram placeholder — Process: retrieval evaluation.**
> Show retrieval evidence and the resulting answer entering relevance and support checks, with scores and source-backed findings persisted.

```text
[Query + ranked chunks + source references] --+
                                            |
[Answer + citations] -----------------------+
                                            |
                                            v
                           [Check relevance and claim support]
                                            |
                                            v
                            [Store scores + cited evidence]
```

This flow requires retrieval artifacts to be retained for the grader.
Use an explicit missing-evidence outcome when only tool-call metadata is available.

##### Evals on compaction

Compare the original context with the summary and retained messages that replace it.
Check whether active goals, requirements, decisions, and unresolved questions survive without unsupported additions.
Use the token budget as a separate size criterion, rather than treating a reduction ratio as proof of semantic preservation.

> **Diagram placeholder — Process: compaction evaluation.**
> Compare before/after context, grade preservation and consistency, and report the semantic result alongside token measurements.

```text
[Original context] -------------------------+
                                            |
[Summary + retained messages] --------------+
                                            |
                                            v
                         [Check preserved facts and requirements]
                                            |
                                            v
                        [Semantic outcome + token-budget outcome]
```

Retain both sides of the compaction boundary for that comparison.
A summary alone cannot establish what was omitted.

#### Offline evals

- Graders, suites , evaluator
- Explain how offline evaluations can become a CI check, including controlled inputs and explicit pass criteria.
- Distinguish response-presence and tool-use checks from factual answer-quality checks.

> **Diagram placeholder — Process: offline suite execution.**
> Show suite, task, fresh evaluation session, captured response/tool evidence, graders, persisted trial, and the suite result used by CI.

Suite excerpt adapted from [systemDesignSmokeSuite](https://github.com/Jaydonchong/jharness/blob/e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695/src/evaluation/suites/systemDesignSmokeSuite.ts).
These graders inspect the response and the tool names recorded during the agent turn.
A missing tool-call record cannot establish whether retrieval occurred.

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

**Versioned runs.**

- Record the code revision, agent configuration, prompt, model, evaluation inputs, and grader versions needed to compare runs.
  Include corpus and indexing strategy identity when retrieval affects the result.

Process diagram for an evaluation manifest.
Capture the concrete identifiers at run time rather than inferring them from a later checkout.

```text
[Code + agent + prompt + model versions] --+
                                         |
[Suite + grader versions] ----------------+--> [Capture run manifest]
                                         |              |
[Corpus + indexing versions] -------------+              v
                                              [Attach to trial]
                                                        |
                                                        v
                                                 [Persist trial]
```

## Closing the tutorial

- Return to the gap between using agents and understanding the machinery underneath.
- Explain what owning the loop, context, tools, and evaluation changes about that understanding.
- Keep future directions focused on agent components.

## References

Repository links are pinned to commit `e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695`.
The references preserve research provenance; they are not a list of implemented capabilities.
### External sources

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

The exact Microsoft RAG preprocessing and Unicode normalization citations named in the original brain dump remain unresolved.
The linked data-pipeline guidance supports the ingestion and metadata discussion in the ContextAssembler section.
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

These references preserve the review trail only.
Do not expand these references into tutorial sections about application plumbing.

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

These commits establish technical sequence.
The author supplies the motivations and experiences behind each change.

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
