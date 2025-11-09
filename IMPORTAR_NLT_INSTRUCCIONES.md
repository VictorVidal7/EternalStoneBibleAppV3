# Cómo Importar NLT - Instrucciones Locales

Debido a restricciones de red en el entorno de desarrollo remoto, necesitas ejecutar el script de importación **en tu máquina local**.

---

## Opción 1: Usar API.Bible con tu API Key

### Paso 1: Verifica tu API Key

1. Ve a https://scripture.api.bible/
2. Inicia sesión en tu cuenta
3. Ve a "API Keys"
4. Verifica que:
   - Tu email esté confirmado
   - La key esté activa: `00033788ba6217dcd5ac118418d58656`
   - Si no funciona, genera una nueva key

### Paso 2: Ejecuta el script localmente

Abre una terminal en tu computadora y ejecuta:

```bash
# Navega al proyecto
cd /ruta/a/EternalStoneBibleAppV3

# Descarga los cambios más recientes
git pull origin claude/add-translations-filters-stats-share-i18n-011CUwYKAwK3RbLPpTLH38u9

# Ejecuta el script de Python (más confiable)
cd scripts
python3 import-nlt.py 00033788ba6217dcd5ac118418d58656 de4e12af7f28f599-02
```

**O si prefieres Node.js:**

```bash
cd scripts
node import-bible-data.js 00033788ba6217dcd5ac118418d58656 de4e12af7f28f599-02
```

### Paso 3: Espera la descarga

- **Duración:** 2-3 horas
- **Progreso:** Verás mensajes en la consola
- **Resultado:** Se creará `src/lib/database/bible-data-nlt.ts`

### Paso 4: Sube los cambios

```bash
# Vuelve a la raíz del proyecto
cd ..

# Agrega el archivo generado
git add src/lib/database/bible-data-nlt.ts

# Commit
git commit -m "Add NLT Bible data"

# Push
git push origin claude/add-translations-filters-stats-share-i18n-011CUwYKAwK3RbLPpTLH38u9
```

---

## Opción 2: Descargar desde GitHub (Más rápido)

Si la API key no funciona, puedes descargar el NLT pre-procesado:

### Paso 1: Descarga manualmente

1. Ve a: https://mrk214.github.io/snapshots/en___eng___eng/NLT_vid_116.json
2. Guarda el archivo JSON
3. Si da "Access denied", intenta desde otra red o VPN

### Paso 2: Convierte el formato

El archivo descargado tiene un formato diferente al que necesitamos. Necesitarás convertirlo.

Crea un script `convert-nlt.js`:

```javascript
const fs = require('fs');

// Lee el archivo descargado
const rawData = JSON.parse(fs.readFileSync('NLT_vid_116.json', 'utf8'));

const verses = [];

// Convierte al formato de la app
// (El formato exacto depende de cómo esté estructurado el JSON descargado)
// Necesitarás adaptar esto según la estructura del archivo

const output = `// NLT Bible Data
// Source: mrk214/bible-data-en-eng
// Total verses: ${verses.length}

export const NLT_DATA = ${JSON.stringify(verses, null, 2)};
`;

fs.writeFileSync('../src/lib/database/bible-data-nlt.ts', output);
console.log('✅ Converted!');
```

---

## Opción 3: Usar KJV temporalmente

Mientras resuelves el tema del NLT, puedes usar KJV (King James Version) que es público:

```bash
cd scripts
python3 import-from-getbible.py kjv
```

O descarga KJV pre-procesado de cualquier repositorio público.

---

## Después de importar

Una vez tengas el archivo `bible-data-nlt.ts`:

### 1. Actualiza data-loader.ts

Descomenta las líneas 15-20 en `src/lib/database/data-loader.ts`:

```typescript
const BIBLE_VERSIONS = [
  {
    id: 'RVR1960',
    name: 'Reina Valera 1960',
    dataFile: './bible-data-rvr1960',
    exportName: 'RVR1960_DATA',
  },
  {  // <-- DESCOMENTA ESTO
    id: 'NLT',
    name: 'New Living Translation',
    dataFile: './bible-data-nlt',
    exportName: 'NLT_DATA',
  },
];
```

### 2. Actualiza useBibleVersion.tsx

En `src/hooks/useBibleVersion.tsx`, cambia NLT de "Coming Soon" a activo:

```typescript
export const AVAILABLE_VERSIONS: BibleVersion[] = [
  {
    id: 'RVR1960',
    name: 'Reina Valera 1960',
    abbreviation: 'RVR1960',
    language: 'es',
    year: '1960',
  },
  {  // <-- CAMBIA ESTO
    id: 'NLT',
    name: 'New Living Translation',
    abbreviation: 'NLT',
    language: 'en',
    year: '1996',
  },
  // Deja NTV como "Coming Soon" hasta obtener los datos
];
```

### 3. Reset en la App

- Abre la app
- Ve a Settings → Reset Bible Data
- Selecciona "Only Verses"
- Cierra y vuelve a abrir la app
- ¡NLT debería estar disponible!

---

## Problemas Comunes

### "API key inválida"
- Verifica que el email esté confirmado en API.Bible
- Genera una nueva key
- Verifica que uses el Bible ID correcto: `de4e12af7f28f599-02`

### "Network timeout"
- Asegúrate de tener internet estable
- El script puede tomar horas, déjalo correr
- Si falla, puedes reanudar (el script maneja errores por capítulo)

### "Access denied" en GitHub
- Intenta desde otra red o VPN
- Usa la API.Bible en su lugar

### "File too large"
- El archivo será de 5-10 MB
- Esto es normal para ~31,000 versículos
- Git debería manejarlo sin problemas

---

## ¿Necesitas ayuda?

Si tienes problemas:

1. **Verifica la consola** - Los errores mostrarán qué falló
2. **Revisa tu API key** - Confirma en API.Bible
3. **Prueba con KJV primero** - Para verificar que los scripts funcionen
4. **Compárteme el error** - Puedo ayudarte a resolverlo

¡Buena suerte!
