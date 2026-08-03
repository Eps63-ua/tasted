import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import 'react-native-reanimated';

import { colors } from '@/constants/theme';
import { AppDataProvider } from '@/providers/app-data-provider';

const tastedTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, primary: colors.accent, background: colors.background, card: colors.surfaceNavigation, text: colors.textPrimary, border: colors.border, notification: colors.danger } };
export default function RootLayout() { const [client] = useState(() => new QueryClient()); return <QueryClientProvider client={client}><AppDataProvider><ThemeProvider value={tastedTheme}><Stack screenOptions={{ headerShown:false, contentStyle:{backgroundColor:colors.background}, animation:'slide_from_right' }}><Stack.Screen name="(tabs)" /><Stack.Screen name="products/[id]" /><Stack.Screen name="products/create" /><Stack.Screen name="products/[id]/edit" /><Stack.Screen name="establishments/[id]" /><Stack.Screen name="establishments/create" /><Stack.Screen name="establishments/[id]/edit" /><Stack.Screen name="categories/[id]" /><Stack.Screen name="categories/create" /><Stack.Screen name="categories/[id]/edit" /><Stack.Screen name="profile/edit" /></Stack><StatusBar style="light" backgroundColor={colors.background} /></ThemeProvider></AppDataProvider></QueryClientProvider>; }
