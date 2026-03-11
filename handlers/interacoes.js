import { PermissionFlagsBits, ChannelType } from 'discord.js';
import {
  embedTicketAberto,
  embedCandidaturaAberta,
  embedAprovado,
  embedReprovado,
  COR_INFO,
  RODAPE
} from '../embeds/index.js';
import { EmbedBuilder } from 'discord.js';

const CANAL_STAFF = '🔧┃staff-chat';
const CANAL_APROVADOS = '✅┃aprovados';
const CANAL_REPROVADOS = '❌┃reprovados';
const CANAL_LOGS = '⚙️┃logs-moderacao';

// IDs de tickets e candidaturas abertos (em memória)
const ticketsAbertos = new Map();     // userId → channelId
const candidaturasAbertas = new Map(); // userId → channelId

function temPermissaoAdmin(member) {
  return (
    member.permissions.has(PermissionFlagsBits.Administrator) ||
    member.roles.cache.some(r => r.name === 'Administrador') ||
    member.roles.cache.some(r => r.name === 'Coronel')
  );
}

async function enviarLog(guild, mensagem, cor = 0x3498db) {
  const canal = guild.channels.cache.find(c => c.name === CANAL_LOGS);
  if (!canal) return;
  await canal.send({
    embeds: [
      new EmbedBuilder()
        .setColor(cor)
        .setDescription(mensagem)
        .setFooter({ text: RODAPE })
        .setTimestamp()
    ]
  }).catch(() => {});
}

