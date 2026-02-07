/**
 * Generate SVG path for rectangle with optional rounded corners
 */
function rectanglePath(shape) {
  const { width, height, cornerRadius } = shape
  const r = Math.min(cornerRadius, Math.min(width, height) / 2)

  if (r <= 0) {
    return `M0,0 L${width},0 L${width},${height} L0,${height} Z`
  }

  return `
    M${r},0
    L${width - r},0
    Q${width},0 ${width},${r}
    L${width},${height - r}
    Q${width},${height} ${width - r},${height}
    L${r},${height}
    Q0,${height} 0,${height - r}
    L0,${r}
    Q0,0 ${r},0
    Z
  `.replace(/\s+/g, ' ').trim()
}

/**
 * Circle path: center (r,r), radius r, diameter = width (cm).
 * SVG full circle = two arcs of 180° each: (cx+r,cy) → (cx-r,cy) → (cx+r,cy)
 */
function circlePath(shape) {
  const d = shape.width || shape.diameter || 10
  const r = d / 2
  const cx = r
  const cy = r
  return `M ${cx + r},${cy} A ${r},${r} 0 1 1 ${cx - r},${cy} A ${r},${r} 0 1 1 ${cx + r},${cy}`
}

/**
 * Ellipse path: center (rx,ry), radii rx, ry; width = 2*rx, height = 2*ry (cm).
 * Full ellipse = two arcs: (cx+rx,cy) → (cx-rx,cy) → (cx+rx,cy)
 */
function ellipsePath(shape) {
  const w = shape.width || 20
  const h = shape.height || 15
  const rx = w / 2
  const ry = h / 2
  const cx = rx
  const cy = ry
  return `M ${cx + rx},${cy} A ${rx},${ry} 0 1 1 ${cx - rx},${cy} A ${rx},${ry} 0 1 1 ${cx + rx},${cy}`
}

const MAX_HOLES = 16

/** Evenly distributed angles for n holes (degrees, 0 = right, clockwise) */
function holeAngles(n) {
  return Array.from({ length: n }, (_, i) => (360 * i) / n)
}

/**
 * Hole positions for rectangle/square (along inner perimeter), circle and ellipse (on perimeter).
 */
export function getHolePositions(shape) {
  const holes = shape.holes || {}
  if (!holes.enabled || !holes.count) return []
  const type = shape.type || 'rectangle'
  const count = Math.min(MAX_HOLES, Math.max(1, holes.count || 1))
  const d = holes.diameter ?? 0.6
  const r = d / 2

  if (type === 'circle') {
    const width = shape.width || 10
    const R = width / 2
    const cx = R
    const cy = R
    const fromEdge = holes.fromEdgeX ?? 2
    const holeRadius = Math.max(0, R - fromEdge)
    const angles = holeAngles(count)
    return angles.map((deg) => {
      const rad = (deg * Math.PI) / 180
      const x = cx + holeRadius * Math.cos(rad)
      const y = cy + holeRadius * Math.sin(rad)
      return { x, y, r }
    })
  }

  if (type === 'ellipse') {
    const w = shape.width || 20
    const h = shape.height || 15
    const rx = w / 2
    const ry = h / 2
    const cx = rx
    const cy = ry
    const fx = holes.fromEdgeX ?? 2
    const fy = holes.fromEdgeY ?? 2
    const angles = holeAngles(count)
    return angles.map((deg) => {
      const rad = (deg * Math.PI) / 180
      const x = cx + (rx - fx) * Math.cos(rad)
      const y = cy + (ry - fy) * Math.sin(rad)
      return { x, y, r }
    })
  }

  // rectangle / square: distribute holes along inner perimeter (clockwise from top-left)
  const { width, height } = shape
  const fx = holes.fromEdgeX ?? 2
  const fy = holes.fromEdgeY ?? 2
  const w = Math.max(0, width - 2 * fx)
  const h = Math.max(0, height - 2 * fy)
  const perim = 2 * w + 2 * h
  if (perim <= 0) return []
  const positions = []
  for (let i = 0; i < count; i++) {
    const p = (i * perim) / count
    let x, y
    if (p < w) {
      x = fx + p
      y = fy
    } else if (p < w + h) {
      x = width - fx
      y = fy + (p - w)
    } else if (p < 2 * w + h) {
      x = width - fx - (p - w - h)
      y = height - fy
    } else {
      x = fx
      y = height - fy - (p - 2 * w - h)
    }
    positions.push({ x, y, r })
  }
  return positions
}

