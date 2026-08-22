function ToolsProcessAsAFunctionSlide() {
  return (
    <ul className="bullets">
      <li><span>A tool is a function you describe to the model</span></li>
      <li><span className="strong">It doesn't run it — it asks you to run it</span></li>
      <li><span>Give it a terminal and every CLI becomes a tool</span></li>
    </ul>
  )
}

ToolsProcessAsAFunctionSlide.meta = {
  title: 'Tools Process as a function',
  section: 'tools',
  sectionLabel: 'Tool, MCP',
  notes: 'Message sequence for Q&A: model emits tool_use, your code executes, you return tool_result, model continues. Terminal-as-a-tool is enormous leverage and an obvious blast radius; mitigation is allowlisting.',
}

export default ToolsProcessAsAFunctionSlide
