import type { ViewStyle } from 'react-native';

import { colors } from './colors';

export const opacity = {
  disabled: 0.5,
  muted: 0.65,
  pressed: 0.8,
} as const;

export const motion = {
  pressedScale: 0.97,
} as const;

export const shadows = {
  subtle: {
    elevation: 2,
    shadowColor: colors.onAccent,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
  raised: {
    elevation: 4,
    shadowColor: colors.onAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 4,
  },
} as const satisfies Record<string, ViewStyle>;

export type OpacityToken = keyof typeof opacity;
export type ShadowToken = keyof typeof shadows;
