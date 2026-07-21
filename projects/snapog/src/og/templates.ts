// SnapOG — OG image element templates
// Returns plain objects compatible with workers-og / satori

import type { OGParams } from '../types';

type StyleObject = Record<string, string | number | undefined>;

type VNode = {
  type: string;
  props: {
    style?: StyleObject;
    children?: unknown;
    [key: string]: unknown;
  };
};

// Named-color map for the PlaceholdOG route. Unknown strings fall back to default.
// ponytail: static literal map — append colors here, no abstraction needed.
const NAMED_COLORS: Record<string, string> = {
  indigo: '#6366F1',
  slate: '#64748B',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  white: '#FFFFFF',
  black: '#000000',
  blue: '#3B82F6',
};

function resolveColor(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  const named = NAMED_COLORS[raw.toLowerCase()];
  if (named) return named;
  if (/^#[0-9a-f]{3,8}$/i.test(raw)) return raw;
  return fallback;
}

// PlaceholdOG template — solid bg, centered text, bottom-right "PlaceholdOG" label.
// ponytail: label baked into the template (standalone brand per critic condition #1)
// rather than threaded via the post-render watermark path — shorter diff, and the
// existing Footer() watermark string is the parent product's, not ours.
function placeholderTemplate(params: OGParams, watermark: boolean): VNode {
  const w = params.w ?? 1200;
  const h = params.h ?? 630;
  const text = params.text ?? params.title ?? `${w}×${h}`;
  const bg = resolveColor(params.bg, '#0f172a');
  const fg = resolveColor(params.fg, '#e2e8f0');
  const minDim = Math.min(w, h);
  const fontSize = Math.max(14, Math.round(minDim / 12));
  const labelSize = Math.max(10, Math.round(fontSize / 3));
  const pad = Math.max(8, Math.round(minDim / 40));
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: bg,
        position: 'relative',
        fontFamily: '"Noto Sans", sans-serif',
        padding: `${pad}px`,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              fontSize: `${fontSize}px`,
              color: fg,
              fontWeight: '600',
              textAlign: 'center',
              letterSpacing: '-0.01em',
              wordBreak: 'break-word',
              maxWidth: '90%',
            },
            children: text,
          },
        },
        ...(watermark
          ? [{
              type: 'div',
              props: {
                style: {
                  position: 'absolute',
                  bottom: `${pad}px`,
                  right: `${pad}px`,
                  fontSize: `${labelSize}px`,
                  color: fg,
                  opacity: '0.5',
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                },
                children: 'PlaceholdOG',
              },
            }]
          : []),
      ],
    },
  };
}

// XML escape for inline text in hand-built SVG. Placeholders only take a single
// short text line (≤60 chars, validated upstream) so attribute + body escaping here
// is the whole injection surface.
function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, ch =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[ch] as string)
  );
}

// PlaceholdOG SVG — string template, no WASM render. Crisp at any size, which is
// the differentiator vs placehold.co's raster PNGs. ~0.1ms to build, so we skip
// R2 and rely on edge Cache-Control (s-maxage) for distribution: a MISS costs
// near-zero CPU, unlike workers-og's ~50ms PNG render.
// ponytail: same visual contract as placeholderTemplate() (bg + centered text +
// bottom-right label) so PNG and SVG look identical at the same dims.
export function placeholderSvg(params: OGParams, watermark: boolean): string {
  const w = params.w ?? 1200;
  const h = params.h ?? 630;
  const text = escapeXml(params.text ?? params.title ?? `${w}×${h}`);
  const bg = resolveColor(params.bg, '#0f172a');
  const fg = resolveColor(params.fg, '#e2e8f0');
  const minDim = Math.min(w, h);
  const fontSize = Math.max(14, Math.round(minDim / 12));
  const labelSize = Math.max(10, Math.round(fontSize / 3));
  const pad = Math.max(8, Math.round(minDim / 40));
  const label = watermark
    ? `<text x="${w - pad}" y="${h - pad}" text-anchor="end" font-size="${labelSize}" fill="${fg}" fill-opacity="0.5" font-family="monospace" letter-spacing="2">PlaceholdOG</text>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${text}"><rect width="${w}" height="${h}" fill="${bg}"/><text x="${w / 2}" y="${h / 2}" text-anchor="middle" dominant-baseline="central" font-size="${fontSize}" fill="${fg}" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="600">${text}</text>${label}</svg>`;
}

