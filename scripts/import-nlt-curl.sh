#!/bin/bash

# NLT Bible Import Script using curl
# This script uses curl instead of Node.js https to avoid DNS issues

API_KEY="$1"
BIBLE_ID="$2"

if [ -z "$API_KEY" ] || [ -z "$BIBLE_ID" ]; then
  echo "❌ Usage: ./import-nlt-curl.sh <API_KEY> <BIBLE_ID>"
  echo ""
  echo "Example:"
  echo "  ./import-nlt-curl.sh YOUR_API_KEY de4e12af7f28f599-02"
  exit 1
fi

API_BASE="https://api.scripture.api.bible/v1"
OUTPUT_FILE="../src/lib/database/bible-data-nlt.ts"
TEMP_FILE="/tmp/nlt-verses.json"

echo "📖 Starting NLT Bible data import..."
echo "🔑 Using Bible ID: $BIBLE_ID"
echo ""

# Initialize JSON array
echo "[" > "$TEMP_FILE"

# Fetch books
echo "📚 Fetching books..."
BOOKS_JSON=$(curl -s -H "api-key: $API_KEY" "$API_BASE/bibles/$BIBLE_ID/books")

# Parse books (using basic bash/jq if available, or python)
if command -v jq &> /dev/null; then
  BOOK_IDS=($(echo "$BOOKS_JSON" | jq -r '.data[].id'))
  BOOK_NAMES=($(echo "$BOOKS_JSON" | jq -r '.data[].name'))
  BOOK_COUNT=${#BOOK_IDS[@]}
else
  echo "❌ jq not found. Installing..."
  # Try using node instead
  BOOK_COUNT=$(echo "$BOOKS_JSON" | node -e "const data = JSON.parse(require('fs').readFileSync(0, 'utf-8')); console.log(data.data.length);")
fi

echo "✅ Found books"
echo ""

TOTAL_VERSES=0
FIRST_VERSE=true

# For simplicity, let's create a Node.js version that uses child_process with curl
node - <<'NODESCRIPT' "$API_KEY" "$BIBLE_ID" "$TEMP_FILE"
const { execSync } = require('child_process');
const fs = require('fs');

const API_KEY = process.argv[1];
const BIBLE_ID = process.argv[2];
const OUTPUT_FILE = process.argv[3];

const API_BASE = 'https://api.scripture.api.bible/v1';

function curlRequest(url) {
  try {
    const result = execSync(
      `curl -s -H "api-key: ${API_KEY}" "${url}"`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );
    return JSON.parse(result);
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error.message);
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const allVerses = [];
  let totalVerses = 0;

  // Get books
  console.log('📚 Fetching books...');
  const booksResponse = curlRequest(`${API_BASE}/bibles/${BIBLE_ID}/books`);

  if (!booksResponse || !booksResponse.data) {
    console.error('❌ Failed to fetch books');
    process.exit(1);
  }

  const books = booksResponse.data;
  console.log(`✅ Found ${books.length} books\n`);

  for (let bookIndex = 0; bookIndex < books.length; bookIndex++) {
    const book = books[bookIndex];
    const bookId = book.id;
    const bookName = book.name;
    const bookNumber = bookIndex + 1;

    console.log(`📖 [${bookNumber}/${books.length}] Processing: ${bookName} (${bookId})`);

    // Get chapters
    const chaptersResponse = curlRequest(`${API_BASE}/bibles/${BIBLE_ID}/books/${bookId}/chapters`);

    if (!chaptersResponse || !chaptersResponse.data) {
      console.log(`   ⚠️  Failed to fetch chapters`);
      continue;
    }

    const chapters = chaptersResponse.data.filter(ch => ch.number !== 'intro');

    for (const chapter of chapters) {
      const chapterId = chapter.id;
      const chapterNumber = parseInt(chapter.number);

      if (isNaN(chapterNumber)) continue;

      console.log(`   Chapter ${chapterNumber}...`);

      // Get verses
      await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting

      const versesResponse = curlRequest(`${API_BASE}/bibles/${BIBLE_ID}/chapters/${chapterId}/verses`);

      if (!versesResponse || !versesResponse.data) {
        console.log(`   ⚠️  Failed to fetch verses`);
        continue;
      }

      const verses = versesResponse.data;

      for (const verse of verses) {
        const verseNumber = parseInt(verse.number);
        if (isNaN(verseNumber)) continue;

        // Get verse content
        await new Promise(resolve => setTimeout(resolve, 100));

        const verseContent = curlRequest(
          `${API_BASE}/bibles/${BIBLE_ID}/verses/${verse.id}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`
        );

        if (!verseContent || !verseContent.data) {
          continue;
        }

        const verseText = verseContent.data.content.trim();

        allVerses.push({
          book: bookName,
          book_id: bookNumber,
          chapter: chapterNumber,
          verse: verseNumber,
          text: verseText,
          version: 'NLT',
        });

        totalVerses++;
      }

      console.log(`   ✅ Chapter ${chapterNumber} complete (${verses.length} verses)`);
    }

    console.log(`✅ ${bookName} complete\n`);
  }

  // Save to TypeScript file
  const outputPath = '../src/lib/database/bible-data-nlt.ts';
  console.log(`\n💾 Saving ${totalVerses} verses to bible-data-nlt.ts...`);

  const fileContent = `// NLT Bible Data
// Generated on ${new Date().toISOString()}
// Total verses: ${totalVerses}

export const NLT_DATA = ${JSON.stringify(allVerses, null, 2)};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf8');

  console.log(`\n✅ Import complete!`);
  console.log(`📊 Total verses imported: ${totalVerses.toLocaleString()}`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`\n🎉 NLT Bible data is ready to use!`);
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
NODESCRIPT

echo ""
echo "✅ Script complete!"
