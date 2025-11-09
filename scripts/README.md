# Bible Data Import Scripts

This directory contains scripts to import Bible translations into the app.

## Method 1: API.Bible (Recommended for NLT)

### Prerequisites
1. Sign up for a free API key at https://scripture.api.bible/signup
2. Node.js installed on your system

### Usage

```bash
node scripts/import-bible-data.js <API_KEY> <BIBLE_ID>
```

### Available Bible IDs

| Translation | Bible ID | Language | Notes |
|------------|----------|----------|-------|
| NLT | de4e12af7f28f599-02 | English | New Living Translation |
| RVR1960 | 592420522e16049f-01 | Spanish | Reina Valera 1960 (already imported) |

### Example

```bash
# Import NLT
node scripts/import-bible-data.js your-api-key-here de4e12af7f28f599-02
```

### What it does

1. Fetches all books, chapters, and verses from API.Bible
2. Formats the data to match our app's structure
3. Saves to `src/lib/database/bible-data-{version}.ts`
4. Includes rate limiting to respect API limits (100ms between requests)

### Expected Runtime

- **Full Bible**: ~2-3 hours (due to rate limiting)
- **Progress**: Real-time console updates per chapter

### Output

Creates a TypeScript file with this structure:
```typescript
export const NLT_DATA = [
  {
    book: "Genesis",
    book_id: 1,
    chapter: 1,
    verse: 1,
    text: "In the beginning God created the heavens and the earth.",
    version: "NLT"
  },
  // ... ~31,000 more verses
];
```

## Method 2: Alternative Sources

### Open Bible Data Sources

1. **Bolls Life API** - Free, no auth required
   - https://bolls.life/get-chapters/{book}/{chapter}/
   - Supports multiple translations including NLT

2. **Bible API** - https://bible-api.com/
   - Simple REST API
   - Limited translations

3. **getbible.net** - Open source Bible data
   - JSON format available
   - Multiple translations

## After Import

Once you have the data file:

1. Update `src/lib/database/data-loader.ts` to load the new version
2. The version selector in Settings will automatically show it
3. Test thoroughly before deploying

## Legal Notes

- **NLT**: © Tyndale House Foundation. Free for non-commercial use via API.Bible
- **NTV**: © Tyndale House Foundation. May require licensing - contact Tyndale directly
- Always respect copyright and licensing terms
- This app is for personal, non-commercial use

## Troubleshooting

**API returns 401**: Check your API key
**API returns 429**: Too many requests, script already includes rate limiting
**Missing verses**: Some translations may have different verse numbering
**Large file size**: Expected - Bible data is ~5-10MB per translation
