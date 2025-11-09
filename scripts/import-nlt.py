#!/usr/bin/env python3
"""
NLT Bible Import Script using Python
Uses Python's requests library to avoid Node.js DNS issues
"""

import json
import time
import sys
import urllib.request
import urllib.error
from datetime import datetime

def make_request(url, api_key):
    """Make HTTP request with API key"""
    try:
        req = urllib.request.Request(url)
        req.add_header('api-key', api_key)
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"   ⚠️  Request failed: {e}")
        return None

def main():
    if len(sys.argv) < 3:
        print("❌ Usage: python3 import-nlt.py <API_KEY> <BIBLE_ID>")
        print("\nExample:")
        print("  python3 import-nlt.py YOUR_API_KEY de4e12af7f28f599-02")
        sys.exit(1)

    API_KEY = sys.argv[1]
    BIBLE_ID = sys.argv[2]
    API_BASE = 'https://api.scripture.api.bible/v1'

    print("📖 Starting NLT Bible data import...")
    print(f"🔑 Using Bible ID: {BIBLE_ID}\n")

    all_verses = []
    total_verses = 0

    # Step 1: Get all books
    print("📚 Fetching books...")
    books_response = make_request(f"{API_BASE}/bibles/{BIBLE_ID}/books", API_KEY)

    if not books_response or 'data' not in books_response:
        print("❌ Failed to fetch books")
        sys.exit(1)

    books = books_response['data']
    print(f"✅ Found {len(books)} books\n")

    # Step 2: Iterate through each book
    for book_index, book in enumerate(books):
        book_id = book['id']
        book_name = book['name']
        book_number = book_index + 1

        print(f"📖 [{book_number}/{len(books)}] Processing: {book_name} ({book_id})")

        # Get chapters for this book
        chapters_response = make_request(
            f"{API_BASE}/bibles/{BIBLE_ID}/books/{book_id}/chapters",
            API_KEY
        )

        if not chapters_response or 'data' not in chapters_response:
            print(f"   ⚠️  Failed to fetch chapters")
            continue

        chapters = [ch for ch in chapters_response['data'] if ch.get('number') != 'intro']

        for chapter in chapters:
            chapter_id = chapter['id']
            try:
                chapter_number = int(chapter['number'])
            except (ValueError, KeyError):
                continue

            print(f"   Chapter {chapter_number}...", end='', flush=True)

            # Get verses for this chapter
            time.sleep(0.1)  # Rate limiting - 10 req/sec max

            verses_response = make_request(
                f"{API_BASE}/bibles/{BIBLE_ID}/chapters/{chapter_id}/verses",
                API_KEY
            )

            if not verses_response or 'data' not in verses_response:
                print(" ⚠️  Failed")
                continue

            verses = verses_response['data']
            verse_count = 0

            for verse in verses:
                try:
                    verse_number = int(verse['number'])
                except (ValueError, KeyError):
                    continue

                # Get verse content
                time.sleep(0.1)  # Rate limiting

                verse_content = make_request(
                    f"{API_BASE}/bibles/{BIBLE_ID}/verses/{verse['id']}"
                    f"?content-type=text&include-notes=false&include-titles=false"
                    f"&include-chapter-numbers=false&include-verse-numbers=false",
                    API_KEY
                )

                if not verse_content or 'data' not in verse_content:
                    continue

                verse_text = verse_content['data']['content'].strip()

                all_verses.append({
                    'book': book_name,
                    'book_id': book_number,
                    'chapter': chapter_number,
                    'verse': verse_number,
                    'text': verse_text,
                    'version': 'NLT',
                })

                total_verses += 1
                verse_count += 1

            print(f" ✅ ({verse_count} verses)")

        print(f"✅ {book_name} complete\n")

    # Step 3: Save to file
    output_path = '../src/lib/database/bible-data-nlt.ts'

    print(f"\n💾 Saving {total_verses} verses to bible-data-nlt.ts...")

    file_content = f"""// NLT Bible Data
// Generated on {datetime.now().isoformat()}
// Total verses: {total_verses}

export const NLT_DATA = {json.dumps(all_verses, indent=2, ensure_ascii=False)};
"""

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(file_content)

    print(f"\n✅ Import complete!")
    print(f"📊 Total verses imported: {total_verses:,}")
    print(f"📁 Saved to: {output_path}")
    print(f"\n🎉 NLT Bible data is ready to use!")

if __name__ == '__main__':
    main()
