import HowToUseAndLearnAiSlide from './slides/HowToUseAndLearnAiSlide.jsx'
import GoalsOfThisLectureSlide from './slides/GoalsOfThisLectureSlide.jsx'
import WhatWellCoverSlide from './slides/WhatWellCoverSlide.jsx'
import AiAsAToolNotASolutionSlide from './slides/AiAsAToolNotASolutionSlide.jsx'
import WhatIsAiSlide from './slides/WhatIsAiSlide.jsx'
import UsingLlmsSlide from './slides/UsingLlmsSlide.jsx'
import AiProcessTerminologiesSlide from './slides/AiProcessTerminologiesSlide.jsx'
import AiModelSpecificationTerminologiesSlide from './slides/AiModelSpecificationTerminologiesSlide.jsx'
import WhatIsAPromptSlide from './slides/WhatIsAPromptSlide.jsx'
import GoodPromptLeadsToBetterOutputSlide from './slides/GoodPromptLeadsToBetterOutputSlide.jsx'
import PromptFrameworkSlide from './slides/PromptFrameworkSlide.jsx'
import SystemPromptsSlide from './slides/SystemPromptsSlide.jsx'
import Comparing2PromptsSlide from './slides/Comparing2PromptsSlide.jsx'
import PromptEngineeringTechniquesSlide from './slides/PromptEngineeringTechniquesSlide.jsx'
import ContextSlide from './slides/ContextSlide.jsx'
import TheContextWindowAndTokenBloatSlide from './slides/TheContextWindowAndTokenBloatSlide.jsx'
import MemoryLayerPersistenceSlide from './slides/MemoryLayerPersistenceSlide.jsx'
import RagSlide from './slides/RagSlide.jsx'
import ContextManagementTechniquesSlide from './slides/ContextManagementTechniquesSlide.jsx'
import ToolsProcessAsAFunctionSlide from './slides/ToolsProcessAsAFunctionSlide.jsx'
import McpModelContextProtocolSlide from './slides/McpModelContextProtocolSlide.jsx'
import AgentSkillsSlide from './slides/AgentSkillsSlide.jsx'
import WhatIsAHarnessSlide from './slides/WhatIsAHarnessSlide.jsx'
import HooksSlide from './slides/HooksSlide.jsx'
import ObservabilityAndEvalsSlide from './slides/ObservabilityAndEvalsSlide.jsx'
import TheAgenticLoopSlide from './slides/TheAgenticLoopSlide.jsx'
import DesigningAWorkflowSlide from './slides/DesigningAWorkflowSlide.jsx'
import MultiAgentWorkflowsSlide from './slides/MultiAgentWorkflowsSlide.jsx'
import LoopChallengesSlide from './slides/LoopChallengesSlide.jsx'
import PuttingItTogetherSlide from './slides/PuttingItTogetherSlide.jsx'

export const SECTIONS = [
  { id: 'intro',   label: 'Introduction',        short: 'Intro',   minor: true },
  { id: 'llm',     label: 'What is an LLM',       short: 'LLM' },
  { id: 'prompt',  label: 'Prompt Engineering',   short: 'Prompt' },
  { id: 'context', label: 'Context Engineering',  short: 'Context' },
  { id: 'tools',   label: 'Tool, MCP',            short: 'Tools' },
  { id: 'harness', label: 'Harness Engineering',  short: 'Harness' },
  { id: 'loop',    label: 'Loop Engineering',     short: 'Loop' },
  { id: 'close',   label: 'Close',               short: 'Close',  minor: true },
]

export const SLIDES = [
  HowToUseAndLearnAiSlide,
  GoalsOfThisLectureSlide,
  WhatWellCoverSlide,
  AiAsAToolNotASolutionSlide,
  WhatIsAiSlide,
  UsingLlmsSlide,
  AiProcessTerminologiesSlide,
  AiModelSpecificationTerminologiesSlide,
  WhatIsAPromptSlide,
  GoodPromptLeadsToBetterOutputSlide,
  PromptFrameworkSlide,
  SystemPromptsSlide,
  Comparing2PromptsSlide,
  PromptEngineeringTechniquesSlide,
  ContextSlide,
  TheContextWindowAndTokenBloatSlide,
  MemoryLayerPersistenceSlide,
  RagSlide,
  ContextManagementTechniquesSlide,
  ToolsProcessAsAFunctionSlide,
  McpModelContextProtocolSlide,
  AgentSkillsSlide,
  WhatIsAHarnessSlide,
  HooksSlide,
  ObservabilityAndEvalsSlide,
  TheAgenticLoopSlide,
  DesigningAWorkflowSlide,
  MultiAgentWorkflowsSlide,
  LoopChallengesSlide,
  PuttingItTogetherSlide,
]
