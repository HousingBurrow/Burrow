"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/lib/utils/action-result";

const MAX_ATTEMPTS = 5;
const CODE_EXPIRY_MINUTES = 10;
const RATE_LIMIT_WINDOW_MINUTES = 60;
const MAX_CODES_PER_HOUR = 20;

/**
 * Create a new verification code for an email
 */
export async function createVerificationCode(
  email: string,
  code: string
): ActionResult<{ id: number }> {
  try {
    // Check rate limiting: max 3 codes per email per hour
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
    const recentCodes = await prisma.emailVerification.count({
      where: {
        email,
        created_at: { gte: oneHourAgo },
      },
    });

    if (recentCodes >= MAX_CODES_PER_HOUR) {
      return {
        isError: true,
        message: "Too many verification attempts. Please try again later.",
      };
    }

    // Delete any existing unverified codes for this email
    await prisma.emailVerification.deleteMany({
      where: {
        email,
        verified: false,
      },
    });

    // Create new verification code
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);
    const verification = await prisma.emailVerification.create({
      data: {
        email,
        code,
        expires_at: expiresAt,
      },
    });

    return { isError: false, data: { id: verification.id } };
  } catch (e) {
    console.error("Error creating verification code:", e);
    return { isError: true, message: "Failed to create verification code" };
  }
}

/**
 * Verify a code for an email
 */
export async function verifyCode(
  email: string,
  code: string
): ActionResult<{ success: boolean }> {
  try {
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        verified: false,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!verification) {
      return {
        isError: true,
        message: "No verification code found. Please request a new code.",
      };
    }

    // Check if expired
    if (new Date() > verification.expires_at) {
      return {
        isError: true,
        message: "Verification code has expired. Please request a new code.",
      };
    }

    // Check if too many attempts
    if (verification.attempts >= MAX_ATTEMPTS) {
      return {
        isError: true,
        message: "Too many failed attempts. Please request a new code.",
      };
    }

    // Check if code matches
    if (verification.code !== code) {
      // Increment attempts
      await prisma.emailVerification.update({
        where: { id: verification.id },
        data: { attempts: verification.attempts + 1 },
      });

      return {
        isError: true,
        message: `Invalid verification code. ${MAX_ATTEMPTS - verification.attempts - 1} attempts remaining.`,
      };
    }

    // Success! Mark as verified
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { verified: true },
    });

    return { isError: false, data: { success: true } };
  } catch (e) {
    console.error("Error verifying code:", e);
    return { isError: true, message: "Failed to verify code" };
  }
}

/**
 * Check if an email has been verified
 */
export async function isEmailVerified(email: string): ActionResult<boolean> {
  try {
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        verified: true,
      },
    });

    return { isError: false, data: !!verification };
  } catch (e) {
    console.error("Error checking verification:", e);
    return { isError: true, message: "Failed to check verification status" };
  }
}

/**
 * Clean up old verification codes (run periodically)
 */
export async function cleanupExpiredCodes(): ActionResult<{ deleted: number }> {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await prisma.emailVerification.deleteMany({
      where: {
        created_at: { lt: oneDayAgo },
      },
    });

    return { isError: false, data: { deleted: result.count } };
  } catch (e) {
    console.error("Error cleaning up codes:", e);
    return { isError: true, message: "Failed to cleanup codes" };
  }
}