export const colors = {
  background: '#0B0B0B',
  backgroundDeep: '#050505',
  surfaceNavigation: '#121212',
  surfaceCard: '#181818',
  surfaceInput: '#202020',
  border: '#2A2A2A',
  textPrimary: '#F5F5F5',
  textSecondary: '#A7A7A7',
  accent: '#1ED760',
  accentPressed: '#18B850',
  onAccent: '#000000',
  danger: '#EF5350',
  overlay: 'rgba(0,0,0,0.70)',
  imageBadge: 'rgba(0,0,0,0.65)',
  imageScrim: 'rgba(0,0,0,0.18)',
  onAccentSubtle: 'rgba(0,0,0,0.12)',
} as const;

export type ColorToken = keyof typeof colors;