export async function handleInteraction(interaction, client) {

  // ── COMANDOS SLASH ────────────────────────────────────────────────────────
  if (interaction.isChatInputCommand()) {
    // Verifica se está no canal correto
    if (interaction.channel.name !== CANAL_STAFF) {
      return interaction.reply({
        content: '❌ Use os comandos apenas no canal **🔧┃staff-chat**!',
        ephemeral: true
      });
    }

    if (!temPermissaoAdmin(interaction.member)) {
      return interaction.reply({
        content: '❌ Você não tem permissão para usar este comando!',
        ephemeral: true
      });
    }

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, { enviarLog });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Erro ao executar o comando.', ephemeral: true });
    }
    return;
  }

  // ── BOTÕES ────────────────────────────────────────────────────────────────
  if (!interaction.isButton()) return;

  const { customId, guild, member, user } = interaction;

  // ── Abrir Ticket ──────────────────────────────────────────────────────────
  if (customId === 'abrir_ticket') {
    if (ticketsAbertos.has(user.id)) {
      const canalExistente = guild.channels.cache.get(ticketsAbertos.get(user.id));
      return interaction.reply({
        content: `❌ Você já tem um ticket aberto! ${canalExistente ? canalExistente.toString() : ''}`,
        ephemeral: true
      });
    }

    const cargoAdm = guild.roles.cache.find(r => r.name === 'Administrador');
    const novoCanal = await guild.channels.create({
      name: `ticket-${user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: ['ViewChannel'] },
        { id: user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
        ...(cargoAdm ? [{ id: cargoAdm.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages'] }] : []),
      ]
    });

    ticketsAbertos.set(user.id, novoCanal.id);

    const { embed, botoes } = embedTicketAberto(`<@${user.id}>`);
    await novoCanal.send({ embeds: [embed], components: [botoes] });

    await enviarLog(guild, `🎟️ **Ticket aberto** por <@${user.id}> → ${novoCanal}`, 0x3498db);

    return interaction.reply({
      content: `✅ Seu ticket foi aberto! ${novoCanal.toString()}`,
      ephemeral: true
    });
  }

  // ── Resolver Ticket ───────────────────────────────────────────────────────
  if (customId === 'resolver_ticket') {
    if (!temPermissaoAdmin(member)) {
      return interaction.reply({ content: '❌ Apenas administradores podem resolver tickets.', ephemeral: true });
    }

    await enviarLog(guild, `✅ **Ticket resolvido** por <@${user.id}> → canal: ${interaction.channel.name}`, 0x2ecc71);

    await interaction.reply({ content: '✅ Ticket marcado como resolvido. Canal será deletado em 5 segundos.' });
    setTimeout(async () => {
      // Remove do mapa
      for (const [uid, cid] of ticketsAbertos.entries()) {
        if (cid === interaction.channel.id) ticketsAbertos.delete(uid);
      }
      await interaction.channel.delete().catch(() => {});
    }, 5000);
    return;
  }

  // ── Fechar Ticket ─────────────────────────────────────────────────────────
  if (customId === 'fechar_ticket') {
    if (!temPermissaoAdmin(member)) {
      return interaction.reply({ content: '❌ Apenas administradores podem fechar tickets.', ephemeral: true });
    }

    await enviarLog(guild, `🔒 **Ticket fechado** por <@${user.id}> → canal: ${interaction.channel.name}`, 0xe67e22);

    await interaction.reply({ content: '🔒 Ticket fechado. Canal será deletado em 5 segundos.' });
    setTimeout(async () => {
      for (const [uid, cid] of ticketsAbertos.entries()) {
        if (cid === interaction.channel.id) ticketsAbertos.delete(uid);
      }
      await interaction.channel.delete().catch(() => {});
    }, 5000);
    return;
  }

  // ── Abrir Candidatura ─────────────────────────────────────────────────────
  if (customId === 'abrir_candidatura') {
    if (candidaturasAbertas.has(user.id)) {
      const canalExistente = guild.channels.cache.get(candidaturasAbertas.get(user.id));
      return interaction.reply({
        content: `❌ Você já tem uma candidatura aberta! ${canalExistente ? canalExistente.toString() : ''}`,
        ephemeral: true
      });
    }

    const cargoAdm = guild.roles.cache.find(r => r.name === 'Administrador');
    const novoCanal = await guild.channels.create({
      name: `candidatura-${user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: ['ViewChannel'] },
        { id: user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
        ...(cargoAdm ? [{ id: cargoAdm.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages'] }] : []),
      ]
    });

    candidaturasAbertas.set(user.id, novoCanal.id);

    const { embed, botoes } = embedCandidaturaAberta(`<@${user.id}>`);
    await novoCanal.send({ embeds: [embed], components: [botoes] });

    await enviarLog(guild, `📝 **Candidatura aberta** por <@${user.id}> → ${novoCanal}`, 0x9b59b6);

    return interaction.reply({
      content: `✅ Sua candidatura foi aberta! ${novoCanal.toString()}`,
      ephemeral: true
    });
  }

  // ── Aprovar Candidatura ───────────────────────────────────────────────────
  if (customId === 'aprovar_candidatura') {
    if (!temPermissaoAdmin(member)) {
      return interaction.reply({ content: '❌ Apenas administradores podem aprovar candidaturas.', ephemeral: true });
    }

    // Descobre quem é o dono do canal (nome: candidatura-username)
    let usuarioAlvo = null;
    for (const [uid, cid] of candidaturasAbertas.entries()) {
      if (cid === interaction.channel.id) {
        usuarioAlvo = await guild.members.fetch(uid).catch(() => null);
        candidaturasAbertas.delete(uid);
        break;
      }
    }

    if (!usuarioAlvo) {
      return interaction.reply({ content: '❌ Não foi possível identificar o candidato.', ephemeral: true });
    }

    // Dá o cargo Soldado
    const cargoSoldado = guild.roles.cache.find(r => r.name === 'Soldado');
    if (cargoSoldado) await usuarioAlvo.roles.add(cargoSoldado).catch(() => {});

    // Posta no canal de aprovados
    const canalAprovados = guild.channels.cache.find(c => c.name === CANAL_APROVADOS);
    if (canalAprovados) await canalAprovados.send({ embeds: [embedAprovado(`<@${usuarioAlvo.id}>`)] });

    // DM pro usuário
    await usuarioAlvo.send('✅ **Parabéns! Sua candidatura ao BOPE foi APROVADA!**\nBem-vindo à unidade de elite! 🦅').catch(() => {});

    await enviarLog(guild, `✅ **Candidatura aprovada** — <@${usuarioAlvo.id}> agora é Soldado. Aprovado por <@${user.id}>`, 0x2ecc71);

    await interaction.reply({ content: `✅ ${usuarioAlvo.user.username} foi aprovado e recebeu o cargo Soldado!` });
    setTimeout(async () => { await interaction.channel.delete().catch(() => {}); }, 5000);
    return;
  }

  // ── Reprovar Candidatura ──────────────────────────────────────────────────
  if (customId === 'reprovar_candidatura') {
    if (!temPermissaoAdmin(member)) {
      return interaction.reply({ content: '❌ Apenas administradores podem reprovar candidaturas.', ephemeral: true });
    }

    let usuarioAlvo = null;
    for (const [uid, cid] of candidaturasAbertas.entries()) {
      if (cid === interaction.channel.id) {
        usuarioAlvo = await guild.members.fetch(uid).catch(() => null);
        candidaturasAbertas.delete(uid);
        break;
      }
    }

    if (!usuarioAlvo) {
      return interaction.reply({ content: '❌ Não foi possível identificar o candidato.', ephemeral: true });
    }

    // Posta no canal de reprovados
    const canalReprovados = guild.channels.cache.find(c => c.name === CANAL_REPROVADOS);
    if (canalReprovados) await canalReprovados.send({ embeds: [embedReprovado(`<@${usuarioAlvo.id}>`)] });

    // DM pro usuário
    await usuarioAlvo.send('❌ **Sua candidatura ao BOPE foi reprovada.**\nVocê pode tentar novamente após 7 dias.').catch(() => {});

    await enviarLog(guild, `❌ **Candidatura reprovada** — <@${usuarioAlvo.id}>. Reprovado por <@${user.id}>`, 0xe74c3c);

    await interaction.reply({ content: `❌ ${usuarioAlvo.user.username} foi reprovado.` });
    setTimeout(async () => { await interaction.channel.delete().catch(() => {}); }, 5000);
    return;
  }
}
