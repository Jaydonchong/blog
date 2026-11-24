# Building my own agent harness — working outline and references

This article explains the architecture and progression of my personal agent harness, [jharness](https://github.com/Jaydonchong/jharness).
The tutorial covers the intended design, including capabilities that are not yet built.
Repository examples illustrate agent components; a linked code snapshot does not establish that every discussed capability is implemented.

Authoring scope: providers, tools, the agent loop, configuration and permissions, sessions, memory, retrieval, compaction, observability, and evaluation.
Keep controller architecture, application service architecture, and application startup out of the tutorial explanation.
No implementation-status table is included.

The section order follows the supplied brain dump.
The references below preserve the sources consulted and supporting repository files identified during the architecture and outline review on 24 November 2026.

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

Diagram : Bounding box "Agent" with a loop of Read->Reason->Act, Act results goes to a done state or loops back to read

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

_Snippet: ILlmProvider._

_Snippet: Vercel provider adapter._

## Tools

Diagram: Tool Module

- Tools are simply functions that can be triggered
- The biggest differentiator between an agent and a raw language model is the ability to act.
  Think of the model as the brain, the response as nerve firing, and tools as the limbs.
- Tools are made up of input and output
- The tool module maintains a **Tool Registry**, which agents have access to via **Tool Definitions** and triggers them through **Tool Call**.
    - A LM decides the tool needs to be triggered, the harness executes the tool and returns the result

_Snippet: tool call result._

_Snippet: tool definition for Vercel SDK._

_Snippet: AgentTool._

### Tool invocation

Diagram: Tool loop

- Treat tool interaction as interface between LM and side effects
- Like any other process, tool requires right security, reliability and performance measures
- Retries, caching, permission checks, serial vs parallel execution and error handling contributes to improving these metrics

_Snippet: Tool Invoker._

### Deferred tool calling

Diagram: Progressive disclosure to tool suites

- A context managmenet technique for managing tool loaded at start time
- Allows agent to decide if they would want to check for more tools

## Building the simplest agent

### The agentic loop

Diagram: Agent loop

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

_Snippet: Agent config._

### Agent capabilities and permissions

- Agent configuration describes the tools and permission policy available to an agent.
- The harness checks the permission policy before executing an action.
  Explain approval, denial, and any required user confirmation at that boundary.
- Explain both tool exposure and execution-time enforcement.
  A prompt instruction or an omitted tool is not a complete permission system.
- Use these as the intended permission semantics for the finished harness.

## Session management

- State Management
- Checkpointing: distinguish a compaction summary from a durable snapshot that can restore a session after restart.
  Explain the intended recovery behavior separately from logging.
- Session logging: preserve an execution record for inspection.
  A log is not automatically a restorable session.
- Message tracking

## Context

### Memory

- Semantic, episodic, and procedural memory as conceptual categories.
  Use the project's fact, decision, preference, and session-summary types as concrete examples rather than claiming a one-to-one taxonomy.
- Storage patterns: append-only decision records, mutable preference documents, session summaries, and searchable fact chunks.
  Distinguish what the memory means from how the memory is stored.
- Distillation: use a model to summarize accumulated memory into reusable context.
  Distinguish that summary from a retrieval cursor or a storage checkpoint.
- Access pattern : Injection (i.e. inserted at the start of every session), Recall and Remember tool

### RAG

- Embedding
- Vector database (pgvector)
- Pre-Chunking
  - Before chunking, explain extraction cleanup and text normalization.
    Cover line-ending standardization, optional Unicode NFC normalization, and removal of source noise such as repeated PDF headers or HTML navigation.
    Preserve paragraph breaks, Markdown structure, tables, and code.
    Explain the distinction between NFC and compatibility normalization such as NFKC.
    Keep the original Unicode-normalization and Microsoft research notes as citation leads to resolve before drafting.
- Post- processing
  - After chunking, discuss optional transformations for embedding separately from the original source text.
    Examples include lowercasing, spelling correction, and stop-word removal.
    Keep source text available for results and citations.
    Explain that transformations can alter meaning and need evaluation, using removal of “not” as an example.
    Resolve the original Microsoft research citation before attributing a particular recommendation.
- Graph RAG, Agentic RAG
- Vector normalization, Vector similarity
	- Dot product vs cosine similarity.
	  Explain vector normalization before discussing when the rankings are equivalent.
	- K-NN ANN
- Hybrid Search
	- Semantic vs Lexical Search
	- BM25 as a lexical-ranking technique to explain alongside PostgreSQL full-text search.
	  Do not use the names interchangeably.
- Query Transformation, Hybrid Search, Reranking
	- Hybrid Search
		- Rank Fusion

## Compaction

- Compaction Engine
- Tokenization
- Different techniques: Normalization, prefix removal, tool summarization, Use a light weight model to do compaction
- Nudging mechanism

## Observability and evaluation

- First distinguish observability, which records execution, from evaluation, which judges behavior or results.
- OpenTelemetry
- Trace propagation
- Metrics at every layer
    - Tool call
    - Agentic loop
    - Compaction

### Online evaluation

- Sampling
- Async evaluations
- Rely more heavily on LLM as judge, as requests can vary

### Offline evaluation

- Graders, suites , evaluator
- Explain how offline evaluations can become a CI check, including controlled inputs and explicit pass criteria.
- Distinguish response-presence and tool-use checks from factual answer-quality checks.

### Versioning

- Record the code revision, agent configuration, prompt, model, evaluation inputs, and grader versions needed to compare runs.
  Include corpus and indexing strategy identity when retrieval affects the result.

## Closing the tutorial

- Return to the gap between using agents and understanding the machinery underneath.
- Explain what owning the loop, context, tools, and evaluation changes about that understanding.
- Keep future directions focused on agent components.

## References

Repository links are pinned to commit `e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695`.
The references preserve research provenance; they are not a list of implemented capabilities.
### External sources

- [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents): workflows, model-directed agents, and the role of frameworks.
- [Vercel AI SDK — Tool calling](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling): tool definitions, calls, results, and multi-step generation.

The original outline also names Microsoft RAG preprocessing guidance and the Unicode normalization FAQ.
Those sources were not opened during this review, and their exact citations remain to be resolved before drafting.
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
