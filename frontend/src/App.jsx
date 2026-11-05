import { useEffect, useState } from 'react'
import CodeEditor from './components/CodeEditor'
import Explanation from './components/Explanation'
import History from './components/History'
import { explainCode, fetchHistory } from './services/api'

const examples = {
  javascript: `function add(a, b) {
  return a + b;
}

console.log(add(10, 20));`,
  python: `def add(a, b):
    return a + b

print(add(10, 20))`,
}

export default function App() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(examples.javascript)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadHistory() {
    try {
      setHistory(await fetchHistory())
    } catch {
      // History is unavailable until the backend and database are configured.
    }
  }

  useEffect(() => { loadHistory() }, [])

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage)
    setCode(examples[nextLanguage])
    setResult(null)
    setError('')
  }

  async function handleExplain() {
    if (!code.trim()) {
      setError('Please enter a code snippet first.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const explanation = await explainCode(language, code)
      setResult(explanation)
      await loadHistory()
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.errors?.code?.[0]
      setError(message || 'Request failed. Check that Laravel is running and your API configuration is correct.')
    } finally {
      setLoading(false)
    }
  }

  function selectHistory(item) {
    setLanguage(item.language)
    setCode(item.code)
    setResult(item)
    setError('')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">AI</span>
          <span>Code Explainer</span>
        </a>
        <span className="topbar-note">Understand code, faster.</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR AI DEVELOPMENT ASSISTANT</p>
        <h1>Make code <span>make sense.</span></h1>
        <p className="hero-copy">Paste a Python or JavaScript snippet and get a clear explanation, key logic, and complexity estimates.</p>
      </section>

      <div className="workspace">
        <section className="panel editor-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">INPUT</p>
              <h2>Paste your code</h2>
            </div>
            <select value={language} onChange={(event) => changeLanguage(event.target.value)} aria-label="Programming language">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>
          <CodeEditor language={language} value={code} onChange={setCode} />
          <div className="editor-footer">
            <span className="muted">Only submit code you are authorized to share.</span>
            <button className="primary-button" onClick={handleExplain} disabled={loading || !code.trim()}>
              {loading ? <><span className="spinner" /> Analyzing...</> : '✦ Explain code'}
            </button>
          </div>
          {error && <div className="error-message" role="alert">{error}</div>}
        </section>

        <Explanation result={result} />
        <History items={history} onSelect={selectHistory} />
      </div>

      <footer className="footer">AI-generated explanations can be inaccurate. Review the code and output before relying on them.</footer>
    </main>
  )
}
