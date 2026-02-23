# 🐾 PetPlay – Guía completa

Todo lo que necesitas para tener PetPlay funcionando de punta a punta.

---

## 📋 1. Requisitos previos

| Requisito | Versión mínima | Dónde conseguirlo |
|-----------|----------------|-------------------|
| Node.js   | 18 o superior  | https://nodejs.org |
| npm       | 9 o superior   | Se instala con Node.js |
| Git       | Cualquiera     | https://git-scm.com (opcional) |

---

## 🚀 2. Instalación y ejecución

### Paso 1: Abrir la terminal

- En **VS Code/Cursor**: `Terminal` → `Nueva terminal`, o `` Ctrl+` ``
- En **Windows**: PowerShell o CMD

### Paso 2: Ir a la carpeta del proyecto

```powershell
cd "c:\Users\manue\Documents\PetPlay code\petplay"
```

### Paso 3: Instalar dependencias

```powershell
npm install
```

### Paso 4: Iniciar la app

```powershell
npm start
```

o:

```powershell
npx expo start
```

### Paso 5: Elegir dónde ejecutar

| Tecla | Opción          | Requisito                            |
|-------|-----------------|--------------------------------------|
| `a`   | Android         | Emulador Android o dispositivo       |
| `i`   | iOS             | Mac con Xcode                        |
| `w`   | Web             | Navegador                            |
| QR    | Teléfono físico | App **Expo Go** (Play Store / App Store) |

---

## 📱 3. Ejecutar en tu teléfono

1. Instala **Expo Go** en tu móvil.
2. Ejecuta `npm start` en la terminal.
3. Escanea el código QR:
   - **Android**: con la app Expo Go.
   - **iOS**: con la cámara del iPhone.
4. La app se abrirá en tu teléfono.

---

## 🔥 4. Firebase (ya configurado)

Tu proyecto ya tiene credenciales de Firebase en `src/services/firebase.ts`:

- **Project ID**: `petplay-83088`
- **Auth y Firestore** activos

### Comprobar en Firebase Console

1. Entra en: https://console.firebase.google.com
2. Abre el proyecto **petplay-83088**
3. **Authentication** → Método **Email/Password** activado
4. **Firestore Database** → Base de datos creada

### Si algo falla con Firebase

- Verifica que Authentication → Sign-in method tenga **Email/Password** habilitado.
- En Firestore, revisa las reglas (por ejemplo, en modo test para desarrollo).

---

## 🎮 5. Modo desarrollo

En modo `__DEV__`, la app entra directo a las pestañas principales **sin hacer login**.

Sirve para probar:

- Descubrir perros
- Comunidad
- Perfil
- Crear/editar perros

Para usar login y registro reales, tendrás que ajustar el código (por ejemplo, desactivar el usuario simulado en desarrollo).

---

## 📂 6. Estructura del proyecto

```
petplay/
├── App.tsx                 # Punto de entrada
├── src/
│   ├── components/         # Button, Input, DogCard, LostDogCard, ScreenContainer
│   ├── screens/            # 8 pantallas principales
│   ├── navigation/         # RootNavigator, AuthNavigator, MainTabs
│   ├── services/           # Firebase, auth, dogs, matches, lost_dogs
│   ├── hooks/              # useAuth, useDogs, useNotifications
│   ├── types/              # Interfaces TypeScript
│   └── utils/              # Constantes y helpers
├── firebase.ts             # Configuración Firebase (editar aquí)
└── package.json
```

---

## 🛠️ 7. Comandos útiles

```powershell
# Iniciar en modo desarrollo
npm start

# Iniciar solo Android
npm run android

# Iniciar solo iOS (Mac)
npm run ios

# Iniciar en web
npm run web

# Verificar TypeScript
npx tsc --noEmit
```

---

## 🐛 8. Solución de problemas

### "npm: command not found"
- Instala Node.js desde https://nodejs.org y vuelve a abrir la terminal.

### "Unable to resolve module"
```powershell
# Borrar cache y reinstalar
npx expo start --clear
# o
rm -rf node_modules
npm install
```

### Error de Firebase / Analytics
- Ya se ha ajustado `firebase.ts` para evitar usar Analytics en React Native. Si ves errores relacionados, confirma que no haya imports de `firebase/analytics`.

### "Network response timed out"
- Comprueba tu conexión a internet.
- Si usas VPN o proxy, prueba desactivarlos.

### La app va lenta
- En Android: usa un dispositivo o emulador relativamente reciente.
- En web: algunas partes pueden ir más lentas que en móvil nativo.

---

## 📖 9. Flujo de la app

1. **Onboarding** → Pantalla de bienvenida
2. **Login / Register** → Crear cuenta o iniciar sesión
3. **Tabs principales**:
   - **Descubre**: matching de perros por zona
   - **Comunidad**: alertas de perros perdidos
   - **Perfil**: datos del usuario y sus perros
4. **DogProfile**: crear o editar perros
5. **LostDog**: reportar perro perdido
6. **Settings**: configuración básica

---

## ✅ Checklist rápido

- [ ] Node.js instalado
- [ ] `cd` en la carpeta `petplay`
- [ ] `npm install`
- [ ] `npm start`
- [ ] Escoger Android / iOS / Web / QR
- [ ] Probar registro y login
- [ ] Crear un perfil de perro
- [ ] Probar el matching
- [ ] Revisar alertas de perros perdidos

---

**¿Listo?** Abre la terminal, ve a la carpeta del proyecto y ejecuta `npm install` y luego `npm start`.  
Si aparece algún error concreto, cópialo y lo revisamos paso a paso.
