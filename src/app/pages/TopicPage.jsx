import { useCallback } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import MarkdownArticles from '@shared/components/MarkdownArticles/MarkdownArticles.jsx'
import SlideDeck from '@shared/components/SlideDeck/SlideDeck.jsx'
import { TOPICS } from '../../content/topics/index.js'

export default function TopicPage() {
  const { topicId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const topic = TOPICS.find(({ meta }) => meta.slug === topicId)

  if (!topic) return <Navigate to="/" replace />

  if (topic.kind === 'article') {
    return (
      <MarkdownArticles
        key={topic.meta.slug}
        source={topic.source}
        components={topic.components}
        diagrams={topic.diagrams}
      />
    )
  }

  return (
    <TopicSlideDeck
      key={topic.meta.slug}
      topic={topic}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
    />
  )
}

function TopicSlideDeck({ topic, searchParams, setSearchParams }) {
  const requested = Number.parseInt(searchParams.get('slide'), 10) || 1
  const current = Math.min(Math.max(requested, 1), topic.slides.length)

  const selectSlide = useCallback((target) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('slide', String(target))
      return next
    }, { replace: true })
  }, [setSearchParams])

  if (topic.slides.length === 0) return <Navigate to="/" replace />

  return (
    <SlideDeck
      slides={topic.slides}
      sections={topic.sections}
      current={current}
      onSelect={selectSlide}
    />
  )
}
