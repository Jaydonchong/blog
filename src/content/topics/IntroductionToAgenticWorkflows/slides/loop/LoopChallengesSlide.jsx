/* Two pitfalls, two figures. Each SVG is 500x120 on a 500x120 viewBox, so
   k = 1: 16/14 primary, 11 secondary, 1.5 stroke. Rose marks the failure. */

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

function LoopChallengesSlide() {
    return (
        <div className="diag-above">
            <div
                className="diag-gallery diag-gallery--2"
                style={{ gridAutoRows: "auto", alignContent: "center" }}
            >
                {/* Infinite retries — the loop spins, nothing counts */}
                <div className="diag-card diag-card--tight">
                    <div className="diag-card__head">Infinite retries</div>
                    <svg className="diag-svg" width="500" height="120" viewBox="0 0 500 120">
                        <rect x="52" y="42" width="140" height="40" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
                        <text x="122" y="67" textAnchor="middle" style={LABEL}>fix the build</text>

                        {/* round and round */}
                        <path
                            d="M52 62 Q 12 62 12 26 Q 12 8 122 8 Q 232 8 232 26 Q 232 62 200 62"
                            fill="none" stroke={VIOLET} strokeWidth="1.5"
                        />
                        <polygon points="192,62 202,57 202,67" fill={VIOLET} />
                        <text x="122" y="26" textAnchor="middle" style={NOTE}>no counter, no cap</text>

                        {TURNS.map((turn, i) => {
                            const y = 34 + i * 28
                            return (
                                <g key={turn}>
                                    <text x="300" y={y + 5} textAnchor="end" style={LABEL}>{turn}</text>
                                    <Cross x={330} y={y} />
                                    <text x={350} y={y + 5} style={NOTE}>same failure</text>
                                </g>
                            )
                        })}
                    </svg>
                    <p className="diag-card__cap">A failed step re-runs until something stops it.</p>
                </div>

                {/* Recurring mistakes — nothing survives the run that learned it */}
                <div className="diag-card diag-card--tight">
                    <div className="diag-card__head">Recurring mistakes</div>
                    <svg className="diag-svg" width="500" height="120" viewBox="0 0 500 120">
                        {RUNS.map((run, i) => {
                            const y = 26 + i * 34
                            return (
                                <g key={run}>
                                    <text x="0" y={y + 5} style={LABEL}>{run}</text>
                                    <text x="66" y={y + 5} style={NOTE}>same wrong turn</text>
                                    <Cross x={186} y={y} />
                                </g>
                            )
                        })}

                        {/* the write that never happens */}
                        <line x1="206" y1="60" x2="266" y2="60" stroke={LINE} strokeWidth="1.5" strokeDasharray="4,3" />
                        <circle cx="236" cy="60" r="10" fill="#fff" />
                        <Cross x={236} y={60} />

                        <rect x="286" y="28" width="200" height="64" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" strokeDasharray="4,3" />
                        <text x="386" y="58" textAnchor="middle" style={LABEL}>MEMORY.md</text>
                        <text x="386" y="78" textAnchor="middle" style={NOTE}>never written</text>
                    </svg>
                    <p className="diag-card__cap">The same error every run, because nothing wrote it down.</p>
                </div>
            </div>

            <div>
                <code>/loop</code>, <code>/goal</code>{" "}
            </div>
        </div>
    );
}

LoopChallengesSlide.meta = {
    title: "Pitfalls of loop",
    section: "loop",
    sectionLabel: "Loop Engineering",
    notes: "Retrying a non-deterministic operation is not retrying an HTTP call — idempotency has to be designed in. Partial work on timeout is the case people forget. Recurring mistakes are the memory layer's bill coming due: a loop with no way to write down what it learned repeats the same wrong turn every run, and the fix is a file, not a better prompt. The heartbeat mechanism deserves its own diagram in the article.",
};

export default LoopChallengesSlide;
