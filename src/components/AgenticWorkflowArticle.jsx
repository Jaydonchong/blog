import MarkdownArticles from '../shared/components/MarkdownArticles.jsx'
import WorkflowTransformation from './WorkflowTransformation.jsx'
import source from '../../content/articles/evolution-of-my-coding-workflow.md?raw'
import './agentic-workflow-article.css'

const ARTICLE_SLUG = 'evolution-of-my-coding-workflow'

function WorkflowMarker({ children }) {
  const match = /^The workflow changes · Phase (\d+)$/.exec(String(children))
  if (!match) return <h4>{children}</h4>
  return <WorkflowTransformation phase={Number(match[1])} />
}

export default function AgenticWorkflowArticle() {
  return (
    <MarkdownArticles
      source={source}
      articleSlug={ARTICLE_SLUG}
      components={{ h4: WorkflowMarker }}
    />
  )
}
