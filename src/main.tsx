import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { initWebVitals } from './lib/webVitals'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Initialize Web Vitals monitoring for performance tracking
initWebVitals()

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
