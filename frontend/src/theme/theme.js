// Earthy, warm palette — evokes soil, harvest, and clear village skies.
// Deliberately high-contrast and large for low-literacy / outdoor readability.

export const colors = {
  primary: '#1B5E3F',
  primaryDark: '#0F3D27',
  primaryLight: '#E3F0E9',
  accent: '#E8762B',
  accentLight: '#FBE7D6',
  earth: '#7A5230',
  sky: '#2E7DA1',
  gold: '#D9A521',

  bg: '#F7F4EE',
  card: '#FFFFFF',
  surface: '#FCFAF5',

  text: '#23291F',
  textMuted: '#6B7261',
  border: '#E4DECF',

  danger: '#C0392B',
  success: '#2E8B57',
  warning: '#E8762B',
  info: '#2E7DA1',

  white: '#FFFFFF',
  shadow: 'rgba(40, 35, 20, 0.12)',
};

export const highContrastColors = {
  ...colors,
  bg: '#FFFFFF',
  card: '#FFFFFF',
  text: '#000000',
  textMuted: '#333333',
  border: '#000000',
  primary: '#004D25',
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
};

export const radius = {
  sm: 8, md: 14, lg: 20, xl: 28, pill: 999,
};

export const font = {
  h1: { fontSize: 28, fontWeight: '800' },
  h2: { fontSize: 22, fontWeight: '700' },
  h3: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  bodyBold: { fontSize: 16, fontWeight: '600' },
  small: { fontSize: 13, fontWeight: '400' },
  tiny: { fontSize: 11, fontWeight: '600' },
};

export function scaledFont(scale, style) {
  const out = {};
  for (const [k, v] of Object.entries(style)) {
    out[k] = k === 'fontSize' ? Math.round(v * scale) : v;
  }
  return out;
}

export function useThemeSettings(fontScale = 1, highContrast = false) {
  const c = highContrast ? highContrastColors : colors;
  const sf = (style) => scaledFont(fontScale, style);
  return { colors: c, font: { h1: sf(font.h1), h2: sf(font.h2), h3: sf(font.h3), body: sf(font.body), bodyBold: sf(font.bodyBold), small: sf(font.small), tiny: sf(font.tiny) }, spacing, radius, shadow };
}

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  raised: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },
};
