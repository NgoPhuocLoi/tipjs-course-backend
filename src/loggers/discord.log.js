const { Client, GatewayIntentBits, Events } = require("discord.js");
require("dotenv").config();

class DiscordLogger {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
      ],
    });

    this.channelId = process.env.DISCORD_CHANNEL_ID;

    this.client.once(Events.ClientReady, (c) => {
      console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    this.client.login(process.env.DISCORD_TOKEN);
  }

  sendMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);

    if (!channel) {
      console.log("Couldn't file channel with id:  " + this.channelId);
    }

    channel.send(message).catch((error) => {
      console.log("Error when sending message to discord! Error:: " + error);
    });
  }

  sendFormatedCode(logData) {
    const {
      code,
      message = "This is some additional information about the code",
      title = "Title of code",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendMessage(codeMessage);
  }
}

module.exports = new DiscordLogger();
