# 📖 Eternal Stone Bible App V3

<div align="center">

**Una aplicación móvil multiplataforma moderna para la lectura y estudio de la Biblia**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.23-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

</div>

---

## ✨ Características Principales

### 📚 **Lectura Completa de la Biblia**
- **Biblia Reina Valera 1960 (RVR1960)** completa con 31,102 versículos
- Navegación fluida entre 66 libros, 1,187 capítulos
- Interfaz optimizada para lectura prolongada

### 🎨 **Personalización Avanzada**
- **6 temas de color**: Default, Sepia, Green, Purple, Ocean, Sunset
- **Modo oscuro/claro** con detección automática del sistema
- **Tipografía personalizable**: tamaño de fuente, familia, espaciado de líneas
- **Zoom de texto** ajustable (50% - 200%)

### 📝 **Sistema de Notas y Marcadores**
- Marcadores persistentes con sincronización local
- Sistema de notas por versículo
- Exportación y compartir versículos
- Copia rápida al portapapeles

### 🎯 **Planes de Lectura**
- Planes predefinidos (ej: Biblia en 1 año, 90 días, temas específicos)
- Seguimiento de progreso con estadísticas
- Notificaciones de recordatorio personalizables

### 🔍 **Búsqueda Avanzada**
- Búsqueda en tiempo real con debouncing
- Filtros por Antiguo/Nuevo Testamento
- Resultados con contexto completo

### 📅 **Versículo del Día**
- Versículo aleatorio diario con navegación directa
- Animaciones suaves y diseño atractivo

### 🌐 **Internacionalización**
- Soporte multiidioma (actualmente Español)
- Fácil extensión a otros idiomas con `i18next`

### ♿ **Accesibilidad**
- Soporte completo para lectores de pantalla
- Labels y hints de accesibilidad en toda la app
- Feedback háptico en interacciones clave

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- **Node.js** ≥ 18.x
- **npm** o **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** (para testing en dispositivo físico)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/VictorVidal7/EternalStoneBibleAppV3.git
cd EternalStoneBibleAppV3

# 2. Instalar dependencias
npm install
# o
yarn install

# 3. Iniciar la aplicación
npm start
# o
yarn start
```

### Ejecución en Plataformas

```bash
# iOS (requiere macOS)
npm run ios

# Android
npm run android

