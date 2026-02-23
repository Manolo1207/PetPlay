# Setup PetPlay - Guía Rápida

## ⚙️ Instalación

### 1. Requisitos Previos
- Node.js v16+ y npm
- Expo CLI instalado globalmente: `npm install -g expo-cli`
- Un editor de código (VS Code recomendado)
- Una cuenta de Firebase (gratis)

### 2. Clonar / Descargar el Proyecto
```bash
cd "c:\Users\manue\Documents\PetPlay code\petplay"
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto (o usa uno existente)
3. Habilita:
   - **Authentication**: Email/Password
   - **Firestore Database**: Modo desarrollo (para testing)
4. Copia las credenciales y pégalas en `src/services/firebase.ts`

### 5. Ejecutar la App
```bash
npx expo start
```

**Opciones:**
- Presiona `a` → Abre en Android Emulator
- Presiona `i` → Abre en iOS Simulator
- Presiona `w` → Abre en web
- Presiona `j` → Abre debugger

## 🎯 Pruebas Manuales

### Flujo de Auth
1. **Onboarding**: Click en "Crear Cuenta"
2. **Register**: Llena datos ficticios
   - Nombre: "Juan Pérez"
   - Email: "juan@example.com"
   - Password: "123456"
   - Zona: "Condesa"
3. **Home**: Deberías ver cards de perros
4. **Perfil**: Crea un perfil de perrito
5. **Comunidad**: Ve alertas de perros perdidos

### Crear Datos de Prueba

Entra a [Firebase Console → Firestore] y crea:

**Colección `users` - Documento de ejemplo:**
```json
{
  "email": "prueba@example.com",
  "name": "Test User",
  "zone": "Condesa",
  "createdAt": 1700000000
}
```

**Colección `dogs` - Documento de ejemplo:**
```json
{
  "ownerId": "USER_ID_AQUI",
  "name": "Max",
  "breed": "Labrador",
  "photo": "https://via.placeholder.com/300",
  "ageCategory": "adulto",
  "gender": "macho",
  "size": "grande",
  "energyLevel": "alto",
  "personality": ["juguetón", "amistoso"],
  "compatibility": [],
  "zone": "Condesa",
  "createdAt": 1700000000,
  "isLost": false
}
```

## 🚀 Comandos Útiles

```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Limpiar caché Expo
npm start -- -c

# Resetear bundler Metro
npm start -- --clear

# Ver logs en tiempo real
npx expo start --clear
```

## 📱 Emuladores

### Android
1. Abre Android Studio
2. Crea un AVD (Android Virtual Device)
3. Inicia el emulador
4. Ejecuta `npx expo start` → Presiona `a`

### iOS (solo en Mac)
1. Asegúrate de tener Xcode instalado
2. Ejecuta `npx expo start` → Presiona `i`

## 🐛 Troubleshooting

### Error: "Metro bundler crashed"
```bash
npm start -- -c --clear
```

### Error: "Firebase is not defined"
- Verifica que Firebase esté importado en `src/services/firebase.ts`
- Asegúrate de instalar: `npm install firebase`

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Errores de TypeScript
```bash
npx tsc --noEmit
```

## 📚 Estructura Rápida

```
src/
├── components/     # UI reutilizable (Button, Input, Cards)
├── screens/        # Pantallas principales (5 screens)
├── services/       # Firebase Auth & Firestore
├── hooks/          # useAuth, useDogs
├── types/          # TypeScript interfaces
├── navigation/     # Stack y Tab navigation
└── utils/          # Constantes y helpers
```

## ✅ Checklist de Setup

- [ ] Node.js v16+ instalado
- [ ] Expo CLI instalado globalmente
- [ ] Proyecto descargado
- [ ] `npm install` ejecutado
- [ ] Firebase config actualizado
- [ ] `npx expo start` corriendo
- [ ] Emulador iniciado (iOS o Android)
- [ ] App corriendo en emulador

## 🎉 ¡Listo!

Tu app PetPlay está lista. Ahora:

1. Crea una cuenta
2. Agrega un perrito
3. Descubre otros perros
4. ¡Haz amigos! 🐾

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Expo (`npx expo start`)
2. Verifica Firebase Console
3. Clearea caché: `npm start -- -c`
4. Reinstala dependencias si es necesario

---

**¡Diviértete construyendo!** 🚀
