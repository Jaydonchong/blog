import HowToUseAndLearnAiSlide from './slides/intro/HowToUseAndLearnAiSlide.jsx'
import GoalsOfThisLectureSlide from './slides/intro/GoalsOfThisLectureSlide.jsx'
import WhatWellCoverSlide from './slides/intro/WhatWellCoverSlide.jsx'
import WhatIsGenAiSlide from './slides/llm/WhatIsGenAiSlide.jsx'
import AiAsAToolNotASolutionSlide from './slides/llm/AiAsAToolNotASolutionSlide.jsx'
import UsingLlmsSlide from './slides/llm/UsingLlmsSlide.jsx'
import AiProcessTerminologiesSlide from './slides/llm/AiProcessTerminologiesSlide.jsx'
import AiModelSpecificationTerminologiesSlide from './slides/llm/AiModelSpecificationTerminologiesSlide.jsx'
import WhatIsAPromptSlide from './slides/prompt/WhatIsAPromptSlide.jsx'
import GoodPromptLeadsToBetterOutputSlide from './slides/prompt/GoodPromptLeadsToBetterOutputSlide.jsx'
import PromptFrameworkSlide from './slides/prompt/PromptFrameworkSlide.jsx'
import SystemPromptsSlide from './slides/prompt/SystemPromptsSlide.jsx'
import Comparing2PromptsSlide from './slides/prompt/Comparing2PromptsSlide.jsx'
import PromptEngineeringTechniquesSlide from './slides/prompt/PromptEngineeringTechniquesSlide.jsx'
import ContextSlide from './slides/context/ContextSlide.jsx'
import TheContextWindowAndTokenBloatSlide from './slides/context/TheContextWindowAndTokenBloatSlide.jsx'
import WhatIsContextSlide from './slides/context/WhatIsContextSlide.jsx'
import WhatIsGoodContextSlide from './slides/context/WhatIsGoodContextSlide.jsx'
import MemoryLayerPersistenceSlide from './slides/context/MemoryLayerPersistenceSlide.jsx'
import RagSlide from './slides/context/RagSlide.jsx'
import ContextManagementTechniquesSlide from './slides/context/ContextManagementTechniquesSlide.jsx'
import ToolsProcessAsAFunctionSlide from './slides/tools/ToolsProcessAsAFunctionSlide.jsx'
import McpModelContextProtocolSlide from './slides/tools/McpModelContextProtocolSlide.jsx'
import ToolCallVsMcpVsApiSlide from './slides/tools/ToolCallVsMcpVsApiSlide.jsx'
import AgentSkillsSlide from './slides/tools/AgentSkillsSlide.jsx'
import WhatIsAHarnessSlide from './slides/harness/WhatIsAHarnessSlide.jsx'
import HooksSlide from './slides/harness/HooksSlide.jsx'
import PullingItAllTogetherSlide from './slides/harness/PullingItAllTogetherSlide.jsx'
import ObservabilitySlide from './slides/loop/ObservabilitySlide.jsx'
import EvalsSlide from './slides/loop/EvalsSlide.jsx'
import TheAgenticLoopSlide from './slides/loop/TheAgenticLoopSlide.jsx'
import ImproveYourLoopSlide from './slides/loop/ImproveYourLoopSlide.jsx'
import FeedbackLoopSlide from './slides/loop/FeedbackLoopSlide.jsx'
import AchievingAutonomySlide from './slides/loop/AchievingAutonomySlide.jsx'
import DesigningAWorkflowSlide from './slides/loop/DesigningAWorkflowSlide.jsx'
import LoopChallengesSlide from './slides/loop/LoopChallengesSlide.jsx'
import MultiAgentWorkflowsSlide from './slides/loop/MultiAgentWorkflowsSlide.jsx'
import MultiAgentChallengesSlide from './slides/loop/MultiAgentChallengesSlide.jsx'
import PuttingItTogetherSlide from './slides/close/PuttingItTogetherSlide.jsx'

export const SECTIONS = [
  { id: 'intro',      label: 'Introduction',       short: 'Intro',   minor: true },
  { id: 'llm',        label: 'What is an LLM',      short: 'LLM' },
  { id: 'prompt',     label: 'Prompt Engineering',  short: 'Prompt' },
  { id: 'context',    label: 'Context Engineering', short: 'Context' },
  { id: 'tools',      label: 'Tool, MCP',           short: 'Tools' },
  { id: 'harness',    label: 'Harness Engineering', short: 'Harness' },
  { id: 'loop',       label: 'Loop Engineering',    short: 'Loop' },
  { id: 'multiagent', label: 'Multi-agent',         short: 'Multi' },
  { id: 'close',      label: 'Close',               short: 'Close',  minor: true },
]

export const SLIDES = [
  HowToUseAndLearnAiSlide,
  GoalsOfThisLectureSlide,
  WhatWellCoverSlide,
  WhatIsGenAiSlide,
  AiModelSpecificationTerminologiesSlide,
  AiProcessTerminologiesSlide,
  AiAsAToolNotASolutionSlide,
  UsingLlmsSlide,
  WhatIsAPromptSlide,
  GoodPromptLeadsToBetterOutputSlide,
  PromptFrameworkSlide,
  SystemPromptsSlide,
  Comparing2PromptsSlide,
  PromptEngineeringTechniquesSlide,
  ContextSlide,
  TheContextWindowAndTokenBloatSlide,
  WhatIsContextSlide,
  WhatIsGoodContextSlide,
  MemoryLayerPersistenceSlide,
  RagSlide,
  ContextManagementTechniquesSlide,
  ToolsProcessAsAFunctionSlide,
  McpModelContextProtocolSlide,
  ToolCallVsMcpVsApiSlide,
  AgentSkillsSlide,
  WhatIsAHarnessSlide,
  HooksSlide,
  PullingItAllTogetherSlide,
  TheAgenticLoopSlide,
  ImproveYourLoopSlide,
  LoopChallengesSlide,
  FeedbackLoopSlide,
  ObservabilitySlide,
  EvalsSlide,
  AchievingAutonomySlide,
  DesigningAWorkflowSlide,
  MultiAgentWorkflowsSlide,
  MultiAgentChallengesSlide,
  PuttingItTogetherSlide,
]
