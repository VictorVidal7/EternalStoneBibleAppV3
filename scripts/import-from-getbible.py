#!/usr/bin/env python3
"""
Import Bible from getBible.net
Free API, no authentication required
"""

import json
import time
import sys
import urllib.request
from datetime import datetime

# Book mapping (getBible uses book numbers)
BOOKS = [
    {"id": 1, "name": "Genesis", "abbr": "Gen"},
    {"id": 2, "name": "Exodus", "abbr": "Exod"},
    {"id": 3, "name": "Leviticus", "abbr": "Lev"},
    {"id": 4, "name": "Numbers", "abbr": "Num"},
    {"id": 5, "name": "Deuteronomy", "abbr": "Deut"},
    {"id": 6, "name": "Joshua", "abbr": "Josh"},
    {"id": 7, "name": "Judges", "abbr": "Judg"},
    {"id": 8, "name": "Ruth", "abbr": "Ruth"},
    {"id": 9, "name": "1 Samuel", "abbr": "1Sam"},
    {"id": 10, "name": "2 Samuel", "abbr": "2Sam"},
    {"id": 11, "name": "1 Kings", "abbr": "1Kgs"},
    {"id": 12, "name": "2 Kings", "abbr": "2Kgs"},
    {"id": 13, "name": "1 Chronicles", "abbr": "1Chr"},
    {"id": 14, "name": "2 Chronicles", "abbr": "2Chr"},
    {"id": 15, "name": "Ezra", "abbr": "Ezra"},
    {"id": 16, "name": "Nehemiah", "abbr": "Neh"},
    {"id": 17, "name": "Esther", "abbr": "Esth"},
    {"id": 18, "name": "Job", "abbr": "Job"},
    {"id": 19, "name": "Psalms", "abbr": "Ps"},
    {"id": 20, "name": "Proverbs", "abbr": "Prov"},
    {"id": 21, "name": "Ecclesiastes", "abbr": "Eccl"},
    {"id": 22, "name": "Song of Solomon", "abbr": "Song"},
    {"id": 23, "name": "Isaiah", "abbr": "Isa"},
    {"id": 24, "name": "Jeremiah", "abbr": "Jer"},
    {"id": 25, "name": "Lamentations", "abbr": "Lam"},
    {"id": 26, "name": "Ezekiel", "abbr": "Ezek"},
    {"id": 27, "name": "Daniel", "abbr": "Dan"},
    {"id": 28, "name": "Hosea", "abbr": "Hos"},
    {"id": 29, "name": "Joel", "abbr": "Joel"},
    {"id": 30, "name": "Amos", "abbr": "Amos"},
    {"id": 31, "name": "Obadiah", "abbr": "Obad"},
    {"id": 32, "name": "Jonah", "abbr": "Jonah"},
    {"id": 33, "name": "Micah", "abbr": "Mic"},
    {"id": 34, "name": "Nahum", "abbr": "Nah"},
    {"id": 35, "name": "Habakkuk", "abbr": "Hab"},
    {"id": 36, "name": "Zephaniah", "abbr": "Zeph"},
    {"id": 37, "name": "Haggai", "abbr": "Hag"},
    {"id": 38, "name": "Zechariah", "abbr": "Zech"},
    {"id": 39, "name": "Malachi", "abbr": "Mal"},
    {"id": 40, "name": "Matthew", "abbr": "Matt"},
    {"id": 41, "name": "Mark", "abbr": "Mark"},
    {"id": 42, "name": "Luke", "abbr": "Luke"},
    {"id": 43, "name": "John", "abbr": "John"},
    {"id": 44, "name": "Acts", "abbr": "Acts"},
    {"id": 45, "name": "Romans", "abbr": "Rom"},
    {"id": 46, "name": "1 Corinthians", "abbr": "1Cor"},
    {"id": 47, "name": "2 Corinthians", "abbr": "2Cor"},
    {"id": 48, "name": "Galatians", "abbr": "Gal"},
    {"id": 49, "name": "Ephesians", "abbr": "Eph"},
    {"id": 50, "name": "Philippians", "abbr": "Phil"},
    {"id": 51, "name": "Colossians", "abbr": "Col"},
    {"id": 52, "name": "1 Thessalonians", "abbr": "1Thess"},
    {"id": 53, "name": "2 Thessalonians", "abbr": "2Thess"},
    {"id": 54, "name": "1 Timothy", "abbr": "1Tim"},
    {"id": 55, "name": "2 Timothy", "abbr": "2Tim"},
    {"id": 56, "name": "Titus", "abbr": "Titus"},
    {"id": 57, "name": "Philemon", "abbr": "Phlm"},
    {"id": 58, "name": "Hebrews", "abbr": "Heb"},
    {"id": 59, "name": "James", "abbr": "Jas"},
    {"id": 60, "name": "1 Peter", "abbr": "1Pet"},
    {"id": 61, "name": "2 Peter", "abbr": "2Pet"},
    {"id": 62, "name": "1 John", "abbr": "1John"},
    {"id": 63, "name": "2 John", "abbr": "2John"},
    {"id": 64, "name": "3 John", "abbr": "3John"},
    {"id": 65, "name": "Jude", "abbr": "Jude"},
    {"id": 66, "name": "Revelation", "abbr": "Rev"},
]

