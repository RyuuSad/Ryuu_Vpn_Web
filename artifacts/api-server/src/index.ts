import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from "./lib/migrate.js";
import { seedAdminUsers } from "./lib/seed.js";
import { registerMiniAppWebhook } from "./lib/telegram.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Validate critical environment variables before starting
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required but was not provided.");
}

if (!process.env.REMNAWAVE_URL) {
  logger.warn("REMNAWAVE_URL not set — VPN provisioning will fail");
}

if (!process.env.REMNAWAVE_API_KEY) {
  logger.warn("REMNAWAVE_API_KEY not set — VPN provisioning will fail");
}

app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  try {
    await runMigrations();
  } catch (e) {
    logger.error({ err: e }, "Migration failed — aborting startup");
    process.exit(1);
  }

  seedAdminUsers().catch((e) =>
    logger.error({ err: e }, "Failed to seed admin users"),
  );

  registerMiniAppWebhook().catch((e) =>
    logger.warn({ err: e }, "Mini App bot webhook registration failed (non-fatal)"),
  );
});
