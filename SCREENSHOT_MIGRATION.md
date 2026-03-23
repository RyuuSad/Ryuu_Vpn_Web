# Screenshot Storage Migration Guide

## Problem
Currently, payment screenshots (up to 10MB) are stored as base64-encoded strings in PostgreSQL. This causes:
- Database bloat (base64 adds ~33% overhead)
- Slow queries when fetching top-up lists
- Expensive backups/restores
- Memory issues when loading large result sets

## Solution: Migrate to DigitalOcean Spaces

### Why DigitalOcean Spaces?
- **Simple**: Already using DigitalOcean for VPS
- **S3-compatible**: Uses standard AWS SDK
- **CDN included**: Free CDN with every Space
- **Predictable pricing**: $5/month for 250GB storage + 1TB transfer
- **No egress fees**: Unlike AWS S3

---

## Implementation Plan

### Phase 1: Add DigitalOcean Spaces Configuration (No Breaking Changes)

1. **Install AWS SDK**
```bash
pnpm add @aws-sdk/client-s3
```

2. **Add Environment Variables** (`.env`)
```bash
# DigitalOcean Spaces Configuration
SPACES_REGION=sgp1
SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
SPACES_ACCESS_KEY=your_access_key
SPACES_SECRET_KEY=your_secret_key
SPACES_BUCKET=ryuu-vpn-screenshots
SPACES_CDN_URL=https://ryuu-vpn-screenshots.sgp1.cdn.digitaloceanspaces.com
```

3. **Create Upload Service** (`artifacts/api-server/src/lib/spaces.ts`)
```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const client = new S3Client({
  region: process.env.SPACES_REGION || "sgp1",
  endpoint: process.env.SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY!,
    secretAccessKey: process.env.SPACES_SECRET_KEY!,
  },
});

export async function uploadScreenshot(buffer: Buffer, mimeType: string): Promise<string> {
  const key = `screenshots/${Date.now()}-${randomUUID()}.jpg`;
  
  await client.send(new PutObjectCommand({
    Bucket: process.env.SPACES_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ACL: "public-read", // Make publicly accessible
  }));

  return `${process.env.SPACES_CDN_URL}/${key}`;
}
```

4. **Update Top-Up Route** (`artifacts/api-server/src/routes/topup.ts`)
```typescript
import { uploadScreenshot } from "../lib/spaces.js";

// OLD (base64):
const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

// NEW (Spaces URL):
const screenshotUrl = await uploadScreenshot(req.file.buffer, req.file.mimetype);
```

### Phase 2: Migrate Existing Screenshots

**Migration Script** (`scripts/migrate-screenshots.ts`):
```typescript
import { db, topupRequestsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { uploadScreenshot } from "../artifacts/api-server/src/lib/spaces";

async function migrateScreenshots() {
  const topups = await db.select().from(topupRequestsTable);
  let migrated = 0;
  
  for (const topup of topups) {
    if (topup.screenshotUrl.startsWith("data:")) {
      // Extract base64 data
      const matches = topup.screenshotUrl.match(/^data:(.+);base64,(.+)$/);
      if (!matches) continue;
      
      const [, mimeType, base64Data] = matches;
      const buffer = Buffer.from(base64Data, "base64");
      
      // Upload to DigitalOcean Spaces
      const newUrl = await uploadScreenshot(buffer, mimeType);
      
      // Update database
      await db.update(topupRequestsTable)
        .set({ screenshotUrl: newUrl })
        .where(eq(topupRequestsTable.id, topup.id));
      
      migrated++;
      console.log(`[${migrated}] Migrated screenshot for topup ${topup.id}`);
    }
  }
  
  console.log(`\nMigration complete! Migrated ${migrated} screenshots.`);
}

migrateScreenshots().catch(console.error);
```

### Phase 3: Cleanup (After Migration Complete)

1. Run `VACUUM FULL` on PostgreSQL to reclaim space
2. Remove base64 handling code
3. Update screenshot endpoint to redirect to R2 URLs

---

## DigitalOcean Spaces Setup Steps

1. **Create a Space**
   - Go to DigitalOcean Dashboard → Spaces
   - Click "Create a Space"
   - Choose region: **Singapore (sgp1)** (closest to Myanmar)
   - Name: `ryuu-vpn-screenshots`
   - Enable CDN (included free)
   - File Listing: **Private** (only access via direct URLs)

2. **Create API Keys**
   - Spaces → Manage Keys (or API → Spaces Keys)
   - Click "Generate New Key"
   - Name: `ryuu-vpn-api`
   - Save the **Access Key** and **Secret Key** (shown only once!)

3. **Get CDN URL**
   - After creating Space, go to Settings
   - Copy the **CDN Endpoint**: `https://ryuu-vpn-screenshots.sgp1.cdn.digitaloceanspaces.com`
   - This is your `SPACES_CDN_URL`

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

**DigitalOcean Spaces Pricing**:
- **$5/month flat rate** includes:
  - 250GB storage (enough for ~250,000 screenshots)
  - 1TB outbound transfer (CDN bandwidth)
  - Unlimited inbound transfer
  - Free CDN included

**Overage charges** (only if you exceed):
- Additional storage: $0.02/GB/month
- Additional transfer: $0.01/GB

**Example for your scale**:
- 1,000 screenshots/month (~1GB) = **$5/month total**
- 10,000 screenshots/month (~10GB) = **$5/month total**
- Even at 100,000 screenshots (~100GB), still **$5/month**

**Much simpler than AWS S3** (no per-request charges, no egress fees)

---

## Next Steps

1. **Create DigitalOcean Space** (5 minutes)
   - Region: Singapore (sgp1)
   - Name: ryuu-vpn-screenshots
   - Enable CDN

2. **Generate API Keys** (2 minutes)
   - Save Access Key and Secret Key

3. **Add to `.env` on VPS**
```bash
SPACES_REGION=sgp1
SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
SPACES_ACCESS_KEY=your_access_key_here
SPACES_SECRET_KEY=your_secret_key_here
SPACES_BUCKET=ryuu-vpn-screenshots
SPACES_CDN_URL=https://ryuu-vpn-screenshots.sgp1.cdn.digitaloceanspaces.com
```

4. **Install AWS SDK**
```bash
pnpm add @aws-sdk/client-s3
```

5. **Create upload service** (copy code from Phase 1 above)

6. **Test with one screenshot** before full migration

7. **Run migration script** to move existing screenshots

8. **Monitor and verify** all screenshots load correctly

9. **Clean up database** after successful migration

**Status**: Ready to implement - much simpler than Cloudflare R2!
