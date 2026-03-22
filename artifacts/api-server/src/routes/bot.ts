import { Router } from "express";
import { sendMiniAppBotMessage } from "../lib/telegram.js";

const router = Router();

const MINI_BOT_TOKEN = process.env.MINI_BOT_TOKEN;
const BOT_WEBHOOK_SECRET = process.env.BOT_WEBHOOK_SECRET;
const MINI_APP_URL = process.env.MINI_APP_URL ?? "https://ryuukakkoii.site";

interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
}

interface TelegramMessage {
  chat: { id: number };
  from?: TelegramUser;
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

router.post("/webhook", async (req, res) => {
  if (!MINI_BOT_TOKEN) {
    res.sendStatus(200);
    return;
  }

  if (BOT_WEBHOOK_SECRET) {
    const secretHeader = req.headers["x-telegram-bot-api-secret-token"];
    if (secretHeader !== BOT_WEBHOOK_SECRET) {
      res.sendStatus(403);
      return;
    }
  }

  const update = req.body as TelegramUpdate;

  if (!update?.message) {
    res.sendStatus(200);
    return;
  }

  const message = update.message;
  const chatId = message.chat.id;
  const text = message.text ?? "";
  const firstName = message.from?.first_name ?? "there";

  if (text === "/start" || text.startsWith("/start ")) {
    const welcomeText = [
      `👋 Welcome to <b>RYUU VPN</b>, ${firstName}!`,
      ``,
      `🔒 Fast, secure, and reliable VPN service for Myanmar.`,
      ``,
      `📦 <b>Our Plans:</b>`,
      `• Starter — 50 GB / 30 days (3,000 Ks)`,
      `• Premium — 120 GB / 30 days (5,000 Ks)`,
      `• Ultra — 250 GB / 30 days (10,000 Ks)`,
      ``,
      `👇 Open the app below to register and get started!`,
    ].join("\n");

    await sendMiniAppBotMessage(chatId, welcomeText, {
      inline_keyboard: [
        [
          {
            text: "🚀 Open RYUU VPN",
            web_app: { url: MINI_APP_URL },
          },
        ],
      ],
    });
  } else if (text === "/help") {
    const helpText = [
      `ℹ️ <b>RYUU VPN Help</b>`,
      ``,
      `Use the app to:`,
      `• Register or log in to your account`,
      `• Top up your balance`,
      `• Buy or gift VPN plans`,
      `• Copy your VPN subscription link`,
      ``,
      `For support, contact the admin.`,
    ].join("\n");

    await sendMiniAppBotMessage(chatId, helpText, {
      inline_keyboard: [
        [{ text: "📱 Open App", web_app: { url: MINI_APP_URL } }],
      ],
    });
  } else {
    await sendMiniAppBotMessage(chatId, `👋 Use the button below to open RYUU VPN!`, {
      inline_keyboard: [
        [{ text: "🚀 Open RYUU VPN", web_app: { url: MINI_APP_URL } }],
      ],
    });
  }

  res.sendStatus(200);
});

export default router;
