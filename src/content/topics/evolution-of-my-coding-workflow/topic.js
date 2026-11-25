import source from './article.md?raw'
import WorkflowMarker from './components/WorkflowMarker/WorkflowMarker.jsx'

export default {
  kind: 'article',
  meta: {
    slug: 'evolution-of-my-coding-workflow',
    title: 'An evolution of my coding workflow',
    description: 'How my agentic workflow grew from one-shot prompts into a process that can guide, check, and improve its own work.',
  },
  source,
  components: { h4: WorkflowMarker },
}
