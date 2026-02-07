export default function ShapeForm({ shape, setShape }) {
  const type = shape.type || 'rectangle'

  const setType = (newType) => {
    setShape(prev => {
      const base = { ...prev, type: newType }
      if (newType === 'circle') {
        base.width = prev.width || 10
        base.height = prev.width || 10
        base.cornerRadius = 0
        base.holes = { ...(prev.holes || {}), enabled: false }
      } else if (newType === 'ellipse') {
        base.width = prev.width || 40
        base.height = prev.type === 'circle' ? (prev.width / 2 || 20) : (prev.height || 20)
        base.cornerRadius = 0
        base.holes = { ...(prev.holes || {}), enabled: false }
      } else if (newType === 'square') {
        const s = prev.width || prev.height || 10
        base.width = s
        base.height = s
        base.holes = prev.holes || { enabled: false, fromEdgeX: 2, fromEdgeY: 2, diameter: 0.6, count: 4 }
      } else {
        base.width = prev.width || 20
        base.height = prev.type === 'square' ? (prev.width * 0.75 || 15) : (prev.height || 15)
        base.holes = prev.holes || { enabled: false, fromEdgeX: 2, fromEdgeY: 2, diameter: 0.6, count: 4 }
      }
      return base
    })
  }

  const handleChange = (field, value) => {
    const numValue = parseFloat(value) || 0
    setShape(prev => {
      const updated = { ...prev, [field]: numValue }
      if (type === 'square' && (field === 'width' || field === 'height')) {
        updated.width = numValue
        updated.height = numValue
      }
      const maxRadius = Math.min(updated.width, updated.height) / 2
      if (updated.cornerRadius > maxRadius) updated.cornerRadius = maxRadius
      return updated
    })
  }

  const handleHolesChange = (field, value) => {
    const numValue = field === 'enabled' || field === 'count' ? (field === 'enabled' ? !!value : (parseInt(value, 10) || 0)) : (parseFloat(value) || 0)
    setShape(prev => ({
      ...prev,
      holes: { ...(prev.holes || {}), [field]: numValue }
    }))
  }

  const isRectOrSquare = type === 'rectangle' || type === 'square'
  const maxCornerRadius = isRectOrSquare ? Math.min(shape.width, shape.height) / 2 : 0
  const holes = shape.holes || { enabled: false, fromEdgeX: 2, fromEdgeY: 2, diameter: 0.6, count: 4 }

  return (
    <div className="space-y-5">
      {/* Typ kształtu */}
      <div>
        <label className="input-label">Kształt</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'rectangle', label: 'Prostokąt' },
            { id: 'square', label: 'Kwadrat' },
            { id: 'circle', label: 'Koło' },
            { id: 'ellipse', label: 'Elipsa' }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                type === t.id
                  ? 'border-folplex-500 bg-folplex-500/10 text-folplex-400'
                  : 'border-steel-700 bg-steel-800/50 text-steel-400 hover:border-steel-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Szerokość / Bok / Średnica / Długość */}
      <div>
        <label className="input-label">
          {type === 'circle' ? 'Średnica' : type === 'ellipse' ? 'Długość' : type === 'square' ? 'Bok' : 'Szerokość'}
          <span className="text-steel-500 font-normal ml-1">(cm)</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={shape.width ?? ''}
            onChange={(e) => handleChange('width', e.target.value)}
            min="0.1"
            max="1000"
            step="0.1"
            className="input-field pr-12"
            placeholder={type === 'circle' ? '10' : '20'}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-500 text-sm font-mono">cm</span>
        </div>
      </div>

      {/* Wysokość (prostokąt/elipsa) */}
      {(type === 'rectangle' || type === 'ellipse') && (
        <div>
          <label className="input-label">
            {type === 'ellipse' ? 'Szerokość' : 'Wysokość'}
            <span className="text-steel-500 font-normal ml-1">(cm)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={shape.height ?? ''}
              onChange={(e) => handleChange('height', e.target.value)}
              min="0.1"
              max="1000"
              step="0.1"
              className="input-field pr-12"
              placeholder="15"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-500 text-sm font-mono">cm</span>
          </div>
        </div>
      )}

      {/* Zaokrąglenie – prostokąt i kwadrat */}
      {isRectOrSquare && (
        <div>
          <label className="input-label flex items-center justify-between">
            <span>Zaokrąglenie rogów (cm)</span>
            <span className="text-xs text-steel-500">max: {maxCornerRadius.toFixed(1)} cm</span>
          </label>
          <div className="space-y-3">
            <div className="relative">
              <input
                type="number"
                value={shape.cornerRadius ?? ''}
                onChange={(e) => handleChange('cornerRadius', e.target.value)}
                min="0"
                max={maxCornerRadius}
                step="0.1"
                className="input-field pr-12"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-500 text-sm font-mono">cm</span>
            </div>
            <input
              type="range"
              value={shape.cornerRadius ?? 0}
              onChange={(e) => handleChange('cornerRadius', e.target.value)}
              min="0"
              max={maxCornerRadius}
              step="0.1"
              className="w-full h-2 bg-steel-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-folplex-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Otwory – prostokąt i kwadrat */}
      {isRectOrSquare && (
        <div className="p-3 bg-steel-800/50 rounded-lg border border-steel-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="input-label mb-0">Otwory (np. do zawieszenia)</label>
            <button
              type="button"
              onClick={() => handleHolesChange('enabled', !holes.enabled)}
              className={`relative w-12 h-6 rounded-full transition-colors overflow-hidden ${holes.enabled ? 'bg-folplex-600' : 'bg-steel-700'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${holes.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          {holes.enabled && (
            <>
              <div>
                <label className="input-label text-xs">Ilość (1–4, np. 4 rogi)</label>
                <select
                  value={holes.count ?? 4}
                  onChange={(e) => handleHolesChange('count', parseInt(e.target.value, 10))}
                  className="input-field"
                >
                  {[1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="input-label text-xs">Od krawędzi X (cm)</label>
                  <input
                    type="number"
                    value={holes.fromEdgeX ?? 2}
                    onChange={(e) => handleHolesChange('fromEdgeX', e.target.value)}
                    min="0"
                    step="0.1"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label text-xs">Od krawędzi Y (cm)</label>
                  <input
                    type="number"
                    value={holes.fromEdgeY ?? 2}
                    onChange={(e) => handleHolesChange('fromEdgeY', e.target.value)}
                    min="0"
                    step="0.1"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="input-label text-xs">Średnica otworu (cm)</label>
                <input
                  type="number"
                  value={holes.diameter ?? 0.6}
                  onChange={(e) => handleHolesChange('diameter', e.target.value)}
                  min="0.1"
                  step="0.1"
                  className="input-field"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Szybkie rozmiary – prostokąt */}
      {type === 'rectangle' && (
        <div>
          <label className="input-label mb-2">Szybkie rozmiary</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { w: 20, h: 15, label: '20×15' },
              { w: 30, h: 20, label: '30×20' },
              { w: 50, h: 30, label: '50×30' },
              { w: 60, h: 40, label: '60×40' },
              { w: 100, h: 50, label: '100×50' }
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => setShape(prev => ({ ...prev, width: preset.w, height: preset.h }))}
                className="px-3 py-2 text-xs font-mono text-steel-400 bg-steel-800/50 border border-steel-700/50 rounded-lg hover:border-folplex-500/50 hover:text-folplex-400 transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Szybkie rozmiary – kwadrat */}
      {type === 'square' && (
        <div>
          <label className="input-label mb-2">Szybkie rozmiary</label>
          <div className="grid grid-cols-3 gap-2">
            {[10, 15, 20, 30, 40, 50].map(s => (
              <button
                key={s}
                onClick={() => setShape(prev => ({ ...prev, width: s, height: s }))}
                className="px-3 py-2 text-xs font-mono text-steel-400 bg-steel-800/50 border border-steel-700/50 rounded-lg hover:border-folplex-500/50 hover:text-folplex-400 transition-all"
              >
                {s}×{s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Szybkie rozmiary – elipsa */}
      {type === 'ellipse' && (
        <div>
          <label className="input-label mb-2">Szybkie rozmiary</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ w: 20, h: 15, label: '20×15' }, { w: 30, h: 20, label: '30×20' }, { w: 40, h: 30, label: '40×30' }].map(preset => (
              <button
                key={preset.label}
                onClick={() => setShape(prev => ({ ...prev, width: preset.w, height: preset.h }))}
                className="px-3 py-2 text-xs font-mono text-steel-400 bg-steel-800/50 border border-steel-700/50 rounded-lg hover:border-folplex-500/50 hover:text-folplex-400 transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {type === 'circle' && (
        <div>
          <label className="input-label mb-2">Szybkie średnice</label>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 15, 20, 30, 50].map(d => (
              <button
                key={d}
                onClick={() => setShape(prev => ({ ...prev, width: d, height: d }))}
                className="px-3 py-2 text-xs font-mono text-steel-400 bg-steel-800/50 border border-steel-700/50 rounded-lg hover:border-folplex-500/50 hover:text-folplex-400 transition-all"
              >
                Ø{d} cm
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
