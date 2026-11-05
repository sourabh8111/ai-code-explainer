export default function History({ items, onSelect }) {
  return (
    <section className="panel history-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PAST REQUESTS</p>
          <h2>Recent history</h2>
        </div>
        <span className="count">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="muted">Your explanations will appear here.</p>
      ) : (
        <div className="history-list">
          {items.map((item) => (
            <button className="history-item" key={item.id} onClick={() => onSelect(item)}>
              <span className="history-language">{item.language}</span>
              <span className="history-code">{item.code.replace(/\s+/g, ' ').slice(0, 76)}</span>
              <span className="history-date">{new Date(item.created_at).toLocaleString()}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
