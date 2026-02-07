import { useState, useEffect, useRef } from 'react'

export default function SaveProjectModal({ onSave, onClose, defaultName }) {
  const [name, setName] = useState(defaultName || '')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(name.trim())
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-steel-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative card p-6 w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-steel-100">
            Pobierz plik
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-steel-400 hover:text-steel-200 rounded-lg hover:bg-steel-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="input-label">Nazwa projektu</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="np. Blat stołu, Front szuflady..."
              maxLength={100}
            />
            <p className="text-xs text-steel-500 mt-2">
              Nadaj projektowi opisową nazwę, aby łatwo go znaleźć później
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Pobierz
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
