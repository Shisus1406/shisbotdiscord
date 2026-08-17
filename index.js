const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

function connectToVoice() {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return console.log("Servidor no encontrado.");

  const connection = joinVoiceChannel({
    channelId: CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: true,
    selfMute: true
  });

  connection.on(VoiceConnectionStatus.Disconnected, () => {
    console.log("Desconectado. Reintentando en 5 segundos...");
    setTimeout(() => connectToVoice(), 5000);
  });
}

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  connectToVoice();
});

client.login(TOKEN);
