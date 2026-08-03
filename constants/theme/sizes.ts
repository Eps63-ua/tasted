export const touchTargets = {
  compact: 44,
  minimum: 48,
  input: 48,
  button: 56,
} as const;

export const iconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32,
} as const;

export type TouchTargetToken = keyof typeof touchTargets;
export type IconSizeToken = keyof typeof iconSizes;
