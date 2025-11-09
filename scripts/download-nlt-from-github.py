#!/usr/bin/env python3
"""
Download and convert NLT Bible data from GitHub repository
Uses pre-existing JSON data from mrk214/bible-data-en-eng
"""

import json
import urllib.request
import sys

print("📖 Downloading NLT Bible data from GitHub...")
print("🌐 Source: mrk214/bible-data-en-eng")
print()

# URL to the NLT JSON file
NLT_URL = "https://raw.githubusercontent.com/mrk214/bible-data-en-eng/main/data/en___eng___eng/NLT_vid_116.json"

try:
    print("⬇️  Downloading NLT data...")

    # Download the file
    req = urllib.request.Request(NLT_URL)
    req.add_header('User-Agent', 'Mozilla/5.0')

    with urllib.request.urlopen(req, timeout=60) as response:
        raw_data = json.loads(response.read().decode())

    print("✅ Download complete!")
    print()
    print("🔄 Converting to app format...")

    verses = []
    total_verses = 0

    # Get books array
    books = raw_data.get('books', [])

    if not books:
        print("❌ No books found in source data")
        sys.exit(1)

    print(f"📚 Found {len(books)} books")
    print()

    # Process each book
    for book_idx, book_data in enumerate(books):
        book_name = book_data.get('name', 'Unknown')
        book_id = book_idx + 1
        chapters = book_data.get('chapters', [])

        print(f"📖 [{book_id}/66] {book_name}...", end='', flush=True)

        book_verse_count = 0

        # Process each chapter
        for chapter_idx, chapter_data in enumerate(chapters):
            chapter_num = chapter_idx + 1
            items = chapter_data.get('items', [])

            # Process each item (filter for verses only)
            for item in items:
                if item.get('type') == 'verse':
                    verse_numbers = item.get('verse_numbers', [])
                    lines = item.get('lines', [])

                    # Join all lines into one text
                    verse_text = ' '.join(lines).strip()

                    # Handle multiple verse numbers (e.g., combined verses)
                    if verse_numbers:
                        for verse_num in verse_numbers:
                            verses.append({
                                'book': book_name,
                                'book_id': book_id,
                                'chapter': chapter_num,
                                'verse': verse_num,
                                'text': verse_text,
                                'version': 'NLT'
                            })
                            book_verse_count += 1
                            total_verses += 1

        print(f" ✅ ({book_verse_count} verses)")

    # Save to TypeScript file
    output_path = '../src/lib/database/bible-data-nlt.ts'

    print()
    print(f"💾 Saving {total_verses} verses to bible-data-nlt.ts...")

    from datetime import datetime

    file_content = f"""// NLT Bible Data
// Source: mrk214/bible-data-en-eng (GitHub)
// Downloaded: {datetime.now().isoformat()}
// Total verses: {total_verses}

export const NLT_DATA = {json.dumps(verses, indent=2, ensure_ascii=False)};
"""

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(file_content)

    file_size_mb = len(file_content.encode('utf-8')) / (1024 * 1024)

    print()
    print("✅ Conversion complete!")
    print(f"📊 Total verses: {total_verses:,}")
    print(f"📁 File: {output_path}")
    print(f"📦 Size: {file_size_mb:.2f} MB")
    print()
    print("🎉 NLT Bible data is ready to use!")
    print()
    print("Next steps:")
    print("1. Uncomment NLT section in src/lib/database/data-loader.ts (lines 16-20)")
    print("2. Update src/hooks/useBibleVersion.tsx to activate NLT")
    print("3. Reset Bible data in the app Settings")
    print("4. Reopen the app")

except urllib.error.URLError as e:
    print(f"\n❌ Network error: {e}")
    print("\nTry:")
    print("1. Check your internet connection")
    print("2. Try again in a few moments")
    print("3. Download manually from:")
    print("   https://github.com/mrk214/bible-data-en-eng")
    sys.exit(1)

except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
