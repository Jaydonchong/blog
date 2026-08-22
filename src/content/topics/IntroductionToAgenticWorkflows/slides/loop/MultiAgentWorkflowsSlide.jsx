function MultiAgentWorkflowsSlide() {
    return (
        <div>
            <ul className="bullets">
                <li>
                    <span>
                        <span className="term">Pipeline</span> — sequential
                    </span>
                </li>
                <li>
                    <span>
                        <span className="term">Swarming</span> — agents hand
                        work off to each other
                    </span>
                </li>
                <li>
                    <span>
                        <span className="term">Orchestration</span> — one
                        coordinator delegates and maintains the flow
                    </span>
                </li>
                <li>
                    <span>
                        <span className="term">Supervisor</span> — one
                        coordinator delegates and collects
                    </span>
                </li>
                <li>
                    <span>
                        <span className="term">Router + Synthesizer</span> — Fan out
                    </span>
                </li>
                <li>
                    <span>
                        The tradeoff: Context Management vs Efficiency
                    </span>
                </li>
            </ul>
        </div>
    );
}

MultiAgentWorkflowsSlide.meta = {
    title: "Multiagent Patterns",
    section: "multiagent",
    sectionLabel: "Multi-agent",
    notes: "Same isolation-vs-coherence tension as subagents, now at system scale. Swarming suits pipelines with clean handoff boundaries; orchestration suits work where a global view is needed to decide what happens next.",
};

export default MultiAgentWorkflowsSlide;
