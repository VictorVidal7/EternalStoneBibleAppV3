#!/bin/bash

# Pure bash/curl script to download KJV Bible
# Uses only curl and jq, no Node.js or Python

VERSION="KJV"
API_URL="https://getbible.net/v2/kjv"
OUTPUT_FILE="../src/lib/database/bible-data-kjv.ts"

echo "📖 Starting $VERSION Bible data import using bash+curl..."
echo ""

# Book mapping
declare -a BOOKS=("Genesis" "Exodus" "Leviticus" "Numbers" "Deuteronomy" "Joshua" "Judges" "Ruth" "1 Samuel" "2 Samuel" "1 Kings" "2 Kings" "1 Chronicles" "2 Chronicles" "Ezra" "Nehemiah" "Esther" "Job" "Psalms" "Proverbs" "Ecclesiastes" "Song of Solomon" "Isaiah" "Jeremiah" "Lamentations" "Ezekiel" "Daniel" "Hosea" "Joel" "Amos" "Obadiah" "Jonah" "Micah" "Nahum" "Habakkuk" "Zephaniah" "Haggai" "Zechariah" "Malachi" "Matthew" "Mark" "Luke" "John" "Acts" "Romans" "1 Corinthians" "2 Corinthians" "Galatians" "Ephesians" "Philippians" "Colossians" "1 Thessalonians" "2 Thessalonians" "1 Timothy" "2 Timothy" "Titus" "Philemon" "Hebrews" "James" "1 Peter" "2 Peter" "1 John" "2 John" "3 John" "Jude" "Revelation")

declare -a CHAPTERS=(50 40 27 36 34 24 21 4 31 24 22 25 29 36 10 13 10 42 150 31 12 8 66 52 5 48 12 14 3 9 1 4 7 3 3 3 2 14 4 28 16 24 21 28 16 16 13 6 6 4 4 5 3 6 4 3 1 13 5 5 3 5 1 1 1 22)

# Start JSON file
echo "// KJV Bible Data" > "$OUTPUT_FILE"
echo "// Generated on $(date -Iseconds)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "export const KJV_DATA = [" >> "$OUTPUT_FILE"

TOTAL_VERSES=0
FIRST_VERSE=true

# Loop through books
for book_idx in {0..65}; do
    book_num=$((book_idx + 1))
    book_name="${BOOKS[$book_idx]}"
    chapter_count="${CHAPTERS[$book_idx]}"

    echo "📖 [$book_num/66] $book_name..."

    # Loop through chapters
    for chapter in $(seq 1 $chapter_count); do
        sleep 0.1  # Rate limiting

        # Fetch chapter data
        url="$API_URL/$book_num/$chapter.json"
        response=$(curl -s "$url" 2>/dev/null)

        if [ $? -eq 0 ] && [ -n "$response" ]; then
            # Extract verses using jq
            verses=$(echo "$response" | jq -r '.verses[]? | @json' 2>/dev/null)

            if [ -n "$verses" ]; then
                while IFS= read -r verse_json; do
                    verse_num=$(echo "$verse_json" | jq -r '.verse')
                    verse_text=$(echo "$verse_json" | jq -r '.text' | sed 's/<[^>]*>//g' | sed 's/"/\\"/g')

                    # Add comma if not first verse
                    if [ "$FIRST_VERSE" = false ]; then
                        echo "," >> "$OUTPUT_FILE"
                    fi
                    FIRST_VERSE=false

                    # Write verse object
                    cat >> "$OUTPUT_FILE" << EOF
  {
    "book": "$book_name",
    "book_id": $book_num,
    "chapter": $chapter,
    "verse": $verse_num,
    "text": "$verse_text",
    "version": "$VERSION"
  }EOF

                    ((TOTAL_VERSES++))
                done <<< "$verses"
            fi
        fi
    done

    echo "   ✅ Complete"
done

# Close JSON array
echo "" >> "$OUTPUT_FILE"
echo "];" >> "$OUTPUT_FILE"

echo ""
echo "✅ Import complete!"
echo "📊 Total verses: $TOTAL_VERSES"
echo "📁 Saved to: $OUTPUT_FILE"
