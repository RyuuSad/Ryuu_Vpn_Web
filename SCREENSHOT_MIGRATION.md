# Screenshot Storage Migration Guide

## Problem
Currently, payment screenshots (up to 10MB) are stored as base64-encoded strings in PostgreSQL. This causes:
- Database bloat (base64 adds ~33% overhead)
- Slow queries when fetching top-up lists
- Expensive backups/restores
- Memory issues when loading large result sets

## Solution: Migrate to Object Storage

### Recommended: Cloudflare R2 (Free Tier)
- **Free**: 10GB storage, 1M Class A operations/month
- **Fast**: Global CDN
- **S3-compatible**: Easy migration path
- **Cost**: $0 for small scale

### Alternative: AWS S3, DigitalOcean Spaces

---

## Implementation Plan

### Phase 1: Add R2 Configuration (No Breaking Changes)

1. **Install AWS SDK**
```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

2. **Add Environment Variables** (`.env`)
```bash
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=ryuu-vpn-screenshots
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

3. **Create Upload Service** (`artifacts/api-server/src/lib/r2.ts`)
```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadScreenshot(buffer: Buffer, mimeType: string): Promise<string> {
  const key = `screenshots/${Date.now()}-${randomUUID()}.jpg`;
  
  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  }));

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
```

4. **Update Top-Up Route** (`artifacts/api-server/src/routes/topup.ts`)
```typescript
// OLD (base64):
const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

// NEW (R2 URL):
const screenshotUrl = await uploadScreenshot(req.file.buffer, req.file.mimetype);
```

### Phase 2: Migrate Existing Screenshots

**Migration Script** (`scripts/migrate-screenshots.ts`):
```typescript
import { db, topupRequestsTable } from "@workspace/db";
import { uploadScreenshot } from "../artifacts/api-server/src/lib/r2";

async function migrateScreenshots() {
  const topups = await db.select().from(topupRequestsTable);
  
  for (const topup of topups) {
    if (topup.screenshotUrl.startsWith("data:")) {
      // Extract base64 data
      const matches = topup.screenshotUrl.match(/^data:(.+);base64,(.+)$/);
      if (!matches) continue;
      
      const [, mimeType, base64Data] = matches;
      const buffer = Buffer.from(base64Data, "base64");
      
      // Upload to R2
      const newUrl = await uploadScreenshot(buffer, mimeType);
      
      // Update database
      await db.update(topupRequestsTable)
        .set({ screenshotUrl: newUrl })
        .where(eq(topupRequestsTable.id, topup.id));
      
      console.log(`Migrated screenshot for topup ${topup.id}`);
    }
  }
}
```

### Phase 3: Cleanup (After Migration Complete)

1. Run `VACUUM FULL` on PostgreSQL to reclaim space
2. Remove base64 handling code
3. Update screenshot endpoint to redirect to R2 URLs

---

## Cloudflare R2 Setup Steps

1. **Create R2 Bucket**
   - Go to Cloudflare Dashboard → R2
   - Create bucket: `ryuu-vpn-screenshots`
   - Enable public access (or use presigned URLs)

2. **Create API Token**
   - R2 → Manage R2 API Tokens
   - Create token with "Object Read & Write" permissions
   - Save Access Key ID and Secret Access Key

3. **Get Public URL**
   - Bucket Settings → Public Access
   - Copy the public URL (e.g., `https://pub-xxxxx.r2.dev`)

---

## Estimated Impact

### Before Migration
- Database size: ~500MB (with 1000 screenshots)
- Query time: 2-5 seconds (loading all topups)
- Backup time: 10 minutes

### After Migration
- Database size: ~50MB (90% reduction)
- Query time: 100-200ms (20x faster)
- Backup time: 1 minute
- Screenshot loading: Direct from CDN (faster for users)

---

## Rollback Plan

If migration fails:
1. Keep old base64 data in database during migration
2. Add new column `screenshot_r2_url` instead of replacing
3. Fall back to base64 if R2 URL is null
4. Only delete base64 data after confirming R2 works

---

## Cost Estimate

**Cloudflare R2 Free Tier**:
- 10GB storage (enough for ~10,000 screenshots)
- 1M Class A operations/month (uploads)
- 10M Class B operations/month (downloads)
- Free egress (no bandwidth charges)

**If you exceed free tier**:
- Storage: $0.015/GB/month
- Class A operations: $4.50/million
- Class B operations: $0.36/million

**Example**: 50,000 screenshots/month = ~$5/month (still cheaper than database costs)

---

## Next Steps

1. Create Cloudflare R2 account
2. Set up bucket and get credentials
3. Test upload with one screenshot
4. Deploy new code (backward compatible)
5. Run migration script
6. Monitor for errors
7. Clean up old data

**Status**: Ready to implement when you have R2 credentials
