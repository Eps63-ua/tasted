export * from './colors';
export * from './effects';
export * from './radii';
export * from './sizes';
export * from './spacing';
export * from './typography';

import { colors } from './colors';
import { fontFamilies } from './typography';

const demoPalette = {
  text: colors.textPrimary,
  background: colors.background,
  tint: colors.accent,
  icon: colors.textSecondary,
  tabIconDefault: colors.textSecondary,
  tabIconSelected: colors.accent,
} as const;

// The starter components still expect these names. Both entries intentionally use Tasted's dark palette.
export const Colors = {
  light: demoPalette,
  dark: demoPalette,
} as const;

export const Fonts = fontFamilies;
