import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { logger } from "./logger.js";

const ADMIN_USERNAMES = ["ryuu", "sayuri"];

export async function seedAdminUsers() {
  const adminSecret = process.env["ADMIN_SECRET"];

  if (!adminSecret) {
    // In production, refuse to start without a real admin secret.
    // In development/test, allow a weak default but warn loudly.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "ADMIN_SECRET environment variable is required in production. " +
          "Set it in your .env file and restart."
      );
    }
    logger.warn(
      "ADMIN_SECRET not set — admin users seeded with dev default password 'dev_only_123'. " +
        "NEVER use this in production."
    );
  }

  // Hash is computed at runtime — never stored in source code.
  const password = adminSecret ?? "dev_only_123";
  const passwordHash = await bcrypt.hash(password, 12);

  if (adminSecret) {
    logger.info("Admin users seeded with ADMIN_SECRET password");
  }

  for (const username of ADMIN_USERNAMES) {
    const existing = await db.query.usersTable.findFirst({
      where: (u, { eq }) => eq(u.username, username),
      columns: { id: true },
    });

    if (!existing) {
      await db.insert(usersTable).values({ username, passwordHash, isAdmin: true });
      logger.info({ username }, "Admin user created");
    }
  }
}
