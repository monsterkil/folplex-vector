export default function ProjectList({ projects, isLoading, onLoad, onDelete, activeProjectId }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-steel-500">
        <div className="w-8 h-8 border-2 border-folplex-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm">Ładowanie projektów...</span>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-steel-500">
        <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <span className="text-sm">Brak zapisanych projektów</span>
        <span className="text-xs mt-1 text-steel-600">Stwórz pierwszy projekt i zapisz go</span>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
      {projects.map((project, index) => {
        const shape = project.data?.shapes?.[0]
        const isActive = project.id === activeProjectId
        
        return (
          <div
            key={project.id}
            className={`group p-3 rounded-lg border transition-all duration-200 animate-fade-in ${
              isActive
                ? 'bg-folplex-900/30 border-folplex-600'
                : 'bg-steel-800/30 border-steel-700/50 hover:border-steel-600'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm truncate ${
                  isActive ? 'text-folplex-300' : 'text-steel-200'
                }`}>
                  {project.name}
                </h3>
                {shape && (
                  <p className="text-xs text-steel-500 font-mono mt-0.5">
                    {shape.width} × {shape.height} cm
                    {shape.cornerRadius > 0 && ` • R${shape.cornerRadius}`}
                  </p>
                )}
                <p className="text-xs text-steel-600 mt-1">
                  {formatDate(project.createdAt)}
                </p>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onLoad(project)}
                  className="p-1.5 text-steel-400 hover:text-folplex-400 hover:bg-steel-700/50 rounded transition-colors"
                  title="Wczytaj projekt"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(project.id)}
                  className="p-1.5 text-steel-400 hover:text-red-400 hover:bg-steel-700/50 rounded transition-colors"
                  title="Usuń projekt"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {isActive && (
              <div className="mt-2 pt-2 border-t border-folplex-700/50">
                <span className="text-xs text-folplex-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-folplex-500 animate-pulse" />
                  Aktualnie edytowany
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'przed chwilą'
  if (diffMins < 60) return `${diffMins} min temu`
  if (diffHours < 24) return `${diffHours} godz. temu`
  if (diffDays < 7) return `${diffDays} dni temu`
  
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}
