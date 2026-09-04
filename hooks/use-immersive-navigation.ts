import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

async function hideAndroidNavigationBar() {
  if (Platform.OS !== 'android') return;

  await NavigationBar.setButtonStyleAsync('light');
  await NavigationBar.setVisibilityAsync('hidden');
}

export function useImmersiveNavigation() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const hideNavigationBar = () => {
      void hideAndroidNavigationBar().catch((error: unknown) => {
        if (__DEV__) console.warn('No se pudo ocultar la barra de navegacion Android.', error);
      });
    };

    hideNavigationBar();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') hideNavigationBar();
    });

    return () => subscription.remove();
  }, []);
}