# Chapter counts per book
CHAPTER_COUNTS = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22]

def get_version_code(version_name):
    """Map version names to getBible codes"""
    versions = {
        'kjv': 'kjv',
        'web': 'web',
        'asv': 'asv',
        'ylt': 'ylt',
        'rvr60': 'rvr60',  # Spanish
        'rv1909': 'rv1909',  # Spanish
    }
    return versions.get(version_name.lower())

def main():
    if len(sys.argv) < 2:
        print("❌ Usage: python3 import-from-getbible.py <VERSION>")
        print("\nAvailable versions:")
        print("  kjv    - King James Version (English)")
        print("  web    - World English Bible (English)")
        print("  asv    - American Standard Version (English)")
        print("  ylt    - Young's Literal Translation (English)")
        print("  rvr60  - Reina Valera 1960 (Spanish)")
        print("  rv1909 - Reina Valera 1909 (Spanish)")
        sys.exit(1)

    version_input = sys.argv[1].lower()
    version_code = get_version_code(version_input)

    if not version_code:
        print(f"❌ Unknown version: {version_input}")
        sys.exit(1)

    version_upper = version_input.upper()

    print(f"📖 Importing {version_upper} from getBible.net...")
    print("🌐 No authentication required\n")

    all_verses = []
    total_verses = 0

    for book_idx, book in enumerate(BOOKS):
        book_num = book['id']
        book_name = book['name']
        chapter_count = CHAPTER_COUNTS[book_idx]

        print(f"📖 [{book_num}/66] {book_name}...", end='', flush=True)

        book_verses = 0

        for chapter in range(1, chapter_count + 1):
            time.sleep(0.1)  # Be nice to the API

            url = f"https://getbible.net/v2/{version_code}/{book_num}/{chapter}.json"

            try:
                with urllib.request.urlopen(url, timeout=30) as response:
                    data = json.loads(response.read().decode())

                    if 'verses' in data:
                        for verse_data in data['verses']:
                            verse_num = verse_data.get('verse', 0)
                            verse_text = verse_data.get('text', '').strip()

                            # Remove HTML tags if any
                            import re
                            verse_text = re.sub(r'<[^>]+>', '', verse_text)

                            all_verses.append({
                                'book': book_name,
                                'book_id': book_num,
                                'chapter': chapter,
                                'verse': verse_num,
                                'text': verse_text,
                                'version': version_upper,
                            })

                            total_verses += 1
                            book_verses += 1

            except Exception as e:
                print(f" ⚠️  Ch.{chapter} failed", end='')
                continue

        print(f" ✅ ({book_verses} verses)")

    # Save to TypeScript file
    output_filename = f"bible-data-{version_input.lower()}.ts"
    output_path = f"../src/lib/database/{output_filename}"

    print(f"\n💾 Saving {total_verses} verses to {output_filename}...")

    file_content = f"""// {version_upper} Bible Data
// Generated from getBible.net on {datetime.now().isoformat()}
// Total verses: {total_verses}

export const {version_upper}_DATA = {json.dumps(all_verses, indent=2, ensure_ascii=False)};
"""

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(file_content)

    file_size_mb = len(file_content.encode('utf-8')) / (1024 * 1024)

    print(f"\n✅ Import complete!")
    print(f"📊 Total verses: {total_verses:,}")
    print(f"📁 File: {output_path}")
    print(f"📦 Size: {file_size_mb:.2f} MB")
    print(f"\n🎉 {version_upper} Bible data is ready to use!")

if __name__ == '__main__':
    main()
