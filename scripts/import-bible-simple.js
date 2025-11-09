/**
 * Simple Bible Data Import Script (No Auth Required)
 * Uses free Bible APIs that don't require authentication
 *
 * Usage: node scripts/import-bible-simple.js <VERSION_CODE>
 *
 * Available versions:
 * - kjv (King James Version - English, Public Domain)
 * - web (World English Bible - English, Public Domain)
 * - rv1909 (Reina Valera 1909 - Spanish, Public Domain)
 * - rvr60 (Reina Valera 1960 - Spanish)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const VERSION_CODE = process.argv[2];

if (!VERSION_CODE) {
  console.error('❌ Usage: node import-bible-simple.js <VERSION_CODE>');
  console.error('\nAvailable versions:');
  console.error('  - kjv   (King James Version - English)');
  console.error('  - web   (World English Bible - English)');
  console.error('  - rv1909 (Reina Valera 1909 - Spanish)');
  console.error('  - rvr60  (Reina Valera 1960 - Spanish)');
  process.exit(1);
}

const VERSION_MAP = {
  kjv: { name: 'KJV', fullName: 'King James Version', language: 'en' },
  web: { name: 'WEB', fullName: 'World English Bible', language: 'en' },
  rv1909: { name: 'RV1909', fullName: 'Reina Valera 1909', language: 'es' },
  rvr60: { name: 'RVR1960', fullName: 'Reina Valera 1960', language: 'es' },
};

const versionInfo = VERSION_MAP[VERSION_CODE];
if (!versionInfo) {
  console.error(`❌ Unknown version: ${VERSION_CODE}`);
  process.exit(1);
}

console.log(`\n📖 Importing ${versionInfo.fullName} (${versionInfo.name})...`);
console.log(`🌐 Using getbible.net API\n`);

// Book order and names (66 books total)
const BOOKS = [
  // Old Testament
  { id: 1, name: 'Genesis', chapters: 50 },
  { id: 2, name: 'Exodus', chapters: 40 },
  { id: 3, name: 'Leviticus', chapters: 27 },
  { id: 4, name: 'Numbers', chapters: 36 },
  { id: 5, name: 'Deuteronomy', chapters: 34 },
  { id: 6, name: 'Joshua', chapters: 24 },
  { id: 7, name: 'Judges', chapters: 21 },
  { id: 8, name: 'Ruth', chapters: 4 },
  { id: 9, name: '1 Samuel', chapters: 31 },
  { id: 10, name: '2 Samuel', chapters: 24 },
  { id: 11, name: '1 Kings', chapters: 22 },
  { id: 12, name: '2 Kings', chapters: 25 },
  { id: 13, name: '1 Chronicles', chapters: 29 },
  { id: 14, name: '2 Chronicles', chapters: 36 },
  { id: 15, name: 'Ezra', chapters: 10 },
  { id: 16, name: 'Nehemiah', chapters: 13 },
  { id: 17, name: 'Esther', chapters: 10 },
  { id: 18, name: 'Job', chapters: 42 },
  { id: 19, name: 'Psalms', chapters: 150 },
  { id: 20, name: 'Proverbs', chapters: 31 },
  { id: 21, name: 'Ecclesiastes', chapters: 12 },
  { id: 22, name: 'Song of Solomon', chapters: 8 },
  { id: 23, name: 'Isaiah', chapters: 66 },
  { id: 24, name: 'Jeremiah', chapters: 52 },
  { id: 25, name: 'Lamentations', chapters: 5 },
  { id: 26, name: 'Ezekiel', chapters: 48 },
  { id: 27, name: 'Daniel', chapters: 12 },
  { id: 28, name: 'Hosea', chapters: 14 },
  { id: 29, name: 'Joel', chapters: 3 },
  { id: 30, name: 'Amos', chapters: 9 },
  { id: 31, name: 'Obadiah', chapters: 1 },
  { id: 32, name: 'Jonah', chapters: 4 },
  { id: 33, name: 'Micah', chapters: 7 },
  { id: 34, name: 'Nahum', chapters: 3 },
  { id: 35, name: 'Habakkuk', chapters: 3 },
  { id: 36, name: 'Zephaniah', chapters: 3 },
  { id: 37, name: 'Haggai', chapters: 2 },
  { id: 38, name: 'Zechariah', chapters: 14 },
  { id: 39, name: 'Malachi', chapters: 4 },
  // New Testament
  { id: 40, name: 'Matthew', chapters: 28 },
  { id: 41, name: 'Mark', chapters: 16 },
  { id: 42, name: 'Luke', chapters: 24 },
  { id: 43, name: 'John', chapters: 21 },
  { id: 44, name: 'Acts', chapters: 28 },
  { id: 45, name: 'Romans', chapters: 16 },
  { id: 46, name: '1 Corinthians', chapters: 16 },
  { id: 47, name: '2 Corinthians', chapters: 13 },
  { id: 48, name: 'Galatians', chapters: 6 },
  { id: 49, name: 'Ephesians', chapters: 6 },
  { id: 50, name: 'Philippians', chapters: 4 },
  { id: 51, name: 'Colossians', chapters: 4 },
  { id: 52, name: '1 Thessalonians', chapters: 5 },
  { id: 53, name: '2 Thessalonians', chapters: 3 },
  { id: 54, name: '1 Timothy', chapters: 6 },
  { id: 55, name: '2 Timothy', chapters: 4 },
  { id: 56, name: 'Titus', chapters: 3 },
  { id: 57, name: 'Philemon', chapters: 1 },
  { id: 58, name: 'Hebrews', chapters: 13 },
  { id: 59, name: 'James', chapters: 5 },
  { id: 60, name: '1 Peter', chapters: 5 },
  { id: 61, name: '2 Peter', chapters: 3 },
  { id: 62, name: '1 John', chapters: 5 },
  { id: 63, name: '2 John', chapters: 1 },
  { id: 64, name: '3 John', chapters: 1 },
  { id: 65, name: 'Jude', chapters: 1 },
  { id: 66, name: 'Revelation', chapters: 22 },
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchBibleData() {
  try {
    const allVerses = [];
    let totalVerses = 0;

    for (const book of BOOKS) {
      console.log(`📖 [${book.id}/66] ${book.name}...`);

      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        await sleep(200); // Be nice to the API

        try {
          // Using bible-api.com - free, no auth required
          const response = await makeRequest(
            `https://bible-api.com/${book.name}+${chapter}?translation=${VERSION_CODE}`
          );

          if (response.verses) {
            for (const verse of response.verses) {
              allVerses.push({
                book: book.name,
                book_id: book.id,
                chapter: verse.chapter,
                verse: verse.verse,
                text: verse.text.trim(),
                version: versionInfo.name,
              });
              totalVerses++;
            }
          }
        } catch (error) {
          console.log(`   ⚠️  Chapter ${chapter} failed: ${error.message}`);
        }
      }

      console.log(`   ✅ Complete (${book.chapters} chapters)`);
    }

    // Save to file
    const outputFileName = `bible-data-${versionInfo.name.toLowerCase()}.ts`;
    const outputPath = path.join(__dirname, '..', 'src', 'lib', 'database', outputFileName);

    console.log(`\n💾 Saving ${totalVerses} verses to ${outputFileName}...`);

    const fileContent = `// ${versionInfo.fullName} (${versionInfo.name})
// Language: ${versionInfo.language}
// Generated: ${new Date().toISOString()}
// Total verses: ${totalVerses}

export const ${versionInfo.name}_DATA = ${JSON.stringify(allVerses, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent, 'utf8');

    console.log(`\n✅ Import complete!`);
    console.log(`📊 Total verses: ${totalVerses.toLocaleString()}`);
    console.log(`📁 File: ${outputPath}`);
    console.log(`📦 Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

fetchBibleData();
