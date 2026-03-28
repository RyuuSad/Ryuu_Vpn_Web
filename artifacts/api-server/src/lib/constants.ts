/**
 * Shared business logic constants for the API server.
 * Single source of truth — import from here instead of duplicating values.
 */

/** Maximum number of plan purchases a user may make per calendar month. */
export const MONTHLY_PURCHASE_LIMIT = 3;

/** Plan IDs that are considered premium (cannot downgrade from these). */
export const PREMIUM_PLAN_IDS = ["premium", "ultra"] as const;
