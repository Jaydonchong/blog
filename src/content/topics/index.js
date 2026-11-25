import buildingMyOwnHarness from './building-my-own-harness/topic.js'
import contextSystem from './context-system/topic.js'
import evolutionOfMyCodingWorkflow from './evolution-of-my-coding-workflow/topic.js'
import introductionToAgenticWorkflows from './introduction-to-agentic-workflows/topic.js'

export const TOPICS = [
  introductionToAgenticWorkflows,
  evolutionOfMyCodingWorkflow,
  contextSystem,
  buildingMyOwnHarness,
]

export const SLIDE_TOPICS = TOPICS.filter((topic) => topic.kind === 'slides')
export const ARTICLE_TOPICS = TOPICS.filter((topic) => topic.kind === 'article')
