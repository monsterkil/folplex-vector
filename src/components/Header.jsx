export default function Header({ onNewProject, editingProject }) {
  return (
    <header className="border-b border-steel-800 bg-steel-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-folplex-500 to-folplex-700 flex items-center justify-center shadow-lg shadow-folplex-500/20">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M7 7h10v10H7z" strokeDasharray="3 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Folplex <span className="text-folplex-400">Vector</span>
              </h1>
              <p className="text-xs text-steel-500 -mt-0.5">Generator plików CNC</p>
            </div>
          </div>

          {/* Center - Current Project */}
          {editingProject && (
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-steel-800/50 rounded-full border border-steel-700">
              <span className="w-2 h-2 rounded-full bg-folplex-500 animate-pulse" />
              <span className="text-sm text-steel-300">
                Edytujesz: <span className="text-steel-100 font-medium">{editingProject.name}</span>
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNewProject}
              className="btn btn-ghost text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nowy
            </button>
            <div className="h-6 w-px bg-steel-700" />
            <span className="text-xs text-steel-500 hidden sm:block">
              jednostka: <span className="text-folplex-400 font-mono">cm</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
