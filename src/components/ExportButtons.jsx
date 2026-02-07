import { generateSvgFile, downloadFile, getExportFilename } from '../utils/generateSvg'
import { exportToPdf } from '../utils/exportPdf'
import { toast } from 'react-hot-toast'

export default function ExportButtons({ shape }) {
  const handleExportSvg = () => {
    try {
      const svgContent = generateSvgFile(shape)
      const filename = getExportFilename(shape, 'svg')
      downloadFile(svgContent, filename, 'image/svg+xml')
      toast.success('SVG pobrany')
    } catch (err) {
      toast.error('Błąd eksportu SVG')
      console.error(err)
    }
  }

  const handleExportPdf = async () => {
    try {
      toast.loading('Generowanie PDF...', { id: 'pdf' })
      const filename = getExportFilename(shape, 'pdf')
      await exportToPdf(shape, filename)
      toast.success('PDF pobrany', { id: 'pdf' })
    } catch (err) {
      toast.error('Błąd eksportu PDF', { id: 'pdf' })
      console.error(err)
    }
  }

  return (
    <div className="space-y-2.5">
      <button
        onClick={handleExportSvg}
        className="btn btn-secondary w-full group"
      >
        <svg className="w-4 h-4 text-folplex-400 group-hover:text-folplex-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M12 18v-6" />
          <path d="m9 15 3 3 3-3" />
        </svg>
        Pobierz SVG
        <span className="ml-auto text-xs text-steel-500 font-mono">.svg</span>
      </button>

      <button
        onClick={handleExportPdf}
        className="btn btn-secondary w-full group"
      >
        <svg className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M12 18v-6" />
          <path d="m9 15 3 3 3-3" />
        </svg>
        Pobierz PDF
        <span className="ml-auto text-xs text-steel-500 font-mono">A4</span>
      </button>
    </div>
  )
}
