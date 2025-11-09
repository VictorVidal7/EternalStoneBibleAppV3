# Bible Translation Data - Options and Recommendations

## Summary

NLT (New Living Translation) and NTV (Nueva Traducción Viviente) are both **copyrighted** by Tyndale House Foundation and **not available as open-source data**. However, there are several legal options to add more Bible versions to the app.

---

## Current Status

✅ **Already Implemented:**
- RVR1960 (Reina Valera 1960) - Spanish
- Multi-version support system is ready
- UI shows version selector in Settings
- Database supports multiple versions

⏳ **Pending:**
- NLT/NTV data import
- Alternative version options

---

## Option 1: Use API.Bible for NLT (Recommended for NLT)

### Pros:
- ✅ Legal and official
- ✅ Free for non-commercial use
- ✅ Good API documentation
- ✅ Script already created (`import-bible-data.js`)

### Cons:
- ⚠️ Requires free account signup
- ⚠️ Takes 2-3 hours to download (due to rate limiting)
- ⚠️ May have usage restrictions

### How to Use:

1. **Sign up for free API key:**
   - Visit: https://scripture.api.bible/signup
   - Create account (free)
   - Copy your API key

2. **Run the import script:**
   ```bash
   node scripts/import-bible-data.js YOUR_API_KEY de4e12af7f28f599-02
   ```

3. **Wait for completion:**
   - Process takes ~2-3 hours
   - Creates: `src/lib/database/bible-data-nlt.ts`

4. **Update the data loader:**
   - Uncomment NLT section in `src/lib/database/data-loader.ts` (lines 15-20)

5. **Reset Bible data:**
   - Go to Settings → Reset Bible Data
   - Select "Only Verses"
   - Reopen app

### Available Bible IDs on API.Bible:
- `de4e12af7f28f599-02` - NLT (English)
- `592420522e16049f-01` - RVR1960 (Spanish, already have this)
- More at: https://scripture.api.bible/livedocs

---

## Option 2: Use Free Public Domain Translations

### Pros:
- ✅ Completely free and legal
- ✅ No authentication needed
- ✅ Faster download (~30-60 minutes)
- ✅ Script already created (`import-bible-simple.js`)

### Cons:
- ⚠️ Not NLT/NTV specifically
- ⚠️ Older language style (but still accurate)

### Available Versions:

| Code | Translation | Language | Year | Notes |
|------|------------|----------|------|-------|
| **kjv** | King James Version | English | 1611 | Classic, widely used |
| **web** | World English Bible | English | Modern | Modern English, public domain |
| **rv1909** | Reina Valera 1909 | Spanish | 1909 | Public domain Spanish Bible |

### How to Use:

1. **Run the import script:**
   ```bash
   # For English (KJV)
   node scripts/import-bible-simple.js kjv

   # For English (Modern)
   node scripts/import-bible-simple.js web

   # For Spanish (Alternative to RVR1960)
   node scripts/import-bible-simple.js rv1909
   ```

2. **Wait for completion:**
   - Takes ~30-60 minutes
   - Shows progress in console

3. **Update the data loader:**
   - Add the new version to `BIBLE_VERSIONS` array in `data-loader.ts`

4. **Update version selector:**
   - Add the version info to `useBibleVersion.tsx`

---

## Option 3: Contact Tyndale House for NTV

### For NTV specifically:

NTV (Nueva Traducción Viviente) is the Spanish equivalent of NLT, also copyrighted by Tyndale House Foundation.

**Options:**
1. **Contact Tyndale directly:**
   - Website: https://www.tyndale.com/ntv
   - Email: permissions@tyndale.com
   - Explain your non-commercial app use case

2. **Check if NTV is available on API.Bible:**
   - Some users report NTV might be available
   - Would require same process as Option 1

3. **Alternative:** Use a different modern Spanish translation that's available

---

## Option 4: Use getbible.net API

### Pros:
- ✅ Free, no authentication
- ✅ Multiple translations
- ✅ Simpler API

### Cons:
- ⚠️ Limited modern translations
- ⚠️ May not have NLT/NTV

### Available Translations:
Visit: https://getbible.net/v2/translations.json

---

## Recommendation for Your App

Given your requirements, I recommend this approach:

### Phase 1 - Immediate (Free & Legal):
1. **Add KJV for English:**
   ```bash
   node scripts/import-bible-simple.js kjv
   ```
   - Most widely recognized English Bible
   - Public domain, no legal issues
   - Classic but still very usable

2. **Keep RVR1960 for Spanish:**
   - Already implemented
   - Well-known and trusted

### Phase 2 - If you want NLT:
1. Sign up for API.Bible (free)
2. Import NLT using the API script
3. Takes time but worth it for modern English

### Phase 3 - For NTV:
1. Contact Tyndale House to request permission
2. Or use another modern Spanish translation

---

## How to Add a New Version

After you have the data file (from any method above):

### 1. Update `src/lib/database/data-loader.ts`:

```typescript
const BIBLE_VERSIONS = [
  {
    id: 'RVR1960',
    name: 'Reina Valera 1960',
    dataFile: './bible-data-rvr1960',
    exportName: 'RVR1960_DATA',
  },
  {
    id: 'KJV',  // NEW VERSION
    name: 'King James Version',
    dataFile: './bible-data-kjv',
    exportName: 'KJV_DATA',
  },
];
```

### 2. Update `src/hooks/useBibleVersion.tsx`:

```typescript
export const AVAILABLE_VERSIONS: BibleVersion[] = [
  {
    id: 'RVR1960',
    name: 'Reina Valera 1960',
    abbreviation: 'RVR1960',
    language: 'es',
    year: '1960',
  },
  {
    id: 'KJV',  // NEW VERSION
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'en',
    year: '1611',
  },
  // Remove "Coming Soon" versions or make them active
];
```

### 3. Test:
- Reset Bible data in Settings
- Reopen app
- Check version selector
- Test searching and reading

---

## Quick Start - Try KJV Now

Want to test the system with a free version right away?

```bash
# 1. Import KJV data (takes ~30-60 min)
node scripts/import-bible-simple.js kjv

# 2. After it completes, edit data-loader.ts and uncomment KJV section

# 3. Edit useBibleVersion.tsx to add KJV to available versions

# 4. Reset Bible data in app Settings

# 5. Reopen app - KJV should now be available!
```

---

## Legal Considerations

### ✅ Safe to Use (Public Domain):
- KJV (King James Version)
- WEB (World English Bible)
- RV1909 (Reina Valera 1909)
- ASV (American Standard Version)

### ⚠️ Requires Permission/License:
- NLT (New Living Translation) - Via API.Bible for non-commercial
- NTV (Nueva Traducción Viviente) - Contact Tyndale House
- NIV (New International Version)
- ESV (English Standard Version)
- Most modern translations

### This App:
- Is for **personal, non-commercial use**
- Does not charge users
- Should be fine to use API.Bible's free tier
- Should contact publishers for explicit permission if distributing widely

---

## Questions?

1. **Do you want me to add KJV immediately as a test?**
   - I can run the import script and configure it

2. **Do you want to get an API.Bible key for NLT?**
   - I'll guide you through the process

3. **Do you want to contact Tyndale about NTV?**
   - I can draft an email template

4. **Do you want to use different modern translations instead?**
   - I can research other options

Let me know which path you'd like to take!
