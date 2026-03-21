const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_IDS = (process.env.TELEGRAM_ADMIN_CHAT_IDS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export async function sendTelegramMessage(text: string): Promise<void> {
  if (!BOT_TOKEN || CHAT_IDS.length === 0) return;
  await Promise.allSettled(
    CHAT_IDS.map((chatId) =>
      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
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
  if (!BOT_TOKEN || CHAT_IDS.length === 0) return;

  for (const chatId of CHAT_IDS) {
    try {
      const form = new FormData();
      form.append("chat_id", chatId);
      form.append("caption", caption);
      form.append("parse_mode", "HTML");
      const blob = new Blob([imageBuffer], { type: mimeType });
      form.append("photo", blob, "screenshot.jpg");

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: form,
      });
    } catch {
      // Ignore errors for individual chat IDs (e.g. user hasn't started bot)
    }
  }
}
