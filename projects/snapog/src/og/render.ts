// Imog — OG image renderer
// Uses workers-og (Satori + resvg-wasm, CF Workers compatible)

import { ImageResponse } from 'workers-og';
import { buildElement } from './templates';
import type { OGParams } from '../types';

const DEFAULT_W = 1200;
const DEFAULT_H = 630;

export async function generateOGImage(
  params: OGParams,
  watermark: boolean
): Promise<Response> {
  const element = buildElement(params, watermark);

  // PlaceholdOG passes w/h; existing SnapOG routes fall back to 1200×630.
  const width = params.w ?? DEFAULT_W;
  const height = params.h ?? DEFAULT_H;

  // ponytail: workers-og ships VNode but ImageResponse ctor is typed ReactNode — runtime fine, types gap
  const response = new ImageResponse(element as any, {
    width,
    height,
  });

  return response;
}

// Build a deterministic cache key from OG params
export async function buildCacheKey(params: OGParams, watermark: boolean): Promise<string> {
  const sorted = JSON.stringify(
    Object.fromEntries(
      Object.entries({ ...params, watermark }).sort(([a], [b]) => a.localeCompare(b))
    )
  );
  const encoder = new TextEncoder();
  const data = encoder.encode(sorted);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
