/**
 * Bible Data Import Script
 * Fetches Bible data from API.Bible and formats it for the app
 *
 * Usage:
 * 1. Get API key from https://scripture.api.bible/signup
 * 2. Run: node scripts/import-bible-data.js <API_KEY> <BIBLE_ID>
 *
 * Available Bible IDs:
 * - de4e12af7f28f599-02 (NLT - New Living Translation)
 * - 592420522e16049f-01 (RVR1960 - Reina Valera 1960)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'api.scripture.api.bible';
const API_KEY = process.argv[2];
const BIBLE_ID = process.argv[3];

if (!API_KEY || !BIBLE_ID) {
  console.error('❌ Usage: node import-bible-data.js <API_KEY> <BIBLE_ID>');
  console.error('\nGet your API key from: https://scripture.api.bible/signup');
  console.error('\nAvailable Bible IDs:');
  console.error('  - de4e12af7f28f599-02 (NLT)');
  console.error('  - 592420522e16049f-01 (RVR1960)');
  process.exit(1);
}

const versionMap = {
  'de4e12af7f28f599-02': 'NLT',
  '592420522e16049f-01': 'RVR1960',
  // Add more as needed
};

const VERSION_CODE = versionMap[BIBLE_ID] || BIBLE_ID;

console.log(`\n📖 Starting Bible data import for ${VERSION_CODE}...`);
console.log(`🔑 Using Bible ID: ${BIBLE_ID}\n`);

// Make HTTPS request helper
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_BASE_URL,
      path: path,
      method: 'GET',
      headers: {
        'api-key': API_KEY,
      },
    };

    https.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Sleep helper to respect rate limits
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchBibleData() {
  try {
    const allVerses = [];
    let totalVerses = 0;

    // Step 1: Get all books
    console.log('📚 Fetching books...');
    const booksResponse = await makeRequest(`/v1/bibles/${BIBLE_ID}/books`);
    const books = booksResponse.data;
    console.log(`✅ Found ${books.length} books\n`);

    // Step 2: Iterate through each book
    for (let bookIndex = 0; bookIndex < books.length; bookIndex++) {
      const book = books[bookIndex];
      const bookId = book.id;
      const bookName = book.name;
      const bookNumber = bookIndex + 1;

      console.log(`📖 [${bookNumber}/${books.length}] Processing: ${bookName} (${bookId})`);

      // Get chapters for this book
      const chaptersResponse = await makeRequest(`/v1/bibles/${BIBLE_ID}/books/${bookId}/chapters`);
      const chapters = chaptersResponse.data.filter(ch => ch.number !== 'intro'); // Skip intro chapters

      for (const chapter of chapters) {
        const chapterId = chapter.id;
        const chapterNumber = parseInt(chapter.number);

        if (isNaN(chapterNumber)) continue; // Skip non-numeric chapters

        console.log(`   Chapter ${chapterNumber}...`);

        // Get verses for this chapter
        await sleep(100); // Rate limiting - 10 requests per second max
        const versesResponse = await makeRequest(`/v1/bibles/${BIBLE_ID}/chapters/${chapterId}/verses`);
        const verses = versesResponse.data;

        for (const verse of verses) {
          const verseNumber = parseInt(verse.number);
          if (isNaN(verseNumber)) continue; // Skip non-numeric verses

          // Get verse content
          await sleep(100); // Rate limiting
          const verseContent = await makeRequest(`/v1/bibles/${BIBLE_ID}/verses/${verse.id}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`);

          const verseText = verseContent.data.content.trim();

          // Format to match our structure
          allVerses.push({
            book: bookName,
            book_id: bookNumber,
            chapter: chapterNumber,
            verse: verseNumber,
            text: verseText,
            version: VERSION_CODE,
          });

          totalVerses++;
        }

        console.log(`   ✅ Chapter ${chapterNumber} complete (${verses.length} verses)`);
      }

      console.log(`✅ ${bookName} complete\n`);
    }

    // Step 3: Save to file
    const outputFileName = `bible-data-${VERSION_CODE.toLowerCase()}.ts`;
    const outputPath = path.join(__dirname, '..', 'src', 'lib', 'database', outputFileName);

    console.log(`\n💾 Saving ${totalVerses} verses to ${outputFileName}...`);

    const fileContent = `// ${VERSION_CODE} Bible Data
// Generated on ${new Date().toISOString()}
// Total verses: ${totalVerses}

export const ${VERSION_CODE}_DATA = ${JSON.stringify(allVerses, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent, 'utf8');

    console.log(`\n✅ Import complete!`);
    console.log(`📊 Total verses imported: ${totalVerses.toLocaleString()}`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`\n🎉 ${VERSION_CODE} Bible data is ready to use!`);

  } catch (error) {
    console.error('\n❌ Error during import:', error.message);
    if (error.message.includes('401')) {
      console.error('\n🔑 Check your API key. Get one from: https://scripture.api.bible/signup');
    }
    process.exit(1);
  }
}

fetchBibleData();