# Web
npm run web
```

---

## 📂 Estructura del Proyecto

```
EternalStoneBibleAppV3/
├── src/
│   ├── components/          # 10+ componentes reutilizables
│   │   ├── ErrorBoundary.tsx      # Manejo de errores con UI
│   │   ├── DailyVerse.js          # Versículo del día
│   │   ├── CustomIcon.js          # Iconos SVG personalizados
│   │   ├── CustomIconButton.js    # Botones con iconos
│   │   └── ...
│   ├── screens/             # 9 pantallas principales
│   │   ├── HomeScreen.js          # Pantalla de inicio
│   │   ├── BibleListScreen.js     # Listado de libros
│   │   ├── ChapterScreen.js       # Listado de capítulos
│   │   ├── VerseScreen.js         # Lectura de versículos
│   │   ├── SearchScreen.js        # Búsqueda
│   │   ├── BookmarksScreen.js     # Marcadores
│   │   ├── NotesScreen.js         # Notas
│   │   ├── ReadingPlanScreen.js   # Planes de lectura
│   │   └── SettingsScreen.js      # Configuración
│   ├── context/             # 8 contextos de estado global
│   │   ├── ThemeContext.tsx       # Temas y colores (TypeScript)
│   │   ├── UserPreferencesContext.js # Preferencias de usuario
│   │   ├── BookmarksContext.js    # Gestión de marcadores
│   │   ├── NotesContext.js        # Gestión de notas
│   │   ├── ReadingProgressContext.js
│   │   ├── ReadingPlanContext.js
│   │   ├── ReadingModeContext.js
│   │   └── ErrorContext.js
│   ├── navigation/          # Configuración de navegación
│   │   └── AppNavigator.js        # Stack + Bottom Tab Navigator
│   ├── services/            # Servicios de negocio
│   │   ├── AnalyticsService.js    # Analytics (opcional)
│   │   ├── bibleDataManager.js    # Gestor de datos bíblicos
│   │   ├── DailyVerseService.js   # Versículos aleatorios
│   │   ├── CacheService.js        # Sistema de caché
│   │   ├── HapticFeedback.js      # Feedback háptico
│   │   └── NotificationService.js
│   ├── data/                # Datos bíblicos
│   │   ├── bible_books/           # 66 archivos JSON (1 por libro)
│   │   ├── bibleBooks.json        # Metadata de libros
│   │   ├── bibleVerses.json       # Versículos completos
│   │   └── readingPlans.js        # Planes de lectura
│   ├── hooks/               # Hooks personalizados
│   │   ├── useStyles.js
│   │   ├── useZoomedStyles.js
│   │   ├── useBibleVersion.tsx
│   │   └── useLanguage.tsx
│   ├── i18n/                # Internacionalización
│   │   ├── i18n.js
│   │   └── translations.ts
│   ├── types/               # Definiciones TypeScript
│   │   ├── bible.ts
│   │   └── common.js
│   ├── styles/              # Estilos globales
│   │   └── theme.js
│   └── utils/               # Utilidades
│       └── animations.js
├── __tests__/               # Tests (Jest)
├── App.js                   # Componente raíz con providers
├── index.ts                 # Entry point (Expo)
├── package.json
├── tsconfig.json
├── jest.setup.js
├── metro.config.js
└── README.md
```

---

## 🛠️ Stack Tecnológico

### Core
- **React Native** 0.81.5
- **Expo** ~54.0.23
- **React** 19.1.0
- **TypeScript** ~5.9.2

### Navegación
- `@react-navigation/native` ^7.0.15
- `@react-navigation/stack` ^7.1.3
- `@react-navigation/bottom-tabs` ^7.2.3

### Estado y Persistencia
- **React Context API** (8 contextos)
- `@react-native-async-storage/async-storage` ^2.2.0
- `expo-sqlite` ^16.0.9

### UI/UX
- `react-native-gesture-handler` ^2.22.2
- `react-native-reanimated` ^3.18.2
- `react-native-safe-area-context` ^5.6.2
- `react-native-screens` ~4.16.0
- `@react-native-community/slider` ^4.5.5
- `expo-linear-gradient` ^14.0.1
- `expo-haptics` ^15.0.7

### Funcionalidades
- `react-i18next` ^15.3.4 (i18n)
- `i18next` ^24.2.0
- `expo-clipboard` ^8.0.7
- `expo-sharing` ^14.0.7
- `use-debounce` ^10.0.0

### Testing
- **Jest** ^29.7.0
- `jest-expo` ~54.0.4
- `@testing-library/react-native` ^12.9.0
- `@testing-library/jest-native` ^5.4.3

---

## 🎨 Arquitectura y Patrones

### Gestión de Estado
- **Context API** con custom hooks para cada dominio
- **Persistencia automática** con AsyncStorage
- **Separación de concerns** (UI, lógica, datos)

### Optimizaciones de Performance
- `React.memo` en componentes reutilizables
- `useMemo` para estilos dinámicos y cálculos costosos
- `useCallback` para funciones en dependencias
- Lazy loading con FlatList virtualization
- Debouncing en búsqueda (300ms)

### Manejo de Errores
- `ErrorBoundary` component en nivel raíz
- Fallback UI personalizable
- Logging de errores en desarrollo
- ErrorContext para errores de runtime

### Accesibilidad
- `accessibilityLabel` y `accessibilityHint` en todos los elementos interactivos
- `accessibilityRole` apropiado
- Soporte para lectores de pantalla
- Feedback háptico en acciones clave

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ver cobertura
npm test -- --coverage

# Modo watch
npm test -- --watch
```

### Tests Configurados
- Tests unitarios de componentes
- Tests de contextos
- Tests de servicios
- Mocks completos para React Native y Expo

---

## 📦 Scripts Disponibles

```bash
npm start         # Iniciar Expo development server
npm run android   # Correr en Android
npm run ios       # Correr en iOS
npm run web       # Correr en web
npm test          # Ejecutar tests
npm run lint      # Linting con ESLint
npm run format    # Formatear código con Prettier
```

---

## 🎯 Mejoras Implementadas (V3)

### ✅ Dependencias Corregidas
- Migración completa a **Expo** managed workflow
- Reemplazo de `react-native-linear-gradient` → `expo-linear-gradient`
- Reemplazo de `@react-native-clipboard/clipboard` → `expo-clipboard`
- Eliminación de dependencias no usadas (`zustand`, `expo-router`)

### ✅ Arquitectura Mejorada
- **ThemeContext migrado a TypeScript** con tipado completo
- **ErrorBoundary** robusto implementado
- Eliminación de conflictos de contexto duplicados
- Entry points unificados (index.ts → App.js)

### ✅ Performance Optimizada
- React.memo en componentes críticos
- useMemo para estilos dinámicos
- useCallback en callbacks pesados
- Eliminación de recreación de StyleSheets

### ✅ Datos Completos
- **31,102 versículos** de RVR1960 verificados
- 66 libros completos
- 1,187 capítulos
- Datos validados contra estándar RVR1960

### ✅ Código Limpio
- Archivos huérfanos eliminados
- Carpetas no usadas removidas (`app/` de expo-router)
- Imports corregidos y consistentes

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Victor Vidal**
- GitHub: [@VictorVidal7](https://github.com/VictorVidal7)
- Proyecto: [EternalStoneBibleAppV3](https://github.com/VictorVidal7/EternalStoneBibleAppV3)

---

## 🙏 Agradecimientos

- **Reina Valera 1960** por la versión bíblica
- Comunidad de **React Native** y **Expo**
- Contribuidores del proyecto

---

<div align="center">

**Hecho con ❤️ para la gloria de Dios**

</div>
