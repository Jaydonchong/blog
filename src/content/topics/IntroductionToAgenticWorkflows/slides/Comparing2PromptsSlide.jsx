function Comparing2PromptsSlide() {
  return (
    <>
      <ul className="bullets">
        <li><span>Avoid: vague adjectives · "don't do X" · politeness padding</span></li>
      </ul>
      <div className="compare">
        <div className="compare__col">
          <div className="compare__label">Before</div>
          <div className="compare__slot">[bad prompt]</div>
          <div className="compare__slot">[what came back]</div>
        </div>
        <div className="compare__col">
          <div className="compare__label">After</div>
          <div className="compare__slot">[stacked prompt]</div>
          <div className="compare__slot">[what came back]</div>
        </div>
      </div>
      <p className="pull">The only thing that changed is the brief.</p>
    </>
  )
}

Comparing2PromptsSlide.meta = {
  title: 'Comparing 2 prompts',
  section: 'prompt',
  sectionLabel: 'Prompt Engineering',
  notes: 'This replaced the live demo. Static costs the drama, buys reliability and exact timing. Screenshot a real pair, leave timestamps visible. RISK: if the "before" output needs domain knowledge to judge as bad, the slide fails silently.',
}

export default Comparing2PromptsSlide
