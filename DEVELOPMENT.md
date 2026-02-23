# PetPlay Development Guide

## Resumen de Arquitectura

PetPlay es una aplicación móvil construida con React Native + Expo que conecta dueños de perros.

### Capas

```
┌─────────────────────────────────┐
│      React Navigation            │  Stack + Tab Navigator
├─────────────────────────────────┤
│       Screens (8)               │  OnboardingScreen, LoginScreen, etc.
├─────────────────────────────────┤
│      Components (5)             │  Button, Input, DogCard, etc.
├─────────────────────────────────┤
│      Custom Hooks (3)           │  useAuth, useDogs, useNotifications
├─────────────────────────────────┤
│      Services (3)               │  Firebase Auth, Firestore, Notifications
├─────────────────────────────────┤
│      Firebase Backend           │  Authentication + Firestore Database
└─────────────────────────────────┘
```

## Flujo de Datos

### Auth Flow
```
Onboarding
    ↓
Register/Login → Firebase Auth
    ↓
useAuth Hook → guarda usuario en state
    ↓
MainTabs Navigation
```

### Matching Flow
```
HomeScreen
    ↓
useDogs → Obtiene perros de Firestore por zona
    ↓
DogCard → Muestra perro
    ↓
onLike → matchService.createMatch() → Firestore
```

### Data Flow
```
Services (Firestore)
    ↓
Custom Hooks (useAuth, useDogs)
    ↓
Screens / Components
    ↓
StyleSheet (UI)
```

## Archivos Clave

### Entry Point
- **App.tsx**: Punto de entrada, configura NavigationContainer y RootNavigator

### Screens (8)
1. `OnboardingScreen.tsx` - Presentación inicial
2. `RegisterScreen.tsx` - Crear cuenta
3. `LoginScreen.tsx` - Iniciar sesión
4. `HomeScreen.tsx` - Matching (core)
5. `CommunityScreen.tsx` - Alertas de perdidos
6. `ProfileScreen.tsx` - Perfil usuario
7. `DogProfileScreen.tsx` - CRUD de perros
8. `SettingsScreen.tsx` - Configuración

### Components (5)
1. `Button.tsx` - Botones (primary, secondary, danger)
2. `Input.tsx` - Inputs con validación
3. `DogCard.tsx` - Card de perro
4. `LostDogCard.tsx` - Card de alerta perdida
5. `ScreenContainer.tsx` - Wrapper de pantallas

### Services
1. `firebase.ts` - Inicialización Firebase
2. `auth.ts` - Autenticación (register, login, logout)
3. `index.ts` - Firestore (dogs, matches, lost_dogs)
4. `notifications.ts` - Placeholder para notificaciones (v2)

### Hooks
1. `useAuth.ts` - Estado de autenticación
2. `useDogs.ts` - Obtener perros por zona/propietario
3. `useNotifications.ts` - Placeholder notificaciones

## Tipos TypeScript

### Models
```typescript
- User: id, email, name, zone, createdAt
- Dog: id, ownerId, name, breed, photo, ageCategory, gender, size, energyLevel, personality, compatibility, zone
- Match: id, userId1, userId2, dogId1, dogId2, status, createdAt, respondedAt
- LostDogAlert: id, ownerId, dogId, dogName, description, location, date, resolved, photo
```

### Navigation
```typescript
- RootStackParamList: Onboarding, Login, Register, MainTabs, DogProfile, Settings
- MainTabsParamList: Home, Community, Profile
```

## Estados de la App

### 1. Loading
```
splash screen → userLoaded = false
```

### 2. Auth
```
No usuario → Onboarding → Login/Register
Con usuario → MainTabs
```

### 3. Operacional
```
Home → Mostrar perros, hacer matches
Community → Ver alertas perdidas
Profile → Mi info, mis perros
```

## Validaciones

### Auth
- Email: formato válido (@)
- Password: mínimo 6 caracteres
- Contraseñas coinciden
- Zona: requerida

### Dog Profile
- Nombre: requerido
- Raza: requerida
- Zona: requerida
- Campos opcionales: foto, personalidad

