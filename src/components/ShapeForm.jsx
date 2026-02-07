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
        base.height = (prev.type === 'circle' || prev.type === 'square') ? (prev.width / 2 || 20) : (prev.height || 20)
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
  const hasHolesOption = type === 'rectangle' || type === 'square' || type === 'circle' || type === 'ellipse'
  const maxCornerRadius = isRectOrSquare ? Math.min(shape.width, shape.height) / 2 : 0
  const holes = shape.holes || { enabled: false, fromEdgeX: 2, fromEdgeY: 2, diameter: 0.6, count: 4 }

  const roundTo = (val, decimals = 0) => {
    const n = parseFloat(val) || 0
    if (decimals === 0) return Math.round(n)
    const f = 10 ** decimals
    return Math.round(n * f) / f
  }
  const stepMain = 1
  const stepSmall = 0.1
  const groupClass = 'flex rounded-md border border-steel-700 overflow-hidden bg-steel-800 max-w-[180px]'
  const btnStepClass = 'w-8 flex-shrink-0 flex items-center justify-center bg-steel-800 border-steel-700 text-steel-200 hover:bg-steel-600 font-mono text-base transition-colors select-none disabled:opacity-40'
  const inputInGroupClass = 'input-field border-0 !rounded-none pr-12 w-full min-w-0 focus:ring-1 focus:ring-inset focus:ring-folplex-500/30'

  return (
    <div className="space-y-4">
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
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
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
        <div className={groupClass}>
          <button type="button" className={btnStepClass + ' border-r'} onClick={() => handleChange('width', Math.max(1, roundTo(shape.width || 0, 0) - stepMain))} title="Zmniejsz o 1 cm">−</button>
          <div className="relative flex-1 min-w-0">
            <input
              type="number"
              value={shape.width ?? ''}
              onChange={(e) => handleChange('width', e.target.value)}
              min="1"
              max="1000"
              step="1"
              className={inputInGroupClass}
              placeholder={type === 'circle' ? '10' : '20'}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-500 text-sm font-mono pointer-events-none">cm</span>
          </div>
          <button type="button" className={btnStepClass + ' border-l'} onClick={() => handleChange('width', Math.min(1000, roundTo(shape.width || 0, 0) + stepMain))} title="Zwiększ o 1 cm">+</button>
        </div>
      </div>

      {/* Wysokość (prostokąt/elipsa) */}
      {(type === 'rectangle' || type === 'ellipse') && (
        <div>
          <label className="input-label">
            {type === 'ellipse' ? 'Szerokość' : 'Wysokość'}
            <span className="text-steel-500 font-normal ml-1">(cm)</span>
          </label>
          <div className={groupClass}>
            <button type="button" className={btnStepClass + ' border-r'} onClick={() => handleChange('height', Math.max(1, roundTo(shape.height || 0, 0) - stepMain))} title="Zmniejsz o 1 cm">−</button>
            <div className="relative flex-1 min-w-0">
              <input
                type="number"
                value={shape.height ?? ''}
                onChange={(e) => handleChange('height', e.target.value)}
                min="1"
                max="1000"
                step="1"
                className={inputInGroupClass}
                placeholder="15"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-500 text-sm font-mono pointer-events-none">cm</span>
            </div>
            <button type="button" className={btnStepClass + ' border-l'} onClick={() => handleChange('height', Math.min(1000, roundTo(shape.height || 0, 0) + stepMain))} title="Zwiększ o 1 cm">+</button>
          </div>
        </div>
      )}

      {/* Zaokrąglenie – prostokąt i kwadrat */}
      {isRectOrSquare && (
        <div>
          <label className="input-label">
            Zaokrąglenie rogów (cm)
          </label>
          <div className="space-y-2.5">
            <div className={groupClass}>
              <button type="button" className={btnStepClass + ' border-r'} onClick={() => handleChange('cornerRadius', Math.max(0, roundTo((shape.cornerRadius || 0) - stepSmall, 1)))} title="Zmniejsz">−</button>
              <div className="relative flex-1 min-w-0">
                <input
                  type="number"
                  value={shape.cornerRadius ?? ''}
                  onChange={(e) => handleChange('cornerRadius', e.target.value)}
                  min="0"
                  max={maxCornerRadius}
                  step="0.1"
                  className={inputInGroupClass}
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-500 text-sm font-mono pointer-events-none">cm</span>
              </div>
              <button type="button" className={btnStepClass + ' border-l'} onClick={() => handleChange('cornerRadius', Math.min(maxCornerRadius, roundTo((shape.cornerRadius || 0) + stepSmall, 1)))} title="Zwiększ">+</button>
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

      {/* Otwory – prostokąt, kwadrat, koło, elipsa */}
      {hasHolesOption && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="input-label mb-0">Otwory</label>
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
                  <div className={groupClass}>
                    <button type="button" className={btnStepClass + ' border-r'} onClick={() => handleHolesChange('fromEdgeX', Math.max(0, roundTo((holes.fromEdgeX || 0) - stepSmall, 1)))}>−</button>
                    <input
                      type="number"
                      value={holes.fromEdgeX ?? 2}
                      onChange={(e) => handleHolesChange('fromEdgeX', e.target.value)}
                      min="0"
                      step="0.1"
                      className="input-field border-0 !rounded-none flex-1 min-w-0 focus:ring-1 focus:ring-inset focus:ring-folplex-500/30"
                    />
                    <button type="button" className={btnStepClass + ' border-l'} onClick={() => handleHolesChange('fromEdgeX', roundTo((holes.fromEdgeX || 0) + stepSmall, 1))}>+</button>
                  </div>
                </div>
                <div>
                  <label className="input-label text-xs">Od krawędzi Y (cm)</label>
                  <div className={groupClass}>
                    <button type="button" className={btnStepClass + ' border-r'} onClick={() => handleHolesChange('fromEdgeY', Math.max(0, roundTo((holes.fromEdgeY || 0) - stepSmall, 1)))}>−</button>
                    <input
                      type="number"
                      value={holes.fromEdgeY ?? 2}
                      onChange={(e) => handleHolesChange('fromEdgeY', e.target.value)}
                      min="0"
                      step="0.1"
                      className="input-field border-0 !rounded-none flex-1 min-w-0 focus:ring-1 focus:ring-inset focus:ring-folplex-500/30"
                    />
                    <button type="button" className={btnStepClass + ' border-l'} onClick={() => handleHolesChange('fromEdgeY', roundTo((holes.fromEdgeY || 0) + stepSmall, 1))}>+</button>
                  </div>
                </div>
              </div>
              <div>
                <label className="input-label text-xs">Średnica otworu (cm)</label>
                <div className={groupClass}>
                  <button type="button" className={btnStepClass + ' border-r'} onClick={() => handleHolesChange('diameter', Math.max(0.1, roundTo((holes.diameter || 0.6) - stepSmall, 1)))}>−</button>
                  <input
                    type="number"
                    value={holes.diameter ?? 0.6}
                    onChange={(e) => handleHolesChange('diameter', e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="input-field border-0 !rounded-none flex-1 min-w-0 focus:ring-1 focus:ring-inset focus:ring-folplex-500/30"
                  />
                  <button type="button" className={btnStepClass + ' border-l'} onClick={() => handleHolesChange('diameter', roundTo((holes.diameter || 0.6) + stepSmall, 1))}>+</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  )
}
