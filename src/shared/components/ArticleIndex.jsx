import { ARTICLES as TOPIC_ARTICLES } from '../../content/topics/index.js'

export const ARTICLES = [
  {
    slug: 'evolution-of-my-coding-workflow',
    title: 'An evolution of my coding workflow',
    description: 'How my agentic workflow grew from one-shot prompts into a process that can guide, check, and improve its own work.',
  },
  {
    slug: 'context-system',
    title: 'System context for my context system',
    description: 'How my context management grew from a single paragraph into a full-fledged system.',
  },
  {
    slug: 'building-my-own-harness',
    title: 'Building my own agent harness',
    description: 'An architecture walkthrough of the components behind my personal agent harness, from model requests and tools to context, memory, and evaluation.',
  },
  ...TOPIC_ARTICLES.map((article) => ({
    ...article,
    description: article.summary,
  })),
]
