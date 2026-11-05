import Editor from '@monaco-editor/react'

export default function CodeEditor({ language, value, onChange }) {
  return (
    <div className="editor-wrap">
      <Editor
        height="340px"
        language={language}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 16 },
        }}
      />
    </div>
  )
}
