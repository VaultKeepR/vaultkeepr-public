import { describe, it, expect } from "vitest";
import { computeHeartbeatStatus } from "../heartbeat";

describe("heartbeat", () => {
  describe("computeHeartbeatStatus", () => {
    const DELAY_60_DAYS = 60 * 86400;
    const GRACE_7_DAYS = 7 * 86400;

    it("fresh : pas expire, pas en grace, pas claimable", () => {
      const now = Math.floor(Date.now() / 1000);
      const status = computeHeartbeatStatus(now, DELAY_60_DAYS, GRACE_7_DAYS);

      expect(status.isExpired).toBe(false);
      expect(status.isInGracePeriod).toBe(false);
      expect(status.isClaimable).toBe(false);
      expect(status.daysRemaining).toBeGreaterThan(60);
    });

    it("a mi-chemin : pas expire", () => {
      const now = Math.floor(Date.now() / 1000);
      const lastHeartbeat = now - 30 * 86400;
      const status = computeHeartbeatStatus(lastHeartbeat, DELAY_60_DAYS, GRACE_7_DAYS);

      expect(status.isExpired).toBe(false);
      expect(status.isInGracePeriod).toBe(false);
      expect(status.isClaimable).toBe(false);
      expect(status.daysRemaining).toBeGreaterThanOrEqual(36);
      expect(status.daysRemaining).toBeLessThanOrEqual(38);
    });

    it("delay passe mais en grace period", () => {
      const now = Math.floor(Date.now() / 1000);
      const lastHeartbeat = now - 63 * 86400;
      const status = computeHeartbeatStatus(lastHeartbeat, DELAY_60_DAYS, GRACE_7_DAYS);

      expect(status.isExpired).toBe(true);
      expect(status.isInGracePeriod).toBe(true);
      expect(status.isClaimable).toBe(false);
      expect(status.daysRemaining).toBeGreaterThanOrEqual(3);
      expect(status.daysRemaining).toBeLessThanOrEqual(5);
    });

    it("delay + grace passes = claimable", () => {
      const now = Math.floor(Date.now() / 1000);
      const lastHeartbeat = now - 68 * 86400;
      const status = computeHeartbeatStatus(lastHeartbeat, DELAY_60_DAYS, GRACE_7_DAYS);

      expect(status.isExpired).toBe(true);
      expect(status.isInGracePeriod).toBe(false);
      expect(status.isClaimable).toBe(true);
      expect(status.daysRemaining).toBeLessThan(0);
    });

    it("deadline est calculee correctement", () => {
      const lastHeartbeat = 1000000;
      const status = computeHeartbeatStatus(lastHeartbeat, DELAY_60_DAYS, GRACE_7_DAYS);

      expect(status.deadline).toBe(1000000 + DELAY_60_DAYS + GRACE_7_DAYS);
      expect(status.lastHeartbeat).toBe(1000000);
    });

    it("jours restants negatifs quand expire", () => {
      const now = Math.floor(Date.now() / 1000);
      const lastHeartbeat = now - 100 * 86400;
      const status = computeHeartbeatStatus(lastHeartbeat, DELAY_60_DAYS, GRACE_7_DAYS);

      expect(status.daysRemaining).toBeLessThan(0);
    });
  });
});