import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import ShapeForm from './components/ShapeForm'
import SvgPreview from './components/SvgPreview'
import ExportButtons from './components/ExportButtons'
import ProjectList from './components/ProjectList'
import Header from './components/Header'
import SaveProjectModal from './components/SaveProjectModal'

const defaultShape = {
  type: 'rectangle',
  width: 20,
  height: 15,
  cornerRadius: 0,
  isSquare: false
}

export default function App() {
  const [shape, setShape] = useState(defaultShape)
  const [showGrid, setShowGrid] = useState(true)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProject = async (name) => {
    try {
      const projectData = {
        name,
        data: { shapes: [shape], unit: 'cm' }
      }

      if (editingProject) {
        // Update existing project
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        if (res.ok) {
          toast.success('Projekt zaktualizowany')
          setEditingProject(null)
          fetchProjects()
        }
      } else {
        // Create new project
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        if (res.ok) {
          toast.success('Projekt zapisany')
          fetchProjects()
        }
      }
      setShowSaveModal(false)
    } catch (err) {
      toast.error('Błąd zapisu projektu')
      console.error(err)
    }
  }

  const handleLoadProject = (project) => {
    if (project.data?.shapes?.[0]) {
      setShape(project.data.shapes[0])
      setEditingProject(project)
      toast.success(`Wczytano: ${project.name}`)
    }
  }

  const handleDeleteProject = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć ten projekt?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Projekt usunięty')
        if (editingProject?.id === id) {
          setEditingProject(null)
        }
        fetchProjects()
      }
    } catch (err) {
      toast.error('Błąd usuwania projektu')
    }
  }

  const handleNewProject = () => {
    setShape(defaultShape)
    setEditingProject(null)
    toast.success('Nowy projekt')
  }

  return (
    <div className="min-h-screen bg-steel-950 noise-overlay">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-steel-800 text-steel-100 border border-steel-700',
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155'
          }
        }}
      />
      
      <Header 
        onNewProject={handleNewProject}
        editingProject={editingProject}
      />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-steel-200 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-folplex-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Wymiary kształtu
              </h2>
              <ShapeForm shape={shape} setShape={setShape} />
            </div>

            <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-semibold text-steel-200 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-folplex-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Eksport
              </h2>
              <ExportButtons shape={shape} />
            </div>

            <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <span className="text-steel-300">Pokaż siatkę</span>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    showGrid ? 'bg-folplex-600' : 'bg-steel-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      showGrid ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSaveModal(true)}
              className="btn btn-primary w-full animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {editingProject ? 'Aktualizuj projekt' : 'Zapisz projekt'}
            </button>
          </div>

          {/* Center Panel - Preview */}
          <div className="lg:col-span-5">
            <div className="card p-6 h-full animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-steel-200 flex items-center gap-2">
                  <svg className="w-5 h-5 text-folplex-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Podgląd
                </h2>
                <span className="badge badge-green">
                  {shape.width} × {shape.height} cm
                </span>
              </div>
              <SvgPreview shape={shape} showGrid={showGrid} />
            </div>
          </div>

          {/* Right Panel - Projects */}
          <div className="lg:col-span-3">
            <div className="card p-6 h-full animate-fade-in" style={{ animationDelay: '0.25s' }}>
              <h2 className="text-lg font-semibold text-steel-200 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-folplex-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Projekty
              </h2>
              <ProjectList
                projects={projects}
                isLoading={isLoading}
                onLoad={handleLoadProject}
                onDelete={handleDeleteProject}
                activeProjectId={editingProject?.id}
              />
            </div>
          </div>
        </div>
      </main>

      {showSaveModal && (
        <SaveProjectModal
          onSave={handleSaveProject}
          onClose={() => setShowSaveModal(false)}
          defaultName={editingProject?.name || ''}
        />
      )}
    </div>
  )
}
