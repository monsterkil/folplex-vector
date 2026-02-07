import { jsPDF } from 'jspdf'
import { generateSvgPath, getHolePositions } from './generateSvg'

/**
 * Export shape to PDF (A4 format)
 * @param {Object} shape - Shape configuration
 * @param {string} [filename] - Optional filename (e.g. from Nr ZK)
 */
export async function exportToPdf(shape, filename) {
  const type = shape.type || 'rectangle'
  const width = type === 'circle' || type === 'square' ? (shape.width || 10) : (shape.width || 20)
  const height = type === 'circle' || type === 'square' ? (shape.width || 10) : (shape.height || 15)
  const cornerRadius = shape.cornerRadius ?? 0

  const A4_WIDTH = 210
  const A4_HEIGHT = 297
  const shapeWidthMm = width * 10
  const shapeHeightMm = height * 10

  const isLandscape = shapeWidthMm > shapeHeightMm && shapeWidthMm > A4_WIDTH - 40
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = isLandscape ? A4_HEIGHT : A4_WIDTH
  const pageHeight = isLandscape ? A4_WIDTH : A4_HEIGHT
  const margin = 20
  const maxWidth = pageWidth - margin * 2
  const maxHeight = pageHeight - margin * 2 - 30

  const scale = Math.min(maxWidth / shapeWidthMm, maxHeight / shapeHeightMm, 1)
  const scaledWidth = shapeWidthMm * scale
  const scaledHeight = shapeHeightMm * scale
  const offsetX = (pageWidth - scaledWidth) / 2
  const offsetY = margin + 20

  pdf.setFontSize(14)
  pdf.setTextColor(0, 0, 0)
  pdf.text('Folplex Vector', margin, margin)

  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  const typeLabel = type === 'circle' ? 'Koło' : type === 'ellipse' ? 'Elipsa' : 'Prostokąt'
  pdf.text(
    `${typeLabel} | ${width} × ${height} cm${cornerRadius > 0 ? ` | Zaokrąglenie: ${cornerRadius} cm` : ''}`,
    margin,
    margin + 6
  )

  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.3)

  if (type === 'circle') {
    const cx = offsetX + scaledWidth / 2
    const cy = offsetY + scaledHeight / 2
    const r = scaledWidth / 2
    pdf.ellipse(cx, cy, r, r, 'S')
  } else if (type === 'ellipse') {
    const cx = offsetX + scaledWidth / 2
    const cy = offsetY + scaledHeight / 2
    const rx = scaledWidth / 2
    const ry = scaledHeight / 2
    pdf.ellipse(cx, cy, rx, ry, 'S')
  } else {
    if (cornerRadius <= 0) {
      pdf.rect(offsetX, offsetY, scaledWidth, scaledHeight, 'S')
    } else {
      const r = Math.min(cornerRadius * 10 * scale, Math.min(scaledWidth, scaledHeight) / 2)
      drawRoundedRect(pdf, offsetX, offsetY, scaledWidth, scaledHeight, r)
    }
  }

  // Holes (rectangle and square)
  if (type === 'rectangle' || type === 'square') {
    const holes = getHolePositions(shape)
    holes.forEach(({ x, y, r }) => {
      const cx = offsetX + x * 10 * scale
      const cy = offsetY + y * 10 * scale
      const sr = r * 10 * scale
      pdf.ellipse(cx, cy, sr, sr, 'S')
    })
  }

  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  const dimY = offsetY + scaledHeight + 8
  pdf.line(offsetX, dimY, offsetX + scaledWidth, dimY)
  pdf.line(offsetX, dimY - 2, offsetX, dimY + 2)
  pdf.line(offsetX + scaledWidth, dimY - 2, offsetX + scaledWidth, dimY + 2)
  pdf.text(`${width} cm`, offsetX + scaledWidth / 2, dimY + 5, { align: 'center' })

  const dimX = offsetX + scaledWidth + 8
  pdf.line(dimX, offsetY, dimX, offsetY + scaledHeight)
  pdf.line(dimX - 2, offsetY, dimX + 2, offsetY)
  pdf.line(dimX - 2, offsetY + scaledHeight, dimX + 2, offsetY + scaledHeight)
  pdf.text(`${height} cm`, dimX + 4, offsetY + scaledHeight / 2, { angle: 90 })

  pdf.setFontSize(7)
  pdf.setTextColor(150, 150, 150)
  const date = new Date().toLocaleDateString('pl-PL')
  pdf.text(`Wygenerowano: ${date} | Skala: ${scale === 1 ? '1:1' : `${(scale * 100).toFixed(0)}%`}`, margin, pageHeight - margin)

  if (scale < 1) {
    pdf.setTextColor(200, 100, 100)
    pdf.text('UWAGA: Rysunek przeskalowany, aby zmieścić się na stronie', pageWidth - margin, pageHeight - margin, { align: 'right' })
  }

  const defaultName = `folplex-${width}x${height}cm.pdf`
  pdf.save(filename || defaultName)
}

function drawRoundedRect(pdf, x, y, w, h, r) {
  pdf.moveTo(x + r, y)
  pdf.lineTo(x + w - r, y)
  pdf.curveTo(x + w, y, x + w, y + r)
  pdf.lineTo(x + w, y + h - r)
  pdf.curveTo(x + w, y + h, x + w - r, y + h)
  pdf.lineTo(x + r, y + h)
  pdf.curveTo(x, y + h, x, y + h - r)
  pdf.lineTo(x, y + r)
  pdf.curveTo(x, y, x + r, y)
  pdf.stroke()
}
