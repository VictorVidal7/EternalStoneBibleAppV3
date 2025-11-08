import AsyncStorage from '@react-native-async-storage/async-storage';
import bibleDB from './index';

const DATA_LOADED_KEY = '@bible_data_loaded_rvr1960';
const CHUNK_SIZE = 1000; // Load verses in chunks

// Dynamic import to avoid loading all data at once
async function loadBibleData() {
  const { RVR1960_DATA } = await import('./bible-data-rvr1960');
  return RVR1960_DATA;
}

export async function initializeBibleData(
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  try {
    // Check if data is already loaded
    const isLoaded = await AsyncStorage.getItem(DATA_LOADED_KEY);

    if (isLoaded === 'true') {
      console.log('Bible data already loaded');
      return;
    }

    console.log('Loading Bible data for the first time...');

    // Initialize database
    await bibleDB.initialize();

    // Load the data
    const verses = await loadBibleData();
    const total = verses.length;

    console.log(`Loading ${total} verses...`);

    // Insert verses in chunks to avoid overwhelming the database
    for (let i = 0; i < verses.length; i += CHUNK_SIZE) {
      const chunk = verses.slice(i, i + CHUNK_SIZE);
      await bibleDB.insertVerses(chunk);

      if (onProgress) {
        onProgress(Math.min(i + CHUNK_SIZE, total), total);
      }

      console.log(`Loaded ${Math.min(i + CHUNK_SIZE, total)}/${total} verses`);
    }

    // Mark as loaded
    await AsyncStorage.setItem(DATA_LOADED_KEY, 'true');

    console.log('✅ Bible data loaded successfully!');
  } catch (error) {
    console.error('Error loading Bible data:', error);
    throw error;
  }
}

export async function resetBibleData(): Promise<void> {
  await bibleDB.clearAllData();
  await AsyncStorage.removeItem(DATA_LOADED_KEY);
  console.log('Bible data reset. Reload the app to re-import.');
}

export async function checkDataStatus(): Promise<{
  isLoaded: boolean;
  stats?: { totalVerses: number; versions: string[] };
}> {
  const isLoaded = (await AsyncStorage.getItem(DATA_LOADED_KEY)) === 'true';

  if (isLoaded) {
    await bibleDB.initialize();
    const stats = await bibleDB.getDatabaseStats();
    return { isLoaded: true, stats };
  }

  return { isLoaded: false };
}
