import { Platform, type TextStyle } from 'react-native';

export const fontFamilies = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const fontSizes = {
  tabLabel: 10,
  formLabel: 11,
  caption: 12,
  secondary: 14,
  body: 16,
  sectionTitle: 16,
  itemTitle: 20,
  screenTitle: 24,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<string, NonNullable<TextStyle['fontWeight']>>;

export const typography = {
  screenTitle: { fontSize: fontSizes.screenTitle, fontWeight: fontWeights.bold },
  itemTitle: { fontSize: fontSizes.itemTitle, fontWeight: fontWeights.bold },
  sectionTitle: { fontSize: fontSizes.sectionTitle, fontWeight: fontWeights.bold },
  body: { fontSize: fontSizes.body, fontWeight: fontWeights.regular },
  cardTitle: { fontSize: fontSizes.secondary, fontWeight: fontWeights.semibold },
  secondary: { fontSize: fontSizes.secondary, fontWeight: fontWeights.regular },
  formLabel: { fontSize: fontSizes.formLabel, fontWeight: fontWeights.semibold },
  tabLabel: { fontSize: fontSizes.tabLabel, fontWeight: fontWeights.medium },
} as const satisfies Record<string, TextStyle>;

export type FontSizeToken = keyof typeof fontSizes;
export type FontWeightToken = keyof typeof fontWeights;
export type TypographyToken = keyof typeof typography;
