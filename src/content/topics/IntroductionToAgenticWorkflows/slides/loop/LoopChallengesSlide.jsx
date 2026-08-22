function LoopChallengesSlide() {
    return (
        <div>
            <div>
                <code>/loop</code>, <code>/goal</code>{" "}
            </div>
            <ul className="bullets">
                <li>
                    <span>
                        <span className="term">Infinite retries</span> — a
                        failed step re-runs until something stops it
                    </span>
                </li>
                <li>
                    <span>
                        <span className="term">Recurring mistakes</span> — the
                        same error every run, because nothing wrote it down
                    </span>
                </li>
            </ul>
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
