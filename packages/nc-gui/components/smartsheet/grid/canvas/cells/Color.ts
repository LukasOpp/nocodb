import tinycolor from 'tinycolor2'
import { renderMultiLineText, renderTagLabel } from '../utils/canvas'

export const ColorCellRenderer: CellRenderer = {
  render: (ctx, props) => {
    const {
      value,
      x,
      y,
      width,
      height,
      pv,
      padding,
      textColor = themeV4Colors.gray['600'],
      getColor,
      column,
    } = props

    const text = value?.toString() ?? ''

    if (!text) {
      return {
        x,
        y,
      }
    }

    const color = tinycolor(text)
    const isValidColor = color.isValid()

    if (props.tag?.renderAsTag) {
      return renderTagLabel(ctx, { ...props, text })
    }

    const swatchSize = 14
    const swatchGap = 6
    let currentX = x + padding

    // Draw color swatch if valid
    if (isValidColor) {
      const swatchX = currentX
      const swatchY = y + (height - swatchSize) / 2

      // Draw swatch background
      ctx.fillStyle = color.toHexString()
      ctx.beginPath()
      ctx.roundRect(swatchX, swatchY, swatchSize, swatchSize, 2)
      ctx.fill()

      // Draw swatch border
      ctx.strokeStyle = getColor('#ddd')
      ctx.lineWidth = 1
      ctx.stroke()

      currentX += swatchSize + swatchGap
    }

    // Format display value based on column meta
    let displayText = text
    if (isValidColor && column?.columnObj?.meta?.colorFormat) {
      const format = column.columnObj.meta.colorFormat
      switch (format) {
        case 'rgb':
          displayText = color.toRgbString()
          break
        case 'hsl':
          displayText = color.toHslString()
          break
        case 'hsv':
          displayText = color.toHsvString()
          break
        default:
          displayText = color.toHexString()
      }
    }

    // Render text
    const { x: xOffset, y: yOffset } = renderMultiLineText(ctx, {
      x: currentX,
      y,
      text: displayText,
      maxWidth: width - (currentX - x) - padding,
      fontFamily: `${pv ? 600 : 500} 13px Inter`,
      fillStyle: pv ? getColor(themeV4Colors.brand['500']) : getColor(textColor),
      height,
    })

    return {
      x: xOffset,
      y: yOffset,
    }
  },
  async handleKeyDown(ctx) {
    const { e, row, column, makeCellEditable } = ctx
    if (column.readonly || column.columnObj?.readonly) return false
    const columnObj = column.columnObj

    if (e.key.length === 1 && columnObj.title) {
      row.row[columnObj.title] = ''
      makeCellEditable(row, column)
      return true
    }

    return false
  },
}
