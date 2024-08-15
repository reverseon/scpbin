import { ErrorBoundary, LocationProvider, Router } from 'preact-iso'
import './app.css'
import { Home } from './pages/home'
import { HowItWorks } from './pages/howitworks'
import { Toaster } from 'react-hot-toast'
import { Success } from './pages/success'
import { createContext } from 'preact'
import { useMemo, useState } from 'preact/hooks'
import { NotFound } from './pages/notfound'
import { Plain } from './pages/plain'
import { Encrypted } from './pages/encrypted'

// createContext

export const URLContext = createContext<
{
      url: string | undefined
      setUrl: (url: string) => void
}
>(
{
      url: undefined,
      setUrl: () => {}
})

export function App() {
  const [url, setUrl] = useState<string | undefined>(undefined)
  const urlmemo = useMemo(() => ({ url, setUrl }), [url, setUrl])

  return (
    <URLContext.Provider value={urlmemo}>
      <LocationProvider>
        <ErrorBoundary>
          <Toaster />
          <Router>
            <Home path="/" />
            <HowItWorks path="/how-it-works" />
            <Success path="/success" />
            <Plain path="/p/:b64" />
            <Encrypted path="/e/:b64" />
            <NotFound default />
          </Router>
        </ErrorBoundary>
      </LocationProvider>
    </URLContext.Provider>
  )
}
