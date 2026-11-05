export default function Explanation({ result }) {
  if (!result) return null

  return (
    <section className="panel result-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">AI ANALYSIS</p>
          <h2>Code explanation</h2>
        </div>
        <span className="language-tag">{result.language}</span>
      </div>

      <p className="explanation-text">{result.explanation}</p>

      <h3>Key logic</h3>
      <ul className="logic-list">
        {(result.key_logic || []).map((item, index) => <li key={index}>{item}</li>)}
      </ul>

      <div className="complexity-grid">
        <div className="complexity-card">
          <span>Time complexity</span>
          <strong>{result.time_complexity || 'Not determined'}</strong>
        </div>
        <div className="complexity-card">
          <span>Space complexity</span>
          <strong>{result.space_complexity || 'Not determined'}</strong>
        </div>
      </div>
      {result.complexity_note && <p className="note">{result.complexity_note}</p>}
    </section>
  )
}
