function MultiAgentChallengesSlide() {
    return (
        <div>
            <ul className="bullets">
                <li><span><span className="term">Infinite retries</span> — a failed step re-runs forever without a budget cap</span></li>
                <li><span><span className="term">Cost scalability</span> — token spend multiplies with every parallel agent</span></li>
                <li><span><span className="term">Cascading hallucination</span> — one bad output poisons every downstream agent</span></li>
                <li><span><span className="term">Coordination</span> — shared state and handoff boundaries are hard to get right</span></li>
            </ul>
        </div>
    );
}

MultiAgentChallengesSlide.meta = {
    title: "Multiagent Challenges",
    subtitle: "Challenges faced in distributed systems",
    section: "multiagent",
    sectionLabel: "Multi-agent",
    notes: "Each challenge maps to a mitigation: retry budgets, per-agent token limits, verification gates between agents, explicit handoff contracts. None of these are solved problems — they are design constraints.",
};

export default MultiAgentChallengesSlide;
