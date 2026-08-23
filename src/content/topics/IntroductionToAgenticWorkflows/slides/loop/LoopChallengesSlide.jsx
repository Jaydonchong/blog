/* Three challenges, three figures. Each SVG is 300x150 on a 300x150 viewBox, so
   k = 1: 14 primary, 11 secondary, 1.5 stroke. Rose marks the failure. */

const LINE = "#c6c3ba";
const VIOLET = "#6b5bf5";
const ROSE = "var(--rose)";
const INK = "#1b1e26";

const LABEL = { fontFamily: "var(--mono)", fontSize: 14, fill: INK };
const NOTE = { fontFamily: "var(--mono)", fontSize: 11, fill: "var(--muted)" };

function Cross({ x, y }) {
    return (
        <g>
            <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} stroke={ROSE} strokeWidth="1.5" />
            <line x1={x + 5} y1={y - 5} x2={x - 5} y2={y + 5} stroke={ROSE} strokeWidth="1.5" />
        </g>
    );
}

const TURNS = ["turn 1", "turn 2", "turn 47"];
const RUNS = ["run 1", "run 2", "run 3"];

/* one task on a timeline: short bursts of agent work, long stalls on a human */
const SPANS = [
    { x: 0, w: 34, agent: true },
    { x: 34, w: 67 },
    { x: 101, w: 34, agent: true },
    { x: 135, w: 67 },
    { x: 202, w: 34, agent: true },
    { x: 236, w: 64 },
];

function LoopChallengesSlide() {
    return (
        <div className="diag-above">
            <div className="diag-gallery diag-gallery--3">
                {/* Infinite retries — the loop spins, nothing counts */}
                <div className="diag-card diag-card--tight">
                    <div className="diag-card__head">Infinite retries</div>
                    <svg className="diag-svg" width="300" height="150" viewBox="0 0 300 150">
                        <rect x="80" y="20" width="140" height="36" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
                        <text x="150" y="43" textAnchor="middle" style={LABEL}>fix the build</text>

                        {/* round and round */}
                        <path
                            d="M80 38 Q 36 38 36 14 Q 36 4 150 4 Q 264 4 264 14 Q 264 38 230 38"
                            fill="none" stroke={VIOLET} strokeWidth="1.5"
                        />
                        <polygon points="220,38 230,33 230,43" fill={VIOLET} />
                        <text x="150" y="17" textAnchor="middle" style={NOTE}>no counter, no cap</text>

                        {TURNS.map((turn, i) => {
                            const y = 78 + i * 26
                            return (
                                <g key={turn}>
                                    <text x="60" y={y + 5} textAnchor="end" style={LABEL}>{turn}</text>
                                    <Cross x={88} y={y} />
                                    <text x={106} y={y + 5} style={NOTE}>same failure</text>
                                </g>
                            )
                        })}
                    </svg>
                    <p className="diag-card__cap">A failed step re-runs until something stops it.</p>
                </div>

                {/* Recurring mistakes — nothing survives the run that learned it */}
                <div className="diag-card diag-card--tight">
                    <div className="diag-card__head">Recurring mistakes</div>
                    <svg className="diag-svg" width="300" height="150" viewBox="0 0 300 150">
                        {RUNS.map((run, i) => {
                            const y = 14 + i * 26
                            return (
                                <g key={run}>
                                    <text x="0" y={y + 5} style={LABEL}>{run}</text>
                                    <text x="52" y={y + 5} style={NOTE}>same wrong turn</text>
                                    <Cross x={166} y={y} />
                                </g>
                            )
                        })}

                        {/* the write that never happens */}
                        <line x1="150" y1="76" x2="150" y2="104" stroke={LINE} strokeWidth="1.5" strokeDasharray="4,3" />
                        <circle cx="150" cy="90" r="10" fill="#fff" />
                        <Cross x={150} y={90} />

                        <rect x="60" y="106" width="180" height="40" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" strokeDasharray="4,3" />
                        <text x="150" y="126" textAnchor="middle" style={LABEL}>MEMORY.md</text>
                        <text x="150" y="141" textAnchor="middle" style={NOTE}>never written</text>
                    </svg>
                    <p className="diag-card__cap">The same error every run, because nothing wrote it down.</p>
                </div>

                {/* Human as the bottleneck — the agent waits more than it works */}
                <div className="diag-card diag-card--tight">
                    <div className="diag-card__head">Human as the bottleneck</div>
                    <svg className="diag-svg" width="300" height="150" viewBox="0 0 300 150">
                        <text x="0" y="22" style={NOTE}>one task, start to done</text>

                        {SPANS.map((span) => (
                            <rect
                                key={span.x}
                                x={span.x} y="44" width={span.w} height="28" rx="4"
                                fill={span.agent ? VIOLET : "#fff"}
                                stroke={span.agent ? VIOLET : LINE}
                                strokeWidth="1.5"
                                strokeDasharray={span.agent ? undefined : "4,3"}
                            />
                        ))}

                        <rect x="0" y="94" width="18" height="12" rx="2" fill={VIOLET} stroke={VIOLET} strokeWidth="1.5" />
                        <text x="26" y="104" style={NOTE}>agent works</text>

                        <rect x="0" y="120" width="18" height="12" rx="2" fill="#fff" stroke={LINE} strokeWidth="1.5" strokeDasharray="4,3" />
                        <text x="26" y="130" style={{ ...NOTE, fill: ROSE }}>waiting on you</text>
                    </svg>
                    <p className="diag-card__cap">Every step needs an approval, so the run moves at human speed.</p>
                </div>
            </div>

            <div>
                <code>/loop</code>, <code>/goal</code>{" "}
            </div>
        </div>
    );
}

LoopChallengesSlide.meta = {
    title: "Challenges for agent autonomy",
    section: "loop",
    sectionLabel: "Loop Engineering",
    notes: "Retrying a non-deterministic operation is not retrying an HTTP call — idempotency has to be designed in. Partial work on timeout is the case people forget. Recurring mistakes are the memory layer's bill coming due: a loop with no way to write down what it learned repeats the same wrong turn every run, and the fix is a file, not a better prompt. Human as the bottleneck is the autonomy ceiling: too much human intervention required, so the agent runs at your speed and the throughput win disappears — the fix is choosing which decisions actually need a gate, not deleting the gates. The heartbeat mechanism deserves its own diagram in the article.",
};

export default LoopChallengesSlide;
