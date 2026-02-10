import tinycolor from 'tinycolor2';
import { SingleLineTextHelper } from './SingleLineText';
import { SerializerOrParserFnProps } from '../column.interface';
import { parseProp } from '~/lib/helperFunctions';

export class ColorHelper extends SingleLineTextHelper {
  columnDefaultMeta = {
    colorFormat: 'hex', // 'hex' | 'rgb' | 'hsl' | 'hsv'
  };

  serializeValue(
    value: any,
    params: SerializerOrParserFnProps['params']
  ): string | null {
    if (!value) return null;

    const color = tinycolor(value);
    if (!color.isValid()) return value;

    const format = parseProp(params.col?.meta)?.colorFormat || 'hex';

    switch (format) {
      case 'rgb':
        return color.toRgbString(); // "rgb(255, 87, 51)"
      case 'hsl':
        return color.toHslString(); // "hsl(11, 100%, 60%)"
      case 'hsv':
        return color.toHsvString(); // "hsv(11, 80%, 100%)"
      default:
        return color.toHexString(); // "#ff5733"
    }
  }

  parsePlainCellValue(
    value: any,
    params: SerializerOrParserFnProps['params']
  ): string {
    return this.serializeValue(value, params) ?? '';
  }
}
