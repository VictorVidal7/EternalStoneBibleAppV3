import AsyncStorage from '@react-native-async-storage/async-storage';
import bibleDB from './index';

const DATA_LOADED_KEY = '@bible_data_loaded_v2'; // v2 to support multiple versions

// Available Bible versions with their data files
const BIBLE_VERSIONS = [
  {
    id: 'RVR1960',
    name: 'Reina Valera 1960',
    dataFile: './bible-data-rvr1960',
    exportName: 'RVR1960_DATA',
  },
  {
    id: 'NLT',
    name: 'New Living Translation',
    dataFile: './bible-data-nlt',
    exportName: 'NLT_DATA',
  },
  // Add more versions here as data files become available
  // {
  //   id: 'KJV',
  //   name: 'King James Version',
  //   dataFile: './bible-data-kjv',
  //   exportName: 'KJV_DATA',
  // },
];

export async function initializeBibleData(
    onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  try {
    console.log('🔵 Starting Bible data initialization...');

    const isLoaded = await AsyncStorage.getItem(DATA_LOADED_KEY);

    if (isLoaded === 'true') {
      console.log('🟢 Bible data already loaded, skipping');
      return;
    }

    console.log('🟡 Initializing database schema...');
    await bibleDB.initialize();

    let totalLoadedVerses = 0;
    let grandTotal = 0;

    // Load all available versions
    for (const version of BIBLE_VERSIONS) {
      try {
        console.log(`📖 Loading ${version.name} (${version.id})...`);

        // Importación dinámica para evitar cargar MB innecesariamente
        const module = await import(version.dataFile);
        const versionData = module[version.exportName];

        if (!versionData || !Array.isArray(versionData)) {
          console.warn(`⚠️  Skipping ${version.id}: Invalid data format`);
          continue;
        }

        grandTotal += versionData.length;
        console.log(`📊 ${version.id}: ${versionData.length} verses`);

        // Insertar en chunks de 1000 versículos para mejor rendimiento
        const CHUNK_SIZE = 1000;

        for (let i = 0; i < versionData.length; i += CHUNK_SIZE) {
          const chunk = versionData.slice(i, i + CHUNK_SIZE);
          await bibleDB.insertVerses(chunk);

          totalLoadedVerses += chunk.length;

          // Reportar progreso global
          if (onProgress) {
            onProgress(totalLoadedVerses, grandTotal);
          }

          console.log(`⏳ Progress: ${totalLoadedVerses}/${grandTotal} verses (${Math.round(totalLoadedVerses/grandTotal*100)}%)`);
        }

        console.log(`✅ ${version.id} loaded successfully`);
      } catch (error) {
        // Si falla una versión, continuar con las demás
        console.warn(`⚠️  Failed to load ${version.id}:`, error);
      }
    }

    // Marcar como cargado
    await AsyncStorage.setItem(DATA_LOADED_KEY, 'true');

    console.log('✅ Bible data initialization complete!');
    console.log(`📚 Successfully loaded ${totalLoadedVerses} verses from ${BIBLE_VERSIONS.length} version(s)`);
  } catch (error) {
    console.error('❌ Bible data initialization error:', error);
    // En caso de error, limpiar el flag para permitir reintento
    await AsyncStorage.removeItem(DATA_LOADED_KEY);
    throw error;
  }
}

export async function checkDataStatus(): Promise<{
  isLoaded: boolean;
  stats?: { totalVerses: number; versions: string[] };
}> {
  const isLoaded = (await AsyncStorage.getItem(DATA_LOADED_KEY)) === 'true';

  if (isLoaded) {
    try {
      // Verificar que realmente hay datos en la base de datos
      const db = await bibleDB.getDatabase();
      const result = await db.getFirstAsync<{ count: number, versions: string }>(
        'SELECT COUNT(*) as count, GROUP_CONCAT(DISTINCT version) as versions FROM verses'
      );

      if (result && result.count > 0) {
        return {
          isLoaded: true,
          stats: {
            totalVerses: result.count,
            versions: result.versions ? result.versions.split(',') : []
          }
        };
      }
    } catch (error) {
      console.warn('Could not check database stats:', error);
    }
  }

  return { isLoaded: false };
}

export async function resetBibleData(options?: {
  includeNotes?: boolean;
  includeBookmarks?: boolean;
}): Promise<void> {
  console.log('🔄 Resetting Bible data...');

  // Limpiar flags de AsyncStorage (both old and new keys)
  await AsyncStorage.removeItem(DATA_LOADED_KEY);
  await AsyncStorage.removeItem('@bible_data_loaded_rvr1960'); // Old key for backward compatibility

  // Limpiar la base de datos
  try {
    const db = await bibleDB.getDatabase();

    // Siempre borrar versículos
    await db.execAsync('DELETE FROM verses;');
    await db.execAsync('DELETE FROM verses_fts;');
    console.log('✅ Verses cleared');

    // Opcionalmente borrar notas
    if (options?.includeNotes) {
      await db.execAsync('DELETE FROM notes;');
      console.log('✅ Notes cleared');
    }

    // Opcionalmente borrar favoritos
    if (options?.includeBookmarks) {
      await db.execAsync('DELETE FROM bookmarks;');
      console.log('✅ Bookmarks cleared');
    }

    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }

  console.log('✅ Bible data reset complete - app will reload data on next launch');
}