## Estructura de Carpetas

```
petplay/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── DogCard.tsx
│   │   ├── LostDogCard.tsx
│   │   ├── ScreenContainer.tsx
│   │   └── index.ts
│   ├── screens/
│   │   ├── OnboardingScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CommunityScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── DogProfileScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── index.ts
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── MainTabsNavigator.tsx
│   │   └── index.ts
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── auth.ts
│   │   ├── index.ts (Firestore)
│   │   └── notifications.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDogs.ts
│   │   ├── useNotifications.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── navigation.ts
│   │   └── models.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── index.ts
│   └── assets/
│       └── .gitkeep
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── README.md
├── SETUP.md
├── .env.example
├── .gitignore
└── (más archivos de config)
```

## Dependencias Principales

```json
{
  "react": "18.2.0",
  "react-native": "0.73.0",
  "expo": "~50.0.0",
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/bottom-tabs": "^6.5.0",
  "@react-navigation/stack": "^6.3.0",
  "firebase": "^10.7.0",
  "typescript": "^5.3.0"
}
```

## Flujo de Desarrollo

### 1. Nueva Funcionalidad
1. Crear tipo en `src/types/`
2. Crear servicio en `src/services/` si usa datos
3. Crear hook en `src/hooks/` si es lógica reutilizable
4. Crear componente en `src/components/` si es UI
5. Usar en screen

### 2. Nueva Pantalla
1. Crear archivo en `src/screens/YourScreen.tsx`
2. Agregar a tipos navigation
3. Agregar a RootNavigator o MainTabsNavigator
4. Importar componentes y servicios

### 3. Testing Manual
```bash
npx expo start
# Presiona 'a' o 'i' o 'w'
# Prueba cada flujo
```

## Mejoras Futuras (v2+)

- [ ] Google/Apple Sign In
- [ ] Chat en tiempo real (Firestore o Socket.io)
- [ ] Galería de fotos
- [ ] Google Maps integrado
- [ ] Push notifications reales
- [ ] Rating y reviews
- [ ] Historial de playdates
- [ ] Filtros avanzados
- [ ] Pagos integrados
- [ ] Dark mode
- [ ] Internacionalización (i18n)
- [ ] Analytics
- [ ] Offline mode

## Comandos Útiles de Desarrollo

```bash
# Iniciar dev
npm start

# Ver TypeScript errors
npx tsc --noEmit

# Limpiar caché
npm start -- -c

# Reset completo
rm -rf node_modules && npm install

# Ejecutar en simulador iOS (Mac only)
npx expo start -i

# Ejecutar en emulador Android
npx expo start -a

# Ejecutar en web
npx expo start -w
```

## Debugging

### VS Code
1. Instala extensión "Debugger for Chrome"
2. Abre Chrome DevTools (en web)
3. Usa `console.log()` en el código

### Expo CLI
- Los logs aparecen directamente en la terminal
- Presiona `j` para abrir Debugger de Flipper

## Notas de Performance

- Componentes funcionales con React.FC
- Hooks para state management (sin Redux)
- FlatList para listas largas
- useMemo/useCallback cuando sea necesario
- Evitar re-renders innecesarios

## Estilo y Convenciones

- **Componentes**: PascalCase
- **Variables/funciones**: camelCase
- **Archivos**: PascalCase para componentes, camelCase para utils
- **Imports**: Organizados (React, libraries, local)
- **TypeScript**: Sempre tipado
- **Estilos**: StyleSheet de react-native (no Tailwind)

## Errores Comunes

### "Cannot find module '@components/...'"
- Verifica que metro.config.js tenga los alias
- Reinicia Expo: `npm start -- -c`

### "Firebase is not initialized"
- Verifica credenciales en firebase.ts
- Asegúrate de importar Firebase en los servicios

### "State is not updating"
- Usa nuevo objeto: `{...state, field: value}`
- No mutes estado directamente

### "Navigation undefined"
- Verifica que el tipo de screen coincida con ParamList
- Asegúrate de pasar correctamente los tipos genéricos

---

**Construido con ❤️ para desarrolladores y perros felices** 🐾
