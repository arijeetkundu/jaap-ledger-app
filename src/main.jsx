import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 24, fontFamily: 'monospace', fontSize: 14,
          background: '#0B1628', color: '#C9A84C',
          minHeight: '100vh', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
        }}>
          <strong>App Error — please share this with the developer:</strong>
          {'\n\n'}{String(this.state.error)}
          {'\n\n'}{this.state.error?.stack}
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
