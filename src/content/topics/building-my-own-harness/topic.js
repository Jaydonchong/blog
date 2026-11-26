import { lazy } from 'react'
import source from './article.md?raw'
import HarnessDiagram from './components/HarnessDiagram/HarnessDiagram.jsx'
import observabilityMetricImage from './assets/observability-metric.png'
import observabilityTraceImage from './assets/observability-trace.png'

const ArticleSvgDiagrams = lazy(() => import('./components/ArticleSvgDiagrams/ArticleSvgDiagrams.jsx'))

export default {
  kind: 'article',
  meta: {
    slug: 'building-my-own-harness',
    title: 'Building my own agent',
    description: 'An architecture walkthrough of the components behind my personal agent harness, from model requests and tools to context, memory, and evaluation.',
  },
  source,
  diagrams: {
    svgIds: [
      'provider-contract',
      'tool-invocation',
      'happy-path-agent-loop',
      'session-ownership',
      'context-assembler',
    ],
    SvgDiagram: ArticleSvgDiagrams,
    fallback: HarnessDiagram,
    images: {
      'observability-trace': {
        source: observabilityTraceImage,
        alt: 'Tempo trace detail showing spans for a harness agent turn and tool call.',
      },
      'observability-metric': {
        source: observabilityMetricImage,
        alt: 'Grafana time series for the agent session turn duration metric.',
      },
    },
  },
}