// Accent bar — left edge visual anchor
function AccentBar(color: string): VNode {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '6px',
        height: '100%',
        backgroundColor: color,
      },
      children: null,
    },
  };
}

// Header row: domain on left, tag pill on right
function Header(domain: string | undefined, tag: string | undefined, accent: string, surface: string, primary: string): VNode {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '48px',
        width: '100%',
      },
      children: [
        domain
          ? {
              type: 'div',
              props: {
                style: {
                  fontSize: '18px',
                  color: accent,
                  fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                },
                children: domain,
              },
            }
          : { type: 'div', props: { style: { width: '1px' }, children: null } },
        tag
          ? {
              type: 'div',
              props: {
                style: {
                  fontSize: '13px',
                  color: primary,
                  backgroundColor: surface,
                  padding: '6px 16px',
                  borderRadius: '100px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.04em',
                },
                children: tag,
              },
            }
          : { type: 'div', props: { style: { width: '1px' }, children: null } },
      ],
    },
  };
}

// Footer row: author on left, watermark on right
function Footer(
  author: string | undefined,
  watermark: boolean,
  secondary: string
): VNode {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '48px',
        width: '100%',
      },
      children: [
        author
          ? {
              type: 'div',
              props: {
                style: {
                  fontSize: '18px',
                  color: secondary,
                  fontFamily: 'monospace',
                },
                children: `— ${author}`,
              },
            }
          : { type: 'div', props: { style: { width: '1px' }, children: null } },
        watermark
          ? {
              type: 'div',
              props: {
                style: {
                  fontSize: '14px',
                  color: secondary,
                  fontFamily: 'monospace',
                  opacity: '0.55',
                  letterSpacing: '0.06em',
                },
                children: 'SnapOG',
              },
            }
          : { type: 'div', props: { style: { width: '1px' }, children: null } },
      ],
    },
  };
}

// Default template — general purpose
function defaultTemplate(params: OGParams, watermark: boolean): VNode {
  const { title, description, domain, author, tag, theme = 'dark' } = params;
  const isDark = theme === 'dark';

  const bg = isDark ? '#0A0A0A' : '#FAFAFA';
  const primary = isDark ? '#F5F5F5' : '#0A0A0A';
  const secondary = isDark ? '#737373' : '#737373';
  const accent = '#F59E0B';
  const surface = isDark ? '#1A1A1A' : '#E8E8E8';

  const fontSize = title.length > 60 ? '42px' : title.length > 40 ? '52px' : '62px';

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: bg,
        padding: '64px 72px 64px 84px',
        position: 'relative',
        fontFamily: '"Noto Sans", sans-serif',
      },
      children: [
        AccentBar(accent),
        Header(domain, tag, accent, surface, primary),
        // Title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flex: '1',
              fontSize,
              fontWeight: '700',
              color: primary,
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
            },
            children: title,
          },
        },
        // Description
        ...(description
          ? [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '22px',
                    color: secondary,
                    marginTop: '24px',
                    lineHeight: '1.5',
                    maxWidth: '900px',
                  },
                  children: description,
                },
              },
            ]
          : []),
        Footer(author, watermark, secondary),
      ],
    },
  };
}

