import agenticLoopSvg from '../../assets/agentic-loop.svg?raw'
import contextAssemblerSvg from '../../assets/context-assembler.svg?raw'
import conversationStateSvg from '../../assets/conversation-state-and-lifecycle.svg?raw'
import providerContractSvg from '../../assets/provider-contract.svg?raw'
import toolInvocationSvg from '../../assets/tool-invocation.svg?raw'
import SvgDiagram from '@shared/components/SvgDiagram/SvgDiagram.jsx'

const diagrams = {
  'provider-contract': { source: providerContractSvg, label: 'Provider contract' },
  'tool-invocation': { source: toolInvocationSvg, label: 'Tool invocation' },
  'happy-path-agent-loop': { source: agenticLoopSvg, label: 'Agentic loop', size: 'small' },
  'session-ownership': { source: conversationStateSvg, label: 'Conversation state and lifecycle' },
  'context-assembler': {
    source: contextAssemblerSvg,
    label: 'Context assembler',
    size: 'medium',
  },
}

export default function ArticleSvgDiagrams({ id }) {
  const diagram = diagrams[id]
  return diagram ? <SvgDiagram {...diagram} /> : null
}
