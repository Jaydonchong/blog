import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SlideDeck from '@shared/components/SlideDeck.jsx'
import { SECTIONS, SLIDES } from './AgentsAndHowToUseThemSlides.jsx'

function AgentsAndHowToUseThemDeck() {
  const { n } = useParams()
  const navigate = useNavigate()

  const slug = AgentsAndHowToUseThemDeck.meta.slug
  const current = Math.min(Math.max(parseInt(n, 10) || 1, 1), SLIDES.length)
  const selectSlide = useCallback((target) => {
    navigate(`/slides/${slug}/${target}`, { replace: true })
  }, [navigate, slug])

  return (
    <SlideDeck
      slides={SLIDES}
      sections={SECTIONS}
      current={current}
      onSelect={selectSlide}
    />
  )
}

AgentsAndHowToUseThemDeck.meta = {
  title: 'Introduction to Agentic Workflows',
  slug: 'introduction-to-agentic-workflows',
  description: 'From the chat box to the unattended loop — six layers that turn a prompt into an autonomous agent.',
}

export default AgentsAndHowToUseThemDeck
