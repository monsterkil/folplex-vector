import { useEffect } from 'react'

export default function ShapeForm({ shape, setShape }) {
  const handleChange = (field, value) => {
    const numValue = parseFloat(value) || 0
    
    setShape(prev => {
      const updated = { ...prev, [field]: numValue }
      
      // If square mode is on, sync width and height
      if (prev.isSquare && (field === 'width' || field === 'height')) {
        updated.width = numValue
        updated.height = numValue
      }
      
      // Ensure corner radius doesn't exceed half of smallest dimension
      const maxRadius = Math.min(updated.width, updated.height) / 2
      if (updated.cornerRadius > maxRadius) {
        updated.cornerRadius = maxRadius
      }
      
      return updated
    })
  }

  const toggleSquare = () => {
    setShape(prev => {
      if (!prev.isSquare) {
        // Switching to square - use width as the dimension
        return {
          ...prev,
          isSquare: true,
          height: prev.width
        }
      }
      return { ...prev, isSquare: false }
    })
  }

  const maxCornerRadius = Math.min(shape.width, shape.height) / 2

  return (
    <div className="space-y-5">
      {/* Square toggle */}
      <div className="flex items-center justify-between p-3 bg-steel-800/50 rounded-lg border border-steel-700/50">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded border-2 transition-colors ${
            shape.isSquare 
              ? 'border-folplex-500 bg-folplex-500/10' 
              : 'border-steel-600'
          }`}>
            <div className={`w-full h-full flex items-center justify-center ${
              shape.isSquare ? 'text-folplex-400' : 'text-steel-500'
            }`}>
              {shape.isSquare ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
              ) : (
                <svg className="w-5 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                </svg>
              )}
            </div>
          </div>
          <div>
            <span className="text-steel-200 text-sm font-medium">
              {shape.isSquare ? 'Kwadrat' : 'Prostokąt'}
            </span>
            <p className="text-xs text-steel-500">
              {shape.isSquare ? 'Równe boki' : 'Dowolne proporcje'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleSquare}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            shape.isSquare ? 'bg-folplex-600' : 'bg-steel-700'
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
              shape.isSquare ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Width */}
      <div>
        <label className="input-label">
          Szerokość
          <span className="text-steel-500 font-normal ml-1">(cm)</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={shape.width || ''}
            onChange={(e) => handleChange('width', e.target.value)}
            min="0.1"
            max="1000"
            step="0.1"
            className="input-field pr-12"
            placeholder="20"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-500 text-sm font-mono">
            cm
          </span>
        </div>
      </div>

      {/* Height */}
      <div className={shape.isSquare ? 'opacity-50 pointer-events-none' : ''}>
        <label className="input-label">
          Wysokość
          <span className="text-steel-500 font-normal ml-1">(cm)</span>
          {shape.isSquare && (
            <span className="text-folplex-400 ml-2 text-xs">= szerokość</span>
          )}
        </label>
        <div className="relative">
          <input
            type="number"
            value={shape.height || ''}
            onChange={(e) => handleChange('height', e.target.value)}
            min="0.1"
            max="1000"
            step="0.1"
            className="input-field pr-12"
            placeholder="15"
            disabled={shape.isSquare}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-500 text-sm font-mono">
            cm
          </span>
        </div>
      </div>

      {/* Corner Radius */}
      <div>
        <label className="input-label flex items-center justify-between">
          <span>
            Zaokrąglenie rogów
            <span className="text-steel-500 font-normal ml-1">(cm)</span>
          </span>
          <span className="text-xs text-steel-500 font-normal">
            max: {maxCornerRadius.toFixed(1)} cm
          </span>
        </label>
        <div className="space-y-3">
          <div className="relative">
            <input
              type="number"
              value={shape.cornerRadius || ''}
              onChange={(e) => handleChange('cornerRadius', e.target.value)}
              min="0"
              max={maxCornerRadius}
              step="0.1"
              className="input-field pr-12"
              placeholder="0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-500 text-sm font-mono">
              cm
            </span>
          </div>
          
          {/* Slider */}
          <input
            type="range"
            value={shape.cornerRadius}
            onChange={(e) => handleChange('cornerRadius', e.target.value)}
            min="0"
            max={maxCornerRadius}
            step="0.1"
            className="w-full h-2 bg-steel-700 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-folplex-500
                       [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:transition-transform
                       [&::-webkit-slider-thumb]:hover:scale-110"
          />
        </div>
      </div>

      {/* Quick presets */}
      <div>
        <label className="input-label mb-2">Szybkie rozmiary</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { w: 10, h: 10, label: '10×10' },
            { w: 20, h: 15, label: '20×15' },
            { w: 30, h: 20, label: '30×20' },
            { w: 50, h: 30, label: '50×30' },
            { w: 60, h: 40, label: '60×40' },
            { w: 100, h: 50, label: '100×50' },
          ].map(preset => (
            <button
              key={preset.label}
              onClick={() => setShape(prev => ({
                ...prev,
                width: preset.w,
                height: preset.h,
                isSquare: preset.w === preset.h
              }))}
              className="px-3 py-2 text-xs font-mono text-steel-400 bg-steel-800/50 
                         border border-steel-700/50 rounded-lg
                         hover:border-folplex-500/50 hover:text-folplex-400
                         transition-all duration-200"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
