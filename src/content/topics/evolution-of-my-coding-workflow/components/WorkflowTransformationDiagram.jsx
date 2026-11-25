import WorkflowTransformation from './WorkflowTransformation/WorkflowTransformation.jsx'

export default function WorkflowTransformationDiagram({ id }) {
  const match = /^workflow-phase-(\d+)$/.exec(id)
  if (!match) return null
  return <WorkflowTransformation phase={Number(match[1])} />
}
