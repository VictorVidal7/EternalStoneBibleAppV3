import AsyncStorage from '@react-native-async-storage/async-storage';
import bibleDB from './index';

const DATA_LOADED_KEY = '@bible_data_loaded_rvr1960';

export async function initializeBibleData(
    onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  try {
    console.log('🔵 Starting initialization...');
    
    const isLoaded = await AsyncStorage.getItem(DATA_LOADED_KEY);
    
    if (isLoaded === 'true') {
      console.log('🟢 Data already loaded, skipping');
      return;
    }

    console.log('🟡 Initializing empty database for testing...');
    await bibleDB.initialize();
    
    // Por ahora, solo marcamos como cargado sin insertar datos
    // Esto nos permitirá ver si la app funciona sin los datos
    await AsyncStorage.setItem(DATA_LOADED_KEY, 'true');
    
    console.log('✅ Test initialization complete');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    throw error;
  }
}

export async function checkDataStatus(): Promise<{
  isLoaded: boolean;
  stats?: { totalVerses: number; versions: string[] };
}> {
  const isLoaded = (await AsyncStorage.getItem(DATA_LOADED_KEY)) === 'true';
  return { isLoaded };
}

export async function resetBibleData(): Promise<void> {
  await AsyncStorage.removeItem(DATA_LOADED_KEY);
}
