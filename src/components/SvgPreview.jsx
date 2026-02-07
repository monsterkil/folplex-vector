import { useMemo } from 'react'
import { generateSvgPath } from '../utils/generateSvg'

export default function SvgPreview({ shape, showGrid }) {
  const type = shape.type || 'rectangle'
  const width = type === 'circle' ? (shape.width || 10) : (shape.width || 20)
  const height = type === 'circle' ? (shape.width || 10) : (shape.height || 15)
  const cornerRadius = shape.cornerRadius ?? 0

  const padding = Math.max(width, height) * 0.15
  const viewBoxWidth = width + padding * 2
  const viewBoxHeight = height + padding * 2

  const { main: pathD, holePaths } = useMemo(() => generateSvgPath(shape), [shape])

  const gridSize = 1
  const majorGridSize = 5

  const gridLines = useMemo(() => {
    if (!showGrid) return { minor: [], major: [] }
    const minor = []
    const major = []
    const startX = -padding
    const endX = width + padding
    const startY = -padding
    const endY = height + padding
    for (let x = Math.floor(startX); x <= Math.ceil(endX); x += gridSize) {
      if (x % majorGridSize === 0) major.push(`M${x},${startY} L${x},${endY}`)
      else minor.push(`M${x},${startY} L${x},${endY}`)
    }
    for (let y = Math.floor(startY); y <= Math.ceil(endY); y += gridSize) {
      if (y % majorGridSize === 0) major.push(`M${startX},${y} L${endX},${y}`)
      else minor.push(`M${startX},${y} L${endX},${y}`)
    }
    return { minor, major }
  }, [width, height, padding, showGrid])

  const fontSize = Math.max(viewBoxWidth, viewBoxHeight) * 0.04
  const arrowSize = fontSize * 0.5
  const strokeW = viewBoxWidth * 0.005

  const typeLabel = type === 'circle' ? 'Koło' : type === 'ellipse' ? 'Elipsa' : (shape.isSquare ? 'Kwadrat' : 'Prostokąt')
  const hasHoles = (shape.holes?.enabled && shape.holes?.count) && (type === 'rectangle' || type === 'ellipse')

  return (
    <div className="relative w-full aspect-[4/3] bg-steel-800/30 rounded-lg overflow-hidden border border-steel-700/50">
      <svg
        viewBox={`${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x={-padding} y={-padding} width={viewBoxWidth} height={viewBoxHeight} fill="#0f172a" />

        {showGrid && (
          <g>
            <path d={gridLines.minor.join(' ')} stroke="rgba(235, 106, 12, 0.12)" strokeWidth={viewBoxWidth * 0.001} fill="none" />
            <path d={gridLines.major.join(' ')} stroke="rgba(235, 106, 12, 0.28)" strokeWidth={viewBoxWidth * 0.002} fill="none" />
            <circle cx={0} cy={0} r={viewBoxWidth * 0.008} fill="#eb6a0c" opacity={0.5} />
          </g>
        )}

        <path d={pathD} fill="none" stroke="#eb6a0c" strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
        {holePaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#eb6a0c" strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
        ))}

        {type === 'rectangle' && cornerRadius > 0 && (
          <g stroke="#eb6a0c" strokeWidth={viewBoxWidth * 0.002} opacity={0.4}>
            <line x1={cornerRadius} y1={0} x2={cornerRadius} y2={cornerRadius * 0.3} />
            <line x1={0} y1={cornerRadius} x2={cornerRadius * 0.3} y2={cornerRadius} />
            <line x1={width - cornerRadius} y1={0} x2={width - cornerRadius} y2={cornerRadius * 0.3} />
            <line x1={width} y1={cornerRadius} x2={width - cornerRadius * 0.3} y2={cornerRadius} />
            <line x1={width - cornerRadius} y1={height} x2={width - cornerRadius} y2={height - cornerRadius * 0.3} />
            <line x1={width} y1={height - cornerRadius} x2={width - cornerRadius * 0.3} y2={height - cornerRadius} />
            <line x1={cornerRadius} y1={height} x2={cornerRadius} y2={height - cornerRadius * 0.3} />
            <line x1={0} y1={height - cornerRadius} x2={cornerRadius * 0.3} y2={height - cornerRadius} />
          </g>
        )}

        <g className="dimension-width">
          <line x1={0} y1={height + padding * 0.4} x2={width} y2={height + padding * 0.4} stroke="#a2a2a4" strokeWidth={viewBoxWidth * 0.002} markerStart="url(#arrowLeft)" markerEnd="url(#arrowRight)" />
          <text x={width / 2} y={height + padding * 0.4 + fontSize * 1.2} textAnchor="middle" fill="#a2a2a4" fontSize={fontSize} fontFamily="JetBrains Mono, monospace">
            {width} cm
          </text>
        </g>
        <g className="dimension-height">
          <line x1={width + padding * 0.4} y1={0} x2={width + padding * 0.4} y2={height} stroke="#a2a2a4" strokeWidth={viewBoxWidth * 0.002} markerStart="url(#arrowUp)" markerEnd="url(#arrowDown)" />
          <text x={width + padding * 0.4 + fontSize * 0.5} y={height / 2} textAnchor="start" dominantBaseline="middle" fill="#a2a2a4" fontSize={fontSize} fontFamily="JetBrains Mono, monospace" transform={`rotate(90, ${width + padding * 0.4 + fontSize * 0.5}, ${height / 2})`}>
            {height} cm
          </text>
        </g>

        {type === 'rectangle' && cornerRadius > 0 && (
          <text x={cornerRadius * 0.7} y={cornerRadius * 0.7} textAnchor="start" fill="#eb6a0c" fontSize={fontSize * 0.8} fontFamily="JetBrains Mono, monospace" opacity={0.7}>
            R{cornerRadius}
          </text>
        )}

        <defs>
          <marker id="arrowLeft" viewBox="0 0 10 10" refX="0" refY="5" markerWidth={arrowSize} markerHeight={arrowSize} orient="auto"><path d="M10,0 L0,5 L10,10" fill="none" stroke="#a2a2a4" strokeWidth="1.5" /></marker>
          <marker id="arrowRight" viewBox="0 0 10 10" refX="10" refY="5" markerWidth={arrowSize} markerHeight={arrowSize} orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="#a2a2a4" strokeWidth="1.5" /></marker>
          <marker id="arrowUp" viewBox="0 0 10 10" refX="5" refY="0" markerWidth={arrowSize} markerHeight={arrowSize} orient="auto"><path d="M0,10 L5,0 L10,10" fill="none" stroke="#a2a2a4" strokeWidth="1.5" /></marker>
          <marker id="arrowDown" viewBox="0 0 10 10" refX="5" refY="10" markerWidth={arrowSize} markerHeight={arrowSize} orient="auto"><path d="M0,0 L5,10 L10,0" fill="none" stroke="#a2a2a4" strokeWidth="1.5" /></marker>
        </defs>
      </svg>

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
        <span className="badge badge-green text-xs">{typeLabel}</span>
        {type === 'rectangle' && cornerRadius > 0 && <span className="badge badge-green text-xs">R = {cornerRadius} cm</span>}
        {hasHoles && <span className="badge badge-green text-xs">Otwory: {shape.holes.count}</span>}
      </div>
    </div>
  )
}
