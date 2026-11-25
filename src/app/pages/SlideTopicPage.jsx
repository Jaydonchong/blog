import { useCallback } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SlideDeck from '@shared/components/SlideDeck/SlideDeck.jsx'
import { SLIDE_TOPICS } from '../../content/topics/index.js'

export default function SlideTopicPage() {
  const { slug, n } = useParams()
  const navigate = useNavigate()
  const topic = SLIDE_TOPICS.find((item) => item.meta.slug === slug)

  const selectSlide = useCallback((target) => {
    navigate(`/slides/${slug}/${target}`, { replace: true })
  }, [navigate, slug])

  if (!topic || topic.slides.length === 0) return <Navigate to="/slides" replace />

  const current = Math.min(Math.max(parseInt(n, 10) || 1, 1), topic.slides.length)

  return (
    <SlideDeck
      slides={topic.slides}
      sections={topic.sections}
      current={current}
      onSelect={selectSlide}
    />
  )
}