/** Hole circle: (x, y) = center of hole, r = radius */
function holePathString(x, y, r) {
  return `M ${x + r},${y} A ${r},${r} 0 1 1 ${x - r},${y} A ${r},${r} 0 1 1 ${x + r},${y}`
}

/**
 * Generate main SVG path(s) for shape
 * @param {Object} shape - Shape configuration
 * @returns {{ main: string, holes: string[] }}
 */
export function generateSvgPath(shape) {
  const type = shape.type || 'rectangle'

  let main = ''
  if (type === 'circle') {
    main = circlePath(shape)
  } else if (type === 'ellipse') {
    main = ellipsePath(shape)
  } else {
    main = rectanglePath(shape)
  }

  const holes = getHolePositions(shape)
  const holePaths = holes.map(({ x, y, r }) => holePathString(x, y, r))

  return { main, holePaths }
}

/**
 * Legacy: single path (main only, for backward compat in SvgPreview)
 */
export function getMainPathD(shape) {
  const { main } = generateSvgPath(shape)
  return main
}

/**
 * Generate complete SVG file content
 */
export function generateSvgFile(shape) {
  const type = shape.type || 'rectangle'
  const width = type === 'circle' || type === 'square' ? (shape.width || 10) : (shape.width || 20)
  const height = type === 'circle' || type === 'square' ? (shape.width || 10) : (shape.height || 15)
  const { main, holePaths } = generateSvgPath(shape)
  const strokeW = shape.strokeWidth ?? 0.1

  const widthMm = width * 10
  const heightMm = height * 10

  const pathEls = [
    `<path d="${main}" fill="none" stroke="#000000" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>`
  ]
  holePaths.forEach(d => {
    pathEls.push(`<path d="${d}" fill="none" stroke="#000000" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>`)
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${widthMm}mm" 
     height="${heightMm}mm" 
     viewBox="0 0 ${width} ${height}">
  <title>Folplex Vector - ${width}x${height}cm</title>
  <desc>Generated by Folplex Vector for CNC machining</desc>
  <metadata>
    <folplex:info xmlns:folplex="http://folplex.pl/vector">
      <folplex:type>${type}</folplex:type>
      <folplex:unit>cm</folplex:unit>
      <folplex:width>${width}</folplex:width>
      <folplex:height>${height}</folplex:height>
      <folplex:cornerRadius>${shape.cornerRadius ?? 0}</folplex:cornerRadius>
    </folplex:info>
  </metadata>
  ${pathEls.join('\n  ')}
</svg>`
}

/**
 * Generate SVG element for embedding (for PDF export)
 */
export function generateSvgElement(shape) {
  const type = shape.type || 'rectangle'
  const width = type === 'circle' || type === 'square' ? (shape.width || 10) : (shape.width || 20)
  const height = type === 'circle' || type === 'square' ? (shape.width || 10) : (shape.height || 15)
  const { main, holePaths } = generateSvgPath(shape)
  const strokeW = shape.strokeWidth ?? 0.1

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('width', `${width * 10}mm`)
  svg.setAttribute('height', `${height * 10}mm`)
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', main)
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', '#000000')
  path.setAttribute('stroke-width', String(strokeW))
  path.setAttribute('stroke-linecap', 'round')
  path.setAttribute('stroke-linejoin', 'round')
  svg.appendChild(path)

  holePaths.forEach(d => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    p.setAttribute('d', d)
    p.setAttribute('fill', 'none')
    p.setAttribute('stroke', '#000000')
    p.setAttribute('stroke-width', String(strokeW))
    p.setAttribute('stroke-linecap', 'round')
    p.setAttribute('stroke-linejoin', 'round')
    svg.appendChild(p)
  })

  return svg
}

/**
 * Get export filename from shape (Nr ZK or fallback: folplex-WxHcm)
 */
export function getExportFilename(shape, ext) {
  const base = (shape.nrZk || '').trim()
  const safe = base.replace(/[^\w\-_.]/g, '_').slice(0, 80) || null
  const type = shape.type || 'rectangle'
  const w = type === 'circle' || type === 'square' ? (shape.width || 10) : (shape.width || 20)
  const h = type === 'circle' || type === 'square' ? (shape.width || 10) : (shape.height || 15)
  const fallback = `folplex-${w}x${h}cm`
  const name = safe || fallback
  return `${name}.${ext}`
}

/**
 * Download file utility
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
