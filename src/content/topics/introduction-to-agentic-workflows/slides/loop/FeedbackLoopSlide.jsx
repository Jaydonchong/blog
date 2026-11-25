/* The loop from "Improve your loop", with one step added: LEARN, between
   VERIFY and DONE — and the arc back to THINK now leaves from LEARN, not
   VERIFY. Five boxes on the same 580 run, so each is 78 wide instead of 96;
   LEARN carries the accent alone, since it is what this slide adds.
   k = 812/580 = 1.4, so 11.43 renders at 16px and 7.86 at 11px. */

function FeedbackLoopSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="812" height="154" viewBox="0 0 580 110">
          {/* Think */}
          <rect x="84" y="8" width="78" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="123" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>THINK</text>
          <line x1="162" y1="28" x2="188" y2="28" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="184,24 192,28 184,32" fill="#6b5bf5"/>

          {/* Act */}
          <rect x="192" y="8" width="78" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="231" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>ACT</text>
          <line x1="270" y1="28" x2="296" y2="28" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="292,24 300,28 292,32" fill="#6b5bf5"/>

          {/* Verify */}
          <rect x="300" y="8" width="78" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="339" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>VERIFY</text>
          <line x1="378" y1="28" x2="404" y2="28" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="400,24 408,28 400,32" fill="#6b5bf5"/>

          {/* Learn — the new step, and the one this slide is about */}
          <rect x="408" y="8" width="78" height="40" rx="6" fill="rgba(107,91,245,0.06)" stroke="#6b5bf5" strokeWidth="1.07"/>
          <text x="447" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#4b3ddb' }}>LEARN</text>

          {/* Exit */}
          <line x1="486" y1="28" x2="508" y2="28" stroke="#c6c3ba" strokeWidth="1.07"/>
          <polygon points="504,24 512,28 504,32" fill="#c6c3ba"/>
          <rect x="512" y="8" width="60" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="542" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>DONE</text>

          {/* The arc back — now it leaves from Learn, so the next turn starts
              with what the last one wrote down */}
          <path d="M447 48 V 70 Q 447 76 441 76 H 129 Q 123 76 123 70 V 56" fill="none" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="119,58 123,50 127,58" fill="#6b5bf5"/>
          <text x="285" y="71" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>repeat</text>

          {/* The escalation — dotted and struck out, same as the slide before */}
          <path
            d="M352 48 V 90 Q 352 96 346 96 H 34 Q 28 96 28 90 V 46"
            fill="none" stroke="#c6c3ba" strokeWidth="1.07" strokeDasharray="2,2.5"
          />
          <polygon points="24,48 28,40 32,48" fill="#c6c3ba"/>
          <text x="270" y="92" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>needs a person</text>

          <circle cx="150" cy="96" r="10" fill="var(--paper)" />
          <line x1="144" y1="90" x2="156" y2="102" stroke="var(--rose)" strokeWidth="1.6"/>
          <line x1="156" y1="90" x2="144" y2="102" stroke="var(--rose)" strokeWidth="1.6"/>

          {/* Human */}
          <text x="28" y="9" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>human</text>
          <circle cx="28" cy="22" r="7" fill="none" stroke="#1b1e26" strokeWidth="1.07"/>
          <path d="M15 39 a13 13 0 0 1 26 0" fill="none" stroke="#1b1e26" strokeWidth="1.07"/>

          <line x1="46" y1="28" x2="76" y2="28" stroke="#6b5bf5" strokeWidth="1.07" strokeDasharray="2,2.5"/>
          <polygon points="76,24 84,28 76,32" fill="#6b5bf5"/>
          <text x="61" y="20" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>steer</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>Every correction is either a one-off or a rule — decide which, out loud</span></li>
        <li><span>A rule you wrote down is a correction you never make twice</span></li>
        <li><span className="strong">Corrections per run is the number that earns autonomy</span></li>
      </ul>
    </div>
  )
}

FeedbackLoopSlide.meta = {
  title: 'Feedback loop',
  subtitle: 'The ability to self improve is key to trust',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'One step added to the loop from the slide before: LEARN, after VERIFY, and the repeat arc now leaves from it — the next turn starts with what the last one wrote down, not with a blank slate. Write it down means one of three places: memory for a fact, a skill for a procedure, a hook for a guarantee. You do not get autonomy by trusting harder, you get it by watching the correction count fall. Failure mode: correcting the same thing verbally every run and calling it collaboration.',
}

export default FeedbackLoopSlide
