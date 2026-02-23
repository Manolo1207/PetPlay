// App.tsx (en la raíz de tu proyecto)

import 'react-native-gesture-handler';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { Language, getLanguage, setLanguage } from './src/utils/i18n';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, LogBox, StyleSheet } from 'react-native';

// Importa nuestro RootNavigator de la carpeta navigation
import { RootNavigator } from './src/navigation';
import { Snackbar } from './src/components/Snackbar';
import { notificationService } from './src/services/notifications';

// Contexto global de errores
type ErrorContextType = {
  setError: (msg: string) => void;
};
const ErrorContext = createContext<ErrorContextType>({ setError: () => { } });
export const useGlobalError = () => useContext(ErrorContext);

// Contexto global de idioma
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};
export const LanguageContext = createContext<LanguageContextType>({
  language: getLanguage(),
  setLanguage: () => { },
});
export default function App() {
  const [errorMsg, setErrorMsg] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [language, setLangState] = useState<Language>(getLanguage());

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangState(lang);
  };
  useEffect(() => {
    (async () => {
      const token = await notificationService.registerForPushNotificationsAsync();
      if (token) {
        console.log('Expo Push Token:', token);
      } else {
        console.log('No se pudo obtener el token de notificaciones');
      }
    })();
    // Captura errores globales
    const errorHandler = (e: any) => {
      setErrorMsg(e?.message || 'Error inesperado');
      setSnackbarVisible(true);
    };
    // React Native global error
    const subscription = (ErrorUtils as any)?.setGlobalHandler
      ? (ErrorUtils as any).setGlobalHandler(errorHandler)
      : undefined;
    // JS global error
    window.onerror = (msg) => {
      setErrorMsg(typeof msg === 'string' ? msg : 'Error inesperado');
      setSnackbarVisible(true);
    };
    return () => {
      if (subscription) subscription();
    };
  }, []);
  // Silence known non-fatal dev warnings that originate from web mappings
  // (safe for development; remove before shipping if you prefer to see them).
  LogBox.ignoreLogs([
    'props.pointerEvents is deprecated',
    '"shadow*" style props are deprecated',
    '"shadow*" style props are deprecated. Use "boxShadow"',
  ]);

  // Additionally filter console.warn in web dev to reduce noise from RN-web mappings
  if (__DEV__ && typeof console !== 'undefined') {
    const _warn = console.warn.bind(console);
    console.warn = (...args: any[]) => {
      try {
        const first = args[0];
        if (typeof first === 'string') {
          if (first.includes('props.pointerEvents is deprecated') || first.includes('"shadow*"') || first.includes('shadow*')) {
            return;
          }
        }
      } catch (e) {
        // ignore
      }
      _warn(...args);
    };
  }

  return (
    <ErrorContext.Provider value={{ setError: (msg) => { setErrorMsg(msg); setSnackbarVisible(true); } }}>
      <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
        <GestureHandlerRootView style={styles.root}>
          <SafeAreaProvider>
            <View style={{ flex: 1 }}>
              <RootNavigator />
              <StatusBar style="auto" />
              <Snackbar
                message={errorMsg}
                visible={snackbarVisible}
                onHide={() => setSnackbarVisible(false)}
              />
            </View>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </LanguageContext.Provider>
    </ErrorContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
