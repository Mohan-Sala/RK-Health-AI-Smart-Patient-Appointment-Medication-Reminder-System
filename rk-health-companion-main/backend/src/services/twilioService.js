import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

/**
 * Sends SMS notifications utilizing Twilio REST API
 * @param {string} to - Recipient phone number
 * @param {string} body - SMS message content
 * @returns {Promise<{success: boolean, sid?: string, error?: string}>}
 */
export const sendSms = async (to, body) => {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
    logger.warn("⚠️ Twilio credentials missing in environment variables. SMS delivery skipped.");
    return { success: false, error: "Twilio credentials not configured" };
  }

  // Format parameters
  const auth = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString("base64");
  const params = new URLSearchParams();
  params.append("To", to);
  params.append("From", env.TWILIO_PHONE_NUMBER);
  params.append("Body", body);

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
        signal: AbortSignal.timeout(10000), // 10s timeout
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Twilio request failed with status ${response.status}`);
    }

    logger.info(`✉️ SMS sent successfully via Twilio. SID: ${data.sid}`);
    return { success: true, sid: data.sid };
  } catch (err) {
    logger.error("❌ Twilio send SMS service failed:", err);
    return { success: false, error: err.message };
  }
};
