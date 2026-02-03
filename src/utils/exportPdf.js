import { jsPDF } from 'jspdf'
import { generateSvgPath } from './generateSvg'

/**
 * Export shape to PDF (A4 format)
 * @param {Object} shape - Shape configuration
 */
export async function exportToPdf(shape) {
  const { width, height, cornerRadius } = shape
  
  // A4 dimensions in mm
  const A4_WIDTH = 210
  const A4_HEIGHT = 297
  
  // Convert cm to mm
  const shapeWidthMm = width * 10
  const shapeHeightMm = height * 10
  
  // Create PDF (A4, portrait or landscape based on shape)
  const isLandscape = shapeWidthMm > shapeHeightMm && shapeWidthMm > A4_WIDTH - 40
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  const pageWidth = isLandscape ? A4_HEIGHT : A4_WIDTH
  const pageHeight = isLandscape ? A4_WIDTH : A4_HEIGHT
  
  // Calculate scale to fit on page with margins (20mm on each side)
  const margin = 20
  const maxWidth = pageWidth - margin * 2
  const maxHeight = pageHeight - margin * 2 - 30 // Extra space for title
  
  const scale = Math.min(
    maxWidth / shapeWidthMm,
    maxHeight / shapeHeightMm,
    1 // Don't scale up, only down if needed
  )
  
  const scaledWidth = shapeWidthMm * scale
  const scaledHeight = shapeHeightMm * scale
  
  // Center the shape
  const offsetX = (pageWidth - scaledWidth) / 2
  const offsetY = margin + 20 // Space for title
  
  // Add title
  pdf.setFontSize(14)
  pdf.setTextColor(0, 0, 0)
  pdf.text('Folplex Vector', margin, margin)
  
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  pdf.text(
    `Wymiary: ${width} × ${height} cm${cornerRadius > 0 ? ` | Zaokrąglenie: ${cornerRadius} cm` : ''}`,
    margin,
    margin + 6
  )
  
  // Draw the shape
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.3)
  
  if (cornerRadius <= 0) {
    // Simple rectangle
    pdf.rect(offsetX, offsetY, scaledWidth, scaledHeight, 'S')
  } else {
    // Rectangle with rounded corners
    const r = Math.min(cornerRadius * 10 * scale, Math.min(scaledWidth, scaledHeight) / 2)
    drawRoundedRect(pdf, offsetX, offsetY, scaledWidth, scaledHeight, r)
  }
  
  // Add dimensions
  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  
  // Width dimension (below shape)
  const dimY = offsetY + scaledHeight + 8
  pdf.line(offsetX, dimY, offsetX + scaledWidth, dimY)
  pdf.line(offsetX, dimY - 2, offsetX, dimY + 2)
  pdf.line(offsetX + scaledWidth, dimY - 2, offsetX + scaledWidth, dimY + 2)
  pdf.text(`${width} cm`, offsetX + scaledWidth / 2, dimY + 5, { align: 'center' })
  
  // Height dimension (right of shape)
  const dimX = offsetX + scaledWidth + 8
  pdf.line(dimX, offsetY, dimX, offsetY + scaledHeight)
  pdf.line(dimX - 2, offsetY, dimX + 2, offsetY)
  pdf.line(dimX - 2, offsetY + scaledHeight, dimX + 2, offsetY + scaledHeight)
  
  // Rotate text for height
  pdf.text(`${height} cm`, dimX + 4, offsetY + scaledHeight / 2, { angle: 90 })
  
  // Footer
  pdf.setFontSize(7)
  pdf.setTextColor(150, 150, 150)
  const date = new Date().toLocaleDateString('pl-PL')
  pdf.text(`Wygenerowano: ${date} | Skala: ${scale === 1 ? '1:1' : `${(scale * 100).toFixed(0)}%`}`, margin, pageHeight - margin)
  
  // Scale indicator if not 1:1
  if (scale < 1) {
    pdf.setTextColor(200, 100, 100)
    pdf.text('UWAGA: Rysunek przeskalowany, aby zmieścić się na stronie', pageWidth - margin, pageHeight - margin, { align: 'right' })
  }
  
  // Download
  const filename = `folplex-${width}x${height}cm.pdf`
  pdf.save(filename)
}

/**
 * Draw rounded rectangle using jsPDF
 */
function drawRoundedRect(pdf, x, y, w, h, r) {
  // Start from top-left, after the corner radius
  pdf.moveTo(x + r, y)
  
  // Top edge
  pdf.lineTo(x + w - r, y)
  
  // Top-right corner
  pdf.curveTo(x + w, y, x + w, y + r)
  
  // Right edge
  pdf.lineTo(x + w, y + h - r)
  
  // Bottom-right corner
  pdf.curveTo(x + w, y + h, x + w - r, y + h)
  
  // Bottom edge
  pdf.lineTo(x + r, y + h)
  
  // Bottom-left corner
  pdf.curveTo(x, y + h, x, y + h - r)
  
  // Left edge
  pdf.lineTo(x, y + r)
  
  // Top-left corner
  pdf.curveTo(x, y, x + r, y)
  
  // Stroke the path
  pdf.stroke()
}
