import 'dotenv/config';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import http from 'http';
import { handleInteraction } from './handlers/interacoes.js';
import { postarMensagensAutomaticas } from './handlers/mensagensAutomaticas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── SERVIDOR HTTP (necessário pro Render manter o serviço ativo) ──────────────
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('RELIKIABOT online ✅');
}).listen(PORT, () => {
  console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
});

// ── AUTOPING (evita o Render adormecer) ───────────────────────────────────────
const PING_URL = process.env.AUTO_PING;
const INTERVALO_MINUTOS = 7;

if (PING_URL) {
  setInterval(async () => {
    try {
      await fetch(PING_URL);
      console.log(`🏓 Autoping enviado → ${PING_URL}`);
    } catch (err) {
      console.warn(`⚠️ Falha no autoping: ${err.message}`);
    }
  }, INTERVALO_MINUTOS * 60 * 1000);

  console.log(`⏱️ Autoping configurado a cada ${INTERVALO_MINUTOS} minutos`);
} else {
  console.warn('⚠️ AUTO_PING não definido — bot pode dormir no Render!');
}

// ── BOT DISCORD ───────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.commands = new Collection();

// Carrega todos os comandos da pasta /commands
const commandFiles = readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = await import(pathToFileURL(path.join(__dirname, 'commands', file)).href);
  if (command.default?.data && command.default?.execute) {
    client.commands.set(command.default.data.name, command.default);
  }
}

client.once('ready', async () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
  await postarMensagensAutomaticas(client);
});

client.on('interactionCreate', async (interaction) => {
  await handleInteraction(interaction, client);
});

client.login(process.env.TOKEN);
