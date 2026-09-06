function Comparing2PromptsSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span>Avoid: vague adjectives · "don't do X" · politeness padding</span></li>
      </ul>
      <div className="compare">
        <div className="compare__col">
          <div className="compare__label">Before</div>
          <div className="compare__slot">"Write me a one paragraph sales pitch for my bakery"</div>
          <div className="compare__slot">
            "Step into our bakery each morning... freshly baked artisan bread... quality bread shouldn't be a luxury, it's an everyday staple... you'll never settle for ordinary again."
          </div>
        </div>
        <div className="compare__col">
          <div className="compare__label">After</div>
          <div className="compare__slot">
            <div>Sourdough bakery, Japanese technique → softer texture.</div>
            <div>Goal: 1-paragraph pitch — premium quality, everyday ingredients.</div>
            <div>Scope: convincing, not overselling. No unverified claims.</div>
            <div>Steps: check 3 nearby bakeries' marketing first.</div>
            <div>Output: copy + menu (item — price).</div>
          </div>
          <div className="compare__slot">
            <div>"Great sourdough doesn't require exotic ingredients — it requires proper technique... a softer crumb, more delicate texture... genuinely better, without shortcuts or preservatives."</div>
            <div>Ube Sourdough — RM 15 · Matcha Sourdough — RM 10</div>
          </div>
        </div>
      </div>
      <p className="pull">The only thing that changed is the brief.</p>
    </div>
  )
}

Comparing2PromptsSlide.meta = {
  title: 'Comparing 2 prompts',
  section: 'prompt',
  sectionLabel: 'Prompt Engineering',
  notes: 'This replaced the live demo. Static costs the drama, buys reliability and exact timing. Screenshot a real pair, leave timestamps visible. RISK: if the "before" output needs domain knowledge to judge as bad, the slide fails silently.',
}

export default Comparing2PromptsSlide
