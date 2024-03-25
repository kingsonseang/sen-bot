import { Client, LocalAuth, GroupChat } from "whatsapp-web.js";
import * as qrcode from "qrcode-terminal";

// Create a new client instance
const authStrategy = new LocalAuth({
  dataPath: "auth-store",
});

const client = new Client({
  authStrategy,
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Sen Bot is ready!");
});

// When the client received QR-Code
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Subscribe to all messages received
client.on("message", async (message) => {
  const info = await message.getChat();
  console.log(message.from);

  if (
    message.type === "ptt" &&
    info.isGroup === true &&
    message.from === process.env.GROUP_CHAT_ID
  ) {
    // Send a message to the sender
    const sender = await message.getContact();
    const senderName = sender.pushname || sender.id.user;

    await client.sendMessage(
      message.from,
      `Sen Bot: Deleted vioce note from user ${senderName}`
    );

    await message.delete(true);
  }
});

// Start your client
client.initialize();
