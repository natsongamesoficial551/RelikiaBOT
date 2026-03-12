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
const CARGO_MEMBRO_ID = '1481443977306706070';

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

  // ── Garante o cargo pra quem já está no servidor ───────────────────────────
  for (const guild of client.guilds.cache.values()) {
    const members = await guild.members.fetch();
    const cargo = guild.roles.cache.get(CARGO_MEMBRO_ID);

    if (!cargo) {
      console.warn(`⚠️ Cargo membro não encontrado no servidor: ${guild.name}`);
      continue;
    }

    let contador = 0;
    for (const member of members.values()) {
      if (member.user.bot) continue;
      if (!member.roles.cache.has(CARGO_MEMBRO_ID)) {
        await member.roles.add(cargo).catch(() => {});
        contador++;
      }
    }
    console.log(`🎖️ Cargo membro atribuído a ${contador} membros em ${guild.name}`);
  }
});

// ── Auto-role para novos membros ───────────────────────────────────────────────
client.on('guildMemberAdd', async (member) => {
  if (member.user.bot) return;

  const cargo = member.guild.roles.cache.get(CARGO_MEMBRO_ID);
  if (!cargo) return;

  await member.roles.add(cargo).catch((err) => {
    console.warn(`⚠️ Não foi possível dar cargo a ${member.user.tag}: ${err.message}`);
  });

  console.log(`✅ Cargo membro dado para: ${member.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  await handleInteraction(interaction, client);
});

client.login(process.env.TOKEN);
