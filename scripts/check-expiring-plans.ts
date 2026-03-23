import { db, usersTable } from "@workspace/db";
import { isNotNull } from "drizzle-orm";
import { getRemnawaveUser } from "../artifacts/api-server/src/lib/remnawave.js";
import { notifyUser } from "../artifacts/api-server/src/lib/telegram.js";
import { logger } from "../artifacts/api-server/src/lib/logger.js";

const DAYS_BEFORE_EXPIRY = 3;

async function checkExpiringPlans() {
  logger.info("Starting expiry check...");

  const users = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      telegramId: usersTable.telegramId,
      remnawaveUuid: usersTable.remnawaveUuid,
      planId: usersTable.planId,
    })
    .from(usersTable)
    .where(isNotNull(usersTable.remnawaveUuid));

  logger.info({ userCount: users.length }, "Checking users with active plans");

  let notifiedCount = 0;
  let errorCount = 0;

  for (const user of users) {
    if (!user.telegramId) {
      logger.debug({ username: user.username }, "User has no Telegram ID, skipping");
      continue;
    }

    try {
      const rwUser = await getRemnawaveUser(user.remnawaveUuid!);
      
      if (!rwUser.expireAt) {
        logger.debug({ username: user.username }, "No expiry date, skipping");
        continue;
      }

      const expireDate = new Date(rwUser.expireAt);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry === DAYS_BEFORE_EXPIRY) {
        const usedGb = (rwUser.usedTrafficBytes / (1024 ** 3)).toFixed(2);
        const limitGb = (rwUser.trafficLimitBytes / (1024 ** 3)).toFixed(2);
        const remainingGb = ((rwUser.trafficLimitBytes - rwUser.usedTrafficBytes) / (1024 ** 3)).toFixed(2);

        const message = [
          `⚠️ <b>Plan Expiring Soon!</b>`,
          ``,
          `Your VPN plan will expire in <b>${DAYS_BEFORE_EXPIRY} days</b>.`,
          ``,
          `📊 <b>Current Usage:</b>`,
          `• Used: ${usedGb} GB / ${limitGb} GB`,
          `• Remaining: ${remainingGb} GB`,
          `• Expires: ${expireDate.toLocaleDateString("en-GB")}`,
          ``,
          `💡 <b>Don't lose access!</b>`,
          `Top up your balance and renew your plan now.`,
        ].join("\n");

        await notifyUser(user.telegramId, message);
        notifiedCount++;
        logger.info({ username: user.username, daysUntilExpiry }, "Sent expiry warning");
      } else {
        logger.debug({ username: user.username, daysUntilExpiry }, "Not in warning window");
      }
    } catch (err) {
      errorCount++;
      logger.error({ err, username: user.username }, "Failed to check/notify user");
    }
  }

  logger.info({ notifiedCount, errorCount, totalChecked: users.length }, "Expiry check completed");
}

checkExpiringPlans()
  .then(() => {
    logger.info("Expiry check finished successfully");
    process.exit(0);
  })
  .catch((err) => {
    logger.error({ err }, "Expiry check failed");
    process.exit(1);
  });
