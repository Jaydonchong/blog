import WorkflowTransformation from '../WorkflowTransformation/WorkflowTransformation.jsx'

export default function WorkflowMarker({ children }) {
  const match = /^The workflow changes · Phase (\d+)$/.exec(String(children))
  if (!match) return <h4>{children}</h4>
  return <WorkflowTransformation phase={Number(match[1])} />
}
