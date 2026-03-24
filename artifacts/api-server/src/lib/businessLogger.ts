import { logger } from "./logger.js";

/**
 * Business event logger for tracking critical operations
 * These logs are useful for analytics, debugging, and audit trails
 */

export const businessLogger = {
  /**
   * Log plan purchase event
   */
  planPurchased(data: {
    userId: string;
    username: string;
    planId: string;
    priceKs: number;
    newBalance: number;
    correlationId?: string;
  }) {
    logger.info({
      event: "plan_purchased",
      ...data,
    }, `User ${data.username} purchased ${data.planId} plan for ${data.priceKs} Ks`);
  },

  /**
   * Log top-up approval event
   */
  topupApproved(data: {
    userId: string;
    username: string;
    amountKs: number;
    newBalance: number;
    approvedBy: string;
    paymentMethod: string;
    correlationId?: string;
  }) {
    logger.info({
      event: "topup_approved",
      ...data,
    }, `Top-up of ${data.amountKs} Ks approved for ${data.username} by ${data.approvedBy}`);
  },

  /**
   * Log top-up rejection event
   */
  topupRejected(data: {
    userId: string;
    username: string;
    amountKs: number;
    rejectedBy: string;
    reason?: string;
    correlationId?: string;
  }) {
    logger.info({
      event: "topup_rejected",
      ...data,
    }, `Top-up of ${data.amountKs} Ks rejected for ${data.username} by ${data.rejectedBy}`);
  },

  /**
   * Log balance adjustment event
   */
  balanceAdjusted(data: {
    userId: string;
    username: string;
    delta: number;
    newBalance: number;
    adjustedBy: string;
    correlationId?: string;
  }) {
    logger.info({
      event: "balance_adjusted",
      ...data,
    }, `Balance adjusted by ${data.delta > 0 ? '+' : ''}${data.delta} Ks for ${data.username} by ${data.adjustedBy}`);
  },

  /**
   * Log VPN user creation
   */
  vpnUserCreated(data: {
    userId: string;
    username: string;
    remnawaveUuid: string;
    planId: string;
    correlationId?: string;
  }) {
    logger.info({
      event: "vpn_user_created",
      ...data,
    }, `VPN user created for ${data.username} with plan ${data.planId}`);
  },

  /**
   * Log VPN plan renewal
   */
  vpnPlanRenewed(data: {
    userId: string;
    username: string;
    remnawaveUuid: string;
    planId: string;
    correlationId?: string;
  }) {
    logger.info({
      event: "vpn_plan_renewed",
      ...data,
    }, `VPN plan renewed for ${data.username} with plan ${data.planId}`);
  },

  /**
   * Log authentication events
   */
  userLoggedIn(data: {
    userId: string;
    username: string;
    method: "telegram" | "password";
    correlationId?: string;
  }) {
    logger.info({
      event: "user_logged_in",
      ...data,
    }, `User ${data.username} logged in via ${data.method}`);
  },

  userRegistered(data: {
    userId: string;
    username: string;
    telegramId?: string;
    correlationId?: string;
  }) {
    logger.info({
      event: "user_registered",
      ...data,
    }, `New user registered: ${data.username}`);
  },

  /**
   * Log errors with business context
   */
  businessError(data: {
    event: string;
    userId?: string;
    username?: string;
    error: Error;
    context?: Record<string, unknown>;
    correlationId?: string;
  }) {
    logger.error({
      event: data.event,
      userId: data.userId,
      username: data.username,
      error: {
        message: data.error.message,
        stack: data.error.stack,
      },
      ...data.context,
      correlationId: data.correlationId,
    }, `Business error in ${data.event}: ${data.error.message}`);
  },
};
