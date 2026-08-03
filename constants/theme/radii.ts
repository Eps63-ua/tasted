export const radii = {
  small: 8,
  image: 12,
  medium: 16,
  large: 20,
  sheet: 24,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radii;
