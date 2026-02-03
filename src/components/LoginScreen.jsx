import { useState } from 'react'
import { toast } from 'react-hot-toast'

// Demo – dane do szybkiego logowania (widoczne celowo)
export const DEMO_LOGIN = 'kierownik'
export const DEMO_PASSWORD = 'demo123'

export default function LoginScreen({ onLogin }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!login.trim() || !password.trim()) {
      toast.error('Wpisz login i hasło')
      return
    }
    if (login.trim().toLowerCase() === DEMO_LOGIN && password === DEMO_PASSWORD) {
      onLogin({ role: DEMO_LOGIN })
      toast.success(`Zalogowano jako ${DEMO_LOGIN}`)
    } else {
      toast.error('Nieprawidłowy login lub hasło')
    }
  }

  const handleDemoClick = () => {
    setLogin(DEMO_LOGIN)
    setPassword(DEMO_PASSWORD)
    onLogin({ role: DEMO_LOGIN })
    toast.success(`Zalogowano jako ${DEMO_LOGIN}`)
  }

  return (
    <div className="min-h-screen bg-steel-950 noise-overlay flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="card p-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-folplex-500 to-folplex-700 flex items-center justify-center shadow-lg shadow-folplex-500/20">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M7 7h10v10H7z" strokeDasharray="3 2" />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-bold text-white text-center mb-1">
            Folplex <span className="text-folplex-400">Vector</span>
          </h1>
          <p className="text-steel-400 text-sm text-center mb-6">Zaloguj się, aby kontynuować</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Login</label>
              <input
                type="text"
                className="input-field"
                placeholder="np. kierownik"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="input-label">Hasło</label>
              <input
                type="password"
                className="input-field"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Zaloguj się
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-steel-800">
            <p className="text-xs text-steel-500 mb-2">Demo – kliknij hasło, aby zalogować się od razu:</p>
            <button
              type="button"
              onClick={handleDemoClick}
              className="w-full py-2.5 px-4 rounded-lg bg-steel-800 border border-steel-700 hover:border-folplex-500 hover:bg-steel-800/80 transition-colors flex items-center justify-center gap-2 group"
            >
              <span className="text-steel-400 text-sm">Hasło:</span>
              <code className="text-folplex-400 font-mono text-sm font-medium group-hover:text-folplex-300">
                {DEMO_PASSWORD}
              </code>
              <span className="text-steel-500 text-xs">(kierownik)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
