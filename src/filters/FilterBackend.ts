import { fabric } from '../../HEADER';
import { config } from '../config';
import { Canvas2dFilterBackend } from './2d_backend.class';
import { WebGLFilterBackend } from './webgl_backend.class';
import { webGLProbe } from './WebGLProbe';

export type FilterBackend = WebGLFilterBackend | Canvas2dFilterBackend;

let filterBackend: FilterBackend;

export function initFilterBackend(): FilterBackend {
  webGLProbe.queryWebGL();
  if (config.enableGLFiltering && webGLProbe.isSupported(config.textureSize)) {
    return new WebGLFilterBackend({ tileSize: config.textureSize });
  } else {
    return new Canvas2dFilterBackend();
  }
}

/**
 *
 * @param [strict] pass `true` to create the backend if it wasn't created yet (default behavior),
 * pass `false` to get the backend ref without mutating it
 */
export function getFilterBackend(strict = true): FilterBackend {
  if (!filterBackend && strict) {
    filterBackend = initFilterBackend();
  }
  return filterBackend;
}

fabric.getFilterBackend = getFilterBackend;
fabric.Canvas2dFilterBackend = Canvas2dFilterBackend;
fabric.WebglFilterBackend = WebGLFilterBackend;
fabric.initFilterBackend = initFilterBackend;
