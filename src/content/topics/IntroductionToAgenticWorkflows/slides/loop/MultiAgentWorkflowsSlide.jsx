function MultiAgentWorkflowsSlide() {
    return (
        <div>
            <ul className="bullets">
                <li>
                    <span>
                        <span className="term">Swarming</span> — agents hand
                        work off to each other
                    </span>
                </li>
                <li>
                    <span>
                        <span className="term">Orchestrating</span> — one
                        coordinator delegates and collects
                    </span>
                </li>
                <li>
                    <span>
                        <span className="term">Pipeline</span> — Sequentiaal
                    </span>
                </li>
                <li>
                    <span>
                        The trade: less context per agent, more coordination
                    </span>
                </li>
            </ul>
        </div>
    );
}

MultiAgentWorkflowsSlide.meta = {
    title: "Multi-agent workflows",
    section: "loop",
    sectionLabel: "Loop Engineering",
    notes: "Same isolation-vs-coherence tension as subagents, now at system scale. Swarming suits pipelines with clean handoff boundaries; orchestration suits work where a global view is needed to decide what happens next.",
};

export default MultiAgentWorkflowsSlide;
