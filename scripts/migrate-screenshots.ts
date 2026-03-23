import { db, topupRequestsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { saveScreenshot } from "../artifacts/api-server/src/lib/upload.js";

async function migrateScreenshots() {
  console.log("🔄 Starting screenshot migration...\n");

  const topups = await db.select().from(topupRequestsTable);
  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const topup of topups) {
    if (topup.screenshotUrl.startsWith("data:")) {
      try {
        // Extract base64 data
        const matches = topup.screenshotUrl.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
          console.log(`⚠️  Skipping topup ${topup.id}: Invalid base64 format`);
          skipped++;
          continue;
        }

        const [, mimeType, base64Data] = matches;
        const buffer = Buffer.from(base64Data, "base64");

        // Save to filesystem
        const newUrl = await saveScreenshot(buffer, mimeType);

        // Update database
        await db
          .update(topupRequestsTable)
          .set({ screenshotUrl: newUrl })
          .where(eq(topupRequestsTable.id, topup.id));

        migrated++;
        console.log(`✅ [${migrated}] Migrated screenshot for topup ${topup.id}`);
      } catch (err) {
        failed++;
        console.error(`❌ Failed to migrate topup ${topup.id}:`, err);
      }
    } else {
      skipped++;
    }
  }

  console.log("\n📊 Migration Summary:");
  console.log(`   ✅ Migrated: ${migrated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📁 Total: ${topups.length}`);

  if (migrated > 0) {
    console.log("\n💡 Next steps:");
    console.log("   1. Verify screenshots load correctly in admin panel");
    console.log("   2. Run VACUUM FULL on database to reclaim space:");
    console.log("      docker exec ryuu-vpn-db psql -U ryuu -d ryuuvpn -c 'VACUUM FULL topup_requests;'");
  }
}

migrateScreenshots()
  .then(() => {
    console.log("\n✨ Migration complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n💥 Migration failed:", err);
    process.exit(1);
  });
