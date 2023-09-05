const { Client, GatewayIntentBits, Events } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

console.log("TOken:: " + process.env.DISCORD_TOKEN);

client.on(Events.MessageCreate, (msg) => {
  if (msg.content === "hello") {
    msg.reply("Hello! How can I help you?");
  }
});

client.login(process.env.DISCORD_TOKEN);
