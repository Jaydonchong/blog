function LoopChallengesSlide() {
    return (
        <div>
            <div>
                <code>/loop</code>, <code>/goal</code>{" "}
            </div>
            <ul className="bullets">
                <li>
                    <span>Cost scaling</span>
                </li>
                <li>
                    <span>Infinite retries</span>
                </li>
                <li>
                    <span>Example: PR Reviewer, Email summarizer</span>
                </li>
            </ul>
        </div>
    );
}

LoopChallengesSlide.meta = {
    title: "Pitfalls of loop",
    section: "loop",
    sectionLabel: "Loop Engineering",
    notes: "Retrying a non-deterministic operation is not retrying an HTTP call — idempotency has to be designed in. Partial work on timeout is the case people forget. The heartbeat mechanism deserves its own diagram in the article.",
};

export default LoopChallengesSlide;
