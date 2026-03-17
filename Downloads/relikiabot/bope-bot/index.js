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

// ── Auto-role + Boas-vindas para novos membros ────────────────────────────────
client.on('guildMemberAdd', async (member) => {
  if (member.user.bot) return;

  const guild = member.guild;

  // Auto-role
  const cargo = guild.roles.cache.get(CARGO_MEMBRO_ID);
  if (cargo) {
    await member.roles.add(cargo).catch((err) => {
      console.warn(`⚠️ Não foi possível dar cargo a ${member.user.tag}: ${err.message}`);
    });
  }

  // Embed de boas-vindas
  const canalBV = guild.channels.cache.find(c => c.name === '👋┃boas-vindas');
  if (canalBV) {
    const { EmbedBuilder } = await import('discord.js');
    await canalBV.send({
      content: `<@${member.id}>`,
      embeds: [
        new EmbedBuilder()
          .setColor(0xC0392B)
          .setTitle('👋 BEM-VINDO À CIDADE ALTA!')
          .setDescription(`Salve <@${member.id}>! Seja bem-vindo ao servidor oficial da **Cidade Alta**. 🔴

Aqui começa sua jornada na facção. Leia as regras e se candidate!`)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .addFields(
            { name: '📌 Primeiro passo', value: '> Leia as regras em <#regras-gerais>', inline: false },
            { name: '📝 Quer entrar na FAC?', value: '> Acesse <#como-se-candidatar> e clique em **Me Candidatar**', inline: false },
            { name: '🆘 Precisa de ajuda?', value: '> Abra um ticket em <#suporte>', inline: false },
            { name: '👥 Membros no servidor', value: `> ${guild.memberCount} membros`, inline: true },
            { name: '📅 Entrou em', value: `> <t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
          )
          .setFooter({ text: 'Cidade Alta — Facção — Cidade Alta | FiveM RP' })
          .setTimestamp()
      ]
    });
  }

  // DM avisando para se candidatar
  await member.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xC0392B)
        .setTitle('🔴 BEM-VINDO AO SERVIDOR DA CIDADE ALTA!')
        .setDescription(`Salve **${member.user.username}**! Você entrou no servidor oficial da **Cidade Alta**.\n\nPara ter acesso completo, você precisa **se candidatar à facção**. Enquanto isso, apenas os canais de regras e candidatura estão disponíveis para você.`)
        .addFields(
          { name: '📋 Como se candidatar', value: '> **1.** Acesse o servidor\n> **2.** Vá no canal **#como-se-candidatar**\n> **3.** Clique no botão **"Me Candidatar 📝"**\n> **4.** Preencha seus dados e responda as perguntas de RP', inline: false },
          { name: '📖 Antes de tudo', value: '> Leia as **#regras-gerais** para garantir sua aprovação!', inline: false },
          { name: '⏱️ Prazo', value: '> Responda dentro de **24 horas** após abrir a candidatura.', inline: false },
          { name: '🆘 Dúvidas?', value: '> Após ser aprovado, use o canal **#suporte** para abrir um ticket.', inline: false }
        )
        .setFooter({ text: 'Cidade Alta — Facção — Cidade Alta | FiveM RP' })
        .setTimestamp()
    ]
  }).catch(() => console.warn(`⚠️ DM fechada para: ${member.user.tag}`));

  console.log(`✅ Boas-vindas enviado para: ${member.user.tag}`);
});

// ── Mensagem de saída ──────────────────────────────────────────────────────────
client.on('guildMemberRemove', async (member) => {
  if (member.user.bot) return;

  const guild = member.guild;
  const canalSaida = guild.channels.cache.find(c => c.name === '🚪┃saidas');
  if (!canalSaida) return;

  const { EmbedBuilder } = await import('discord.js');
  await canalSaida.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0x2c2c2c)
        .setTitle('🚪 MEMBRO SAIU DO SERVIDOR')
        .setDescription(`**${member.user.username}** deixou o servidor.`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: '👤 Usuário', value: `> ${member.user.tag}`, inline: true },
          { name: '📅 Saiu em', value: `> <t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
          { name: '👥 Membros restantes', value: `> ${guild.memberCount} membros`, inline: true }
        )
        .setFooter({ text: 'Cidade Alta — Facção — Cidade Alta | FiveM RP' })
        .setTimestamp()
    ]
  });

  console.log(`👋 ${member.user.tag} saiu do servidor.`);
});

client.on('interactionCreate', async (interaction) => {
  await handleInteraction(interaction, client);
});

client.login(process.env.TOKEN);
