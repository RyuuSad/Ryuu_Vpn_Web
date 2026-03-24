import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

/**
 * Enhanced request logging middleware
 * Adds correlation ID and tracks request duration
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  // Add correlation ID for request tracing
  const correlationId = randomUUID();
  req.log = req.log.child({ correlationId });
  res.setHeader("X-Correlation-ID", correlationId);

  const startTime = Date.now();

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    req.log[logLevel]({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      correlationId,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    }, `${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });

  next();
}
