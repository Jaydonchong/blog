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
  ...TOPIC_ARTICLES.map((article) => ({
    ...article,
    description: article.summary,
  })),
]
