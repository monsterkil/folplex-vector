import { useMemo } from 'react'
import { generateSvgPath } from '../utils/generateSvg'

export default function SvgPreview({ shape, showGrid }) {
  const { width, height, cornerRadius } = shape

  // Calculate viewBox with padding
  const padding = Math.max(width, height) * 0.15
  const viewBoxWidth = width + padding * 2
  const viewBoxHeight = height + padding * 2

  // Generate the path
  const pathD = useMemo(() => generateSvgPath(shape), [shape])

  // Grid settings (1cm = 1 unit in SVG)
  const gridSize = 1 // 1 cm
  const majorGridSize = 5 // 5 cm

  // Calculate grid lines
  const gridLines = useMemo(() => {
    if (!showGrid) return { minor: [], major: [] }

    const minor = []
    const major = []
    
    const startX = -padding
    const endX = width + padding
    const startY = -padding
    const endY = height + padding

    // Vertical lines
    for (let x = Math.floor(startX); x <= Math.ceil(endX); x += gridSize) {
      if (x % majorGridSize === 0) {
        major.push(`M${x},${startY} L${x},${endY}`)
      } else {
        minor.push(`M${x},${startY} L${x},${endY}`)
      }
    }

    // Horizontal lines
    for (let y = Math.floor(startY); y <= Math.ceil(endY); y += gridSize) {
      if (y % majorGridSize === 0) {
        major.push(`M${startX},${y} L${endX},${y}`)
      } else {
        minor.push(`M${startX},${y} L${endX},${y}`)
      }
    }

    return { minor, major }
  }, [width, height, padding, showGrid])

  // Dimension labels
  const fontSize = Math.max(viewBoxWidth, viewBoxHeight) * 0.04
  const arrowSize = fontSize * 0.5

  return (
    <div className="relative w-full aspect-[4/3] bg-steel-800/30 rounded-lg overflow-hidden border border-steel-700/50">
      <svg
        viewBox={`${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect
          x={-padding}
          y={-padding}
          width={viewBoxWidth}
          height={viewBoxHeight}
          fill="#0f172a"
        />

        {/* Grid */}
        {showGrid && (
          <g>
            {/* Minor grid lines */}
            <path
              d={gridLines.minor.join(' ')}
              stroke="rgba(34, 197, 94, 0.1)"
              strokeWidth={viewBoxWidth * 0.001}
              fill="none"
            />
            {/* Major grid lines */}
            <path
              d={gridLines.major.join(' ')}
              stroke="rgba(34, 197, 94, 0.25)"
              strokeWidth={viewBoxWidth * 0.002}
              fill="none"
            />
            {/* Origin marker */}
            <circle
              cx={0}
              cy={0}
              r={viewBoxWidth * 0.008}
              fill="#22c55e"
              opacity={0.5}
            />
          </g>
        )}

        {/* Shape */}
        <path
          d={pathD}
          fill="none"
          stroke="#22c55e"
          strokeWidth={viewBoxWidth * 0.005}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Corner radius indicators */}
        {cornerRadius > 0 && (
          <g stroke="#22c55e" strokeWidth={viewBoxWidth * 0.002} opacity={0.4}>
            {/* Top-left */}
            <line x1={cornerRadius} y1={0} x2={cornerRadius} y2={cornerRadius * 0.3} />
            <line x1={0} y1={cornerRadius} x2={cornerRadius * 0.3} y2={cornerRadius} />
            
            {/* Top-right */}
            <line x1={width - cornerRadius} y1={0} x2={width - cornerRadius} y2={cornerRadius * 0.3} />
            <line x1={width} y1={cornerRadius} x2={width - cornerRadius * 0.3} y2={cornerRadius} />
            
            {/* Bottom-right */}
            <line x1={width - cornerRadius} y1={height} x2={width - cornerRadius} y2={height - cornerRadius * 0.3} />
            <line x1={width} y1={height - cornerRadius} x2={width - cornerRadius * 0.3} y2={height - cornerRadius} />
            
            {/* Bottom-left */}
            <line x1={cornerRadius} y1={height} x2={cornerRadius} y2={height - cornerRadius * 0.3} />
            <line x1={0} y1={height - cornerRadius} x2={cornerRadius * 0.3} y2={height - cornerRadius} />
          </g>
        )}

        {/* Dimension - Width */}
        <g className="dimension-width">
          <line
            x1={0}
            y1={height + padding * 0.4}
            x2={width}
            y2={height + padding * 0.4}
            stroke="#94a3b8"
            strokeWidth={viewBoxWidth * 0.002}
            markerStart="url(#arrowLeft)"
            markerEnd="url(#arrowRight)"
          />
          <text
            x={width / 2}
            y={height + padding * 0.4 + fontSize * 1.2}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={fontSize}
            fontFamily="JetBrains Mono, monospace"
          >
            {width} cm
          </text>
        </g>

        {/* Dimension - Height */}
        <g className="dimension-height">
          <line
            x1={width + padding * 0.4}
            y1={0}
            x2={width + padding * 0.4}
            y2={height}
            stroke="#94a3b8"
            strokeWidth={viewBoxWidth * 0.002}
            markerStart="url(#arrowUp)"
            markerEnd="url(#arrowDown)"
          />
          <text
            x={width + padding * 0.4 + fontSize * 0.5}
            y={height / 2}
            textAnchor="start"
            dominantBaseline="middle"
            fill="#94a3b8"
            fontSize={fontSize}
            fontFamily="JetBrains Mono, monospace"
            transform={`rotate(90, ${width + padding * 0.4 + fontSize * 0.5}, ${height / 2})`}
          >
            {height} cm
          </text>
        </g>

        {/* Corner radius label */}
        {cornerRadius > 0 && (
          <text
            x={cornerRadius * 0.7}
            y={cornerRadius * 0.7}
            textAnchor="start"
            fill="#22c55e"
            fontSize={fontSize * 0.8}
            fontFamily="JetBrains Mono, monospace"
            opacity={0.7}
          >
            R{cornerRadius}
          </text>
        )}

        {/* Arrow markers */}
        <defs>
          <marker
            id="arrowLeft"
            viewBox="0 0 10 10"
            refX="0"
            refY="5"
            markerWidth={arrowSize}
            markerHeight={arrowSize}
            orient="auto"
          >
            <path d="M10,0 L0,5 L10,10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </marker>
          <marker
            id="arrowRight"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth={arrowSize}
            markerHeight={arrowSize}
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </marker>
          <marker
            id="arrowUp"
            viewBox="0 0 10 10"
            refX="5"
            refY="0"
            markerWidth={arrowSize}
            markerHeight={arrowSize}
            orient="auto"
          >
            <path d="M0,10 L5,0 L10,10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </marker>
          <marker
            id="arrowDown"
            viewBox="0 0 10 10"
            refX="5"
            refY="10"
            markerWidth={arrowSize}
            markerHeight={arrowSize}
            orient="auto"
          >
            <path d="M0,0 L5,10 L10,0" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>

      {/* Info overlay */}
      <div className="absolute bottom-3 left-3 flex gap-2">
        <span className="badge badge-green text-xs">
          {shape.isSquare ? 'Kwadrat' : 'Prostokąt'}
        </span>
        {cornerRadius > 0 && (
          <span className="badge badge-green text-xs">
            R = {cornerRadius} cm
          </span>
        )}
      </div>
    </div>
  )
}
