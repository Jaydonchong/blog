function GoodPromptLeadsToBetterOutputSlide() {
  return (
    <div>
      <table className="sheet">
        <thead>
          <tr>
            <th>Reliability</th>
            <th>Consistency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Correct <strong>in my context</strong></td>
            <td>Same across runs and models</td>
          </tr>
          <tr>
            <td>Verified</td>
            <td>Same structure every time</td>
          </tr>
          <tr>
            <td></td>
            <td>Same process every time</td>
          </tr>
        </tbody>
      </table>
      <p className="pull">Reliability is about this answer. Consistency is about tomorrow's.</p>
    </div>
  )
}

GoodPromptLeadsToBetterOutputSlide.meta = {
  title: 'Good prompt leads to better output',
  section: 'prompt',
  sectionLabel: 'Prompt Engineering',
  notes: '"Same process" is the check nobody runs and the best predictor of failure at scale: an answer that was right by luck stops being right. Correctness is domain-relative, hence "in my context".',
}

export default GoodPromptLeadsToBetterOutputSlide
