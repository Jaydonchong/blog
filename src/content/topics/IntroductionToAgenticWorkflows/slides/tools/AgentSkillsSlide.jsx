function AgentSkillsSlide() {
  return (
    <ul className="bullets">
      <li><span>Loaded only when relevant — the YAML frontmatter decides</span></li>
      <li><span>Project skills ship with the repo, user skills follow you</span></li>
      <li><span>Build by interview, by documentation, or by walkthrough</span></li>
    </ul>
  )
}

AgentSkillsSlide.meta = {
  title: 'Agent Skills',
  section: 'tools',
  sectionLabel: 'Tool, MCP',
  notes: 'Show one real frontmatter for five seconds. Bad scoping failure mode: a user skill that assumes a repo layout, or a project skill full of personal preference. PAUSE POINT.',
}

export default AgentSkillsSlide