// Blog template — date-focused, editorial feel
function blogTemplate(params: OGParams, watermark: boolean): VNode {
  const { title, description, domain, author, tag, theme = 'dark' } = params;
  const isDark = theme === 'dark';

  const bg = isDark ? '#0D0D0D' : '#FFFFFF';
  const primary = isDark ? '#FAFAFA' : '#111111';
  const secondary = isDark ? '#6B7280' : '#6B7280';
  const accent = '#F59E0B';
  const surface = isDark ? '#1F1F1F' : '#F3F4F6';

  const fontSize = title.length > 55 ? '44px' : title.length > 35 ? '54px' : '64px';

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: bg,
        padding: '72px 80px',
        position: 'relative',
        fontFamily: '"Noto Serif", serif',
      },
      children: [
        // Top band
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              backgroundColor: accent,
            },
            children: null,
          },
        },
        // Site label + tag
        Header(domain, tag, accent, surface, primary),
        // Title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flex: '1',
              fontSize,
              fontWeight: '700',
              color: primary,
              lineHeight: '1.2',
              letterSpacing: '-0.01em',
            },
            children: title,
          },
        },
        // Description
        ...(description
          ? [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '21px',
                    color: secondary,
                    marginTop: '28px',
                    lineHeight: '1.6',
                    fontStyle: 'italic',
                  },
                  children: description,
                },
              },
            ]
          : []),
        Footer(author, watermark, secondary),
      ],
    },
  };
}

// Article template — minimal, high-contrast, magazine aesthetic
function articleTemplate(params: OGParams, watermark: boolean): VNode {
  const { title, description, domain, author, tag, theme = 'dark' } = params;
  const isDark = theme === 'dark';

  const bg = isDark ? '#111111' : '#F8F8F8';
  const primary = isDark ? '#FFFFFF' : '#111111';
  const secondary = isDark ? '#9CA3AF' : '#4B5563';
  const accent = '#F59E0B';
  const _surface = isDark ? '#222222' : '#E5E7EB';
  void _surface;
  const divider = isDark ? '#2A2A2A' : '#D1D5DB';

  const fontSize = title.length > 60 ? '40px' : title.length > 40 ? '50px' : '60px';

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: bg,
        padding: '60px 72px',
        position: 'relative',
        fontFamily: '"Noto Sans", sans-serif',
      },
      children: [
        // Category row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
            },
            children: [
              tag
                ? {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '12px',
                        fontWeight: '700',
                        color: accent,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                      },
                      children: tag,
                    },
                  }
                : { type: 'div', props: { style: { width: '1px' }, children: null } },
              domain
                ? {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '12px',
                        color: secondary,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                      },
                      children: `• ${domain}`,
                    },
                  }
                : { type: 'div', props: { style: { width: '1px' }, children: null } },
            ],
          },
        },
        // Divider
        {
          type: 'div',
          props: {
            style: {
              width: '48px',
              height: '3px',
              backgroundColor: accent,
              marginBottom: '32px',
            },
            children: null,
          },
        },
        // Title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flex: '1',
              fontSize,
              fontWeight: '800',
              color: primary,
              lineHeight: '1.15',
              letterSpacing: '-0.025em',
            },
            children: title,
          },
        },
        ...(description
          ? [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '20px',
                    color: secondary,
                    marginTop: '20px',
                    lineHeight: '1.5',
                    maxWidth: '850px',
                  },
                  children: description,
                },
              },
            ]
          : []),
        // Footer divider + meta
        {
          type: 'div',
          props: {
            style: {
              width: '100%',
              height: '1px',
              backgroundColor: divider,
              marginTop: '36px',
            },
            children: null,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '16px',
              fontFamily: 'monospace',
            },
            children: [
              author
                ? {
                    type: 'div',
                    props: {
                      style: { fontSize: '16px', color: secondary },
                      children: author,
                    },
                  }
                : { type: 'div', props: { style: { width: '1px' }, children: null } },
              watermark
                ? {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '13px',
                        color: secondary,
                        opacity: '0.5',
                        letterSpacing: '0.06em',
                      },
                      children: 'SnapOG',
                    },
                  }
                : { type: 'div', props: { style: { width: '1px' }, children: null } },
            ],
          },
        },
      ],
    },
  };
}

export function buildElement(params: OGParams, watermark: boolean): VNode {
  switch (params.template) {
    case 'blog':
      return blogTemplate(params, watermark);
    case 'article':
      return articleTemplate(params, watermark);
    case 'placeholder':
      return placeholderTemplate(params, watermark);
    default:
      return defaultTemplate(params, watermark);
  }
}
