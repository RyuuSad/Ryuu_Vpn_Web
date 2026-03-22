const NOTI_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MINI_BOT_TOKEN = process.env.MINI_BOT_TOKEN;

const CHAT_IDS = (process.env.TELEGRAM_ADMIN_CHAT_IDS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export async function sendTelegramMessage(text: string): Promise<void> {
  if (!NOTI_BOT_TOKEN || CHAT_IDS.length === 0) return;
  await Promise.allSettled(
    CHAT_IDS.map((chatId) =>
      fetch(`https://api.telegram.org/bot${NOTI_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      })
    )
  );
}

export async function sendTelegramPhoto(
  imageBuffer: Buffer,
  caption: string,
  mimeType: string,
): Promise<void> {
  if (!NOTI_BOT_TOKEN || CHAT_IDS.length === 0) return;

  for (const chatId of CHAT_IDS) {
    try {
      const form = new FormData();
      form.append("chat_id", chatId);
      form.append("caption", caption);
      form.append("parse_mode", "HTML");
      const blob = new Blob([imageBuffer], { type: mimeType });
      form.append("photo", blob, "screenshot.jpg");

      await fetch(`https://api.telegram.org/bot${NOTI_BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: form,
      });
    } catch {
      // Ignore per-chat errors
    }
  }
}

export async function sendMiniAppBotMessage(
  chatId: string | number,
  text: string,
  replyMarkup?: Record<string, unknown>,
): Promise<void> {
  if (!MINI_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${MINI_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
      }),
    });
  } catch {
    // Ignore network errors
  }
}
