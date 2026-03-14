import { PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import {
  embedTicketAberto,
  embedAprovado,
  embedReprovado,
  embedCandidatura,
  COR_FAC,
  COR_INFO,
  COR_APROVADO,
  COR_REPROVADO,
  RODAPE
} from '../embeds/index.js';

const CANAL_STAFF      = '🔧┃staff-chat';
const CANAL_APROVADOS  = '✅┃aprovados';
const CANAL_REPROVADOS = '❌┃reprovados';
const CANAL_LOGS       = '⚙️┃logs-moderacao';

const ticketsAbertos      = new Map(); // userId → channelId
const candidaturasAbertas = new Map(); // userId → { channelId, acertos, perguntaAtual, dadosPersonagem }

// ── PERGUNTAS ─────────────────────────────────────────────────────────────────
const PERGUNTAS = [
  {
    pergunta: '❓ O que é **RDM** no FiveM RP?',
    opcoes: {
      A: 'Roubar veículo sem motivo de RP',
      B: 'Matar outro jogador sem motivo de RP',
      C: 'Usar carro como arma',
      D: 'Sair do personagem durante a cena',
    },
    correta: 'B'
  },
  {
    pergunta: '❓ O que é **VDM** no FiveM RP?',
    opcoes: {
      A: 'Vender drogas sem autorização',
      B: 'Matar jogador sem motivo',
      C: 'Usar veículo como arma para matar ou derrubar jogadores',
      D: 'Dirigir em alta velocidade na cidade',
    },
    correta: 'C'
  },
  {
    pergunta: '❓ O que é **Metagame**?',
    opcoes: {
      A: 'Usar informações do Discord/fora do jogo dentro do RP',
      B: 'Jogar em dois servidores ao mesmo tempo',
      C: 'Usar cheats no jogo',
      D: 'Criar um personagem falso',
    },
    correta: 'A'
  },
  {
    pergunta: '❓ O que é **FearRP**?',
    opcoes: {
      A: 'Fugir de todo confronto sem motivo',
      B: 'Seu personagem deve agir com medo quando está em desvantagem ou sob mira',
      C: 'Proibição de atacar policiais',
      D: 'Regra que impede render-se em confrontos',
    },
    correta: 'B'
  },
  {
    pergunta: '❓ O que é **Dark RP**?',
    opcoes: {
      A: 'RP feito apenas à noite no jogo',
      B: 'Roleplay de temas pesados como tortura, sequestro e crimes graves',
      C: 'Jogar sem HUD ativado',
      D: 'Usar skin escura no personagem',
    },
    correta: 'B'
  },
  {
    pergunta: '❓ O que é **Anti-Carjacking**?',
    opcoes: {
      A: 'Sistema que impede roubo de carros no servidor',
      B: 'Regra que proíbe fugir de abordagem policial',
      C: 'Regra que proíbe roubar veículo de jogador sem contexto de RP válido',
      D: 'Proteção automática para veículos de luxo',
    },
    correta: 'C'
  },
  {
    pergunta: '❓ O que é **NLR** (New Life Rule)?',
    opcoes: {
      A: 'Poder criar um novo personagem a qualquer momento',
      B: 'Após morrer, seu personagem não lembra dos eventos anteriores e não pode retornar ao local',
      C: 'Regra que permite reviver aliados no campo de batalha',
      D: 'Trocar de personagem durante uma cena ativa',
    },
    correta: 'B'
  },
];

// ── FUNÇÕES AUXILIARES ────────────────────────────────────────────────────────

function temPermissaoAdmin(member) {
  return (
    member.permissions.has(PermissionFlagsBits.Administrator) ||
    member.roles.cache.some(r => ['Administrador', 'Dono/Líder', 'Sub-Dono'].includes(r.name))
  );
}

async function enviarLog(guild, mensagem, cor = 0x3498db) {
  const canal = guild.channels.cache.find(c => c.name === CANAL_LOGS);
  if (!canal) return;
  await canal.send({
    embeds: [new EmbedBuilder().setColor(cor).setDescription(mensagem).setFooter({ text: RODAPE }).setTimestamp()]
  }).catch(() => {});
}

function embedPergunta(index, dados) {
  const p = PERGUNTAS[index];
  return {
    embed: new EmbedBuilder()
      .setColor(COR_FAC)
      .setTitle(`📋 Pergunta ${index + 1} de ${PERGUNTAS.length}`)
      .setDescription(p.pergunta)
      .addFields(
        { name: '🅰️ A', value: p.opcoes.A, inline: false },
        { name: '🅱️ B', value: p.opcoes.B, inline: false },
        { name: '🇨 C', value: p.opcoes.C, inline: false },
        { name: '🇩 D', value: p.opcoes.D, inline: false },
        { name: '📊 Progresso', value: `Acertos até agora: **${dados.acertos}**`, inline: false }
      )
      .setFooter({ text: `${RODAPE} • Acerte 5 ou mais para passar!` })
      .setTimestamp(),
    botoes: new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`resp_A_${index}`).setLabel('A').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`resp_B_${index}`).setLabel('B').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`resp_C_${index}`).setLabel('C').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`resp_D_${index}`).setLabel('D').setStyle(ButtonStyle.Primary),
    )
  };
}

function embedResultado(acertos, total, aprovado) {
  return new EmbedBuilder()
    .setColor(aprovado ? COR_APROVADO : COR_REPROVADO)
    .setTitle(aprovado ? '✅ TESTE CONCLUÍDO — APROVADO' : '❌ TESTE CONCLUÍDO — REPROVADO')
    .setDescription(aprovado
      ? `Parabéns! Você acertou **${acertos}/${total}** questões.\nAguarde a análise final de um administrador.`
      : `Você acertou apenas **${acertos}/${total}** questões.\nSão necessários pelo menos **5 acertos** para passar.\nVocê pode tentar novamente após **7 dias**.`
    )
    .setFooter({ text: RODAPE })
    .setTimestamp();
}

// ── HANDLER PRINCIPAL ─────────────────────────────────────────────────────────
export async function handleInteraction(interaction, client) {

  // ── COMANDOS SLASH ────────────────────────────────────────────────────────
  if (interaction.isChatInputCommand()) {
    if (interaction.channel.name !== CANAL_STAFF) {
      return interaction.reply({ content: '❌ Use os comandos apenas no canal **🔧┃staff-chat**!', ephemeral: true });
    }
    if (!temPermissaoAdmin(interaction.member)) {
      return interaction.reply({ content: '❌ Você não tem permissão!', ephemeral: true });
    }
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try { await command.execute(interaction, { enviarLog }); }
    catch (err) { await interaction.reply({ content: '❌ Erro ao executar o comando.', ephemeral: true }); }
    return;
  }

  // ── MODAL SUBMIT ──────────────────────────────────────────────────────────
  if (interaction.isModalSubmit() && interaction.customId === 'modal_candidatura') {
    const nomeJogo  = interaction.fields.getTextInputValue('input_nome');
    const idJogo    = interaction.fields.getTextInputValue('input_id');
    const idadeJogo = interaction.fields.getTextInputValue('input_idade');

    const { user, guild } = interaction;

    // Cria canal privado
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

    candidaturasAbertas.set(user.id, {
      channelId: novoCanal.id,
      acertos: 0,
      perguntaAtual: 0,
      dadosPersonagem: { nomeJogo, idJogo, idadeJogo }
    });

    // Embed de boas vindas com dados confirmados
    await novoCanal.send({
      embeds: [
        new EmbedBuilder()
          .setColor(COR_FAC)
          .setTitle('📝 CANDIDATURA — BEIRARIO')
          .setDescription(`Olá <@${user.id}>! Seus dados foram registrados.\nAgora responda as **${PERGUNTAS.length} perguntas** de conhecimento de RP abaixo.`)
          .addFields(
            { name: '🎮 Nome no jogo', value: `> ${nomeJogo}`, inline: true },
            { name: '🪪 ID', value: `> ${idJogo}`, inline: true },
            { name: '🎂 Idade do personagem', value: `> ${idadeJogo}`, inline: true },
            { name: '📊 Pontuação mínima', value: '> Acerte **5 ou mais** questões para ser aprovado!', inline: false }
          )
          .setFooter({ text: RODAPE })
          .setTimestamp()
      ]
    });

    // Posta a primeira pergunta
    const { embed, botoes } = embedPergunta(0, { acertos: 0 });
    await novoCanal.send({ embeds: [embed], components: [botoes] });

    await enviarLog(guild, `📝 **Candidatura iniciada** por <@${user.id}> (${nomeJogo} • ID: ${idJogo}) → ${novoCanal}`, 0x9b59b6);

    return interaction.reply({ content: `✅ Canal criado! ${novoCanal.toString()}`, ephemeral: true });
  }

  if (!interaction.isButton()) return;
  const { customId, guild, member, user } = interaction;

  // ── Abrir Ticket ──────────────────────────────────────────────────────────
  if (customId === 'abrir_ticket') {
    if (ticketsAbertos.has(user.id)) {
      const canalExistente = guild.channels.cache.get(ticketsAbertos.get(user.id));
      return interaction.reply({ content: `❌ Você já tem um ticket aberto! ${canalExistente || ''}`, ephemeral: true });
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
    return interaction.reply({ content: `✅ Ticket aberto! ${novoCanal.toString()}`, ephemeral: true });
  }

  // ── Resolver Ticket ───────────────────────────────────────────────────────
  if (customId === 'resolver_ticket') {
    if (!temPermissaoAdmin(member)) return interaction.reply({ content: '❌ Apenas administradores podem resolver tickets.', ephemeral: true });
    await enviarLog(guild, `✅ **Ticket resolvido** por <@${user.id}> → ${interaction.channel.name}`, 0x2ecc71);
    await interaction.reply({ content: '✅ Ticket resolvido! Canal será deletado em 5 segundos.' });
    setTimeout(async () => {
      for (const [uid, cid] of ticketsAbertos.entries()) { if (cid === interaction.channel.id) ticketsAbertos.delete(uid); }
      await interaction.channel.delete().catch(() => {});
    }, 5000);
    return;
  }

  // ── Fechar Ticket ─────────────────────────────────────────────────────────
  if (customId === 'fechar_ticket') {
    if (!temPermissaoAdmin(member)) return interaction.reply({ content: '❌ Apenas administradores podem fechar tickets.', ephemeral: true });
    await enviarLog(guild, `🔒 **Ticket fechado** por <@${user.id}> → ${interaction.channel.name}`, 0xe67e22);
    await interaction.reply({ content: '🔒 Ticket fechado. Canal será deletado em 5 segundos.' });
    setTimeout(async () => {
      for (const [uid, cid] of ticketsAbertos.entries()) { if (cid === interaction.channel.id) ticketsAbertos.delete(uid); }
      await interaction.channel.delete().catch(() => {});
    }, 5000);
    return;
  }

  // ── Abrir Candidatura (abre o Modal) ──────────────────────────────────────
  if (customId === 'abrir_candidatura') {
    if (candidaturasAbertas.has(user.id)) {
      const dados = candidaturasAbertas.get(user.id);
      const canalExistente = guild.channels.cache.get(dados.channelId);
      return interaction.reply({ content: `❌ Você já tem uma candidatura aberta! ${canalExistente || ''}`, ephemeral: true });
    }

    const modal = new ModalBuilder()
      .setCustomId('modal_candidatura')
      .setTitle('📝 Candidatura — BeiraRIO');

    const inputNome = new TextInputBuilder()
      .setCustomId('input_nome')
      .setLabel('Nome do seu personagem no jogo')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: João Silva')
      .setRequired(true)
      .setMaxLength(50);

    const inputId = new TextInputBuilder()
      .setCustomId('input_id')
      .setLabel('Seu ID no servidor FiveM')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: 1234')
      .setRequired(true)
      .setMaxLength(10);

    const inputIdade = new TextInputBuilder()
      .setCustomId('input_idade')
      .setLabel('Idade do seu personagem no jogo')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: 25')
      .setRequired(true)
      .setMaxLength(3);

    modal.addComponents(
      new ActionRowBuilder().addComponents(inputNome),
      new ActionRowBuilder().addComponents(inputId),
      new ActionRowBuilder().addComponents(inputIdade),
    );

    return interaction.showModal(modal);
  }

  // ── Resposta das perguntas (resp_A_0, resp_B_2, etc.) ─────────────────────
  if (customId.startsWith('resp_')) {
    const partes = customId.split('_');       // ['resp', 'A', '0']
    const respostaAluno = partes[1];           // 'A', 'B', 'C' ou 'D'
    const indexPergunta = parseInt(partes[2]); // 0-6

    const dadosCand = candidaturasAbertas.get(user.id);
    if (!dadosCand) return interaction.reply({ content: '❌ Candidatura não encontrada.', ephemeral: true });
    if (dadosCand.channelId !== interaction.channel.id) return interaction.reply({ content: '❌ Canal inválido.', ephemeral: true });
    if (dadosCand.perguntaAtual !== indexPergunta) return interaction.reply({ content: '❌ Esta pergunta já foi respondida.', ephemeral: true });

    const pergunta = PERGUNTAS[indexPergunta];
    const acertou  = respostaAluno === pergunta.correta;
    if (acertou) dadosCand.acertos++;
    dadosCand.perguntaAtual++;
    candidaturasAbertas.set(user.id, dadosCand);

    // Desabilita os botões da pergunta atual
    await interaction.update({
      components: [
        new ActionRowBuilder().addComponents(
          ['A','B','C','D'].map(letra =>
            new ButtonBuilder()
              .setCustomId(`resp_${letra}_${indexPergunta}_done`)
              .setLabel(letra === respostaAluno ? `${letra} ✓` : letra)
              .setStyle(
                letra === pergunta.correta ? ButtonStyle.Success :
                letra === respostaAluno    ? ButtonStyle.Danger  :
                ButtonStyle.Secondary
              )
              .setDisabled(true)
          )
        )
      ]
    });

    const proximaIndex = indexPergunta + 1;

    // Ainda tem perguntas
    if (proximaIndex < PERGUNTAS.length) {
      const { embed, botoes } = embedPergunta(proximaIndex, dadosCand);
      await interaction.channel.send({ embeds: [embed], components: [botoes] });
      return;
    }

    // ── Fim do teste ──────────────────────────────────────────────────────
    const totalAcertos = dadosCand.acertos;
    const aprovado     = totalAcertos >= 5;
    const { nomeJogo, idJogo, idadeJogo } = dadosCand.dadosPersonagem;

    await interaction.channel.send({ embeds: [embedResultado(totalAcertos, PERGUNTAS.length, aprovado)] });

    if (!aprovado) {
      // Reprovado automaticamente
      candidaturasAbertas.delete(user.id);

      const canalReprovados = guild.channels.cache.find(c => c.name === CANAL_REPROVADOS);
      if (canalReprovados) await canalReprovados.send({ embeds: [embedReprovado(`<@${user.id}>`)] });

      await guild.members.fetch(user.id).then(m =>
        m.send(`❌ **Sua candidatura à BeiraRIO foi reprovada automaticamente.**\nVocê acertou ${totalAcertos}/7 questões. Tente novamente após 7 dias.`).catch(() => {})
      );

      await enviarLog(guild, `❌ **Candidatura reprovada (teste)** — <@${user.id}> (${nomeJogo}) acertou ${totalAcertos}/7`, 0xe74c3c);

      setTimeout(async () => { await interaction.channel.delete().catch(() => {}); }, 8000);
      return;
    }

    // Aprovado no teste — aguarda confirmação do admin
    await interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(COR_INFO)
          .setTitle('⏳ AGUARDANDO APROVAÇÃO DO ADMIN')
          .setDescription(`<@${user.id}> passou no teste! Um administrador deve confirmar abaixo.`)
          .addFields(
            { name: '🎮 Nome', value: nomeJogo, inline: true },
            { name: '🪪 ID',   value: idJogo,   inline: true },
            { name: '🎂 Idade', value: idadeJogo, inline: true },
            { name: '📊 Acertos', value: `${totalAcertos}/7`, inline: true }
          )
          .setFooter({ text: RODAPE }).setTimestamp()
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('aprovar_candidatura').setLabel('✅ Aprovar').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('reprovar_candidatura').setLabel('❌ Reprovar').setStyle(ButtonStyle.Danger)
        )
      ]
    });
    return;
  }

  // ── Aprovar Candidatura (admin) ───────────────────────────────────────────
  if (customId === 'aprovar_candidatura') {
    if (!temPermissaoAdmin(member)) return interaction.reply({ content: '❌ Apenas administradores podem aprovar.', ephemeral: true });

    let usuarioAlvo = null;
    let userId = null;
    let dadosCand = null;
    for (const [uid, dados] of candidaturasAbertas.entries()) {
      if (dados.channelId === interaction.channel.id) {
        userId    = uid;
        dadosCand = dados;
        usuarioAlvo = await guild.members.fetch(uid).catch(() => null);
        candidaturasAbertas.delete(uid);
        break;
      }
    }

    if (!usuarioAlvo || !dadosCand) return interaction.reply({ content: '❌ Candidato não encontrado.', ephemeral: true });

    const { nomeJogo, idJogo, idadeJogo } = dadosCand.dadosPersonagem;

    // Cria cargo personalizado
    try {
      const cargoPersonalizado = await guild.roles.create({
        name: `[${idJogo}] ${nomeJogo} • ${idadeJogo}`,
        color: 0x95a5a6,
        hoist: false,
        mentionable: false,
      });
      await usuarioAlvo.roles.add(cargoPersonalizado);
    } catch (err) {
      console.warn(`⚠️ Erro ao criar cargo: ${err.message}`);
    }

    // Dá o cargo Base
    const cargoBase = guild.roles.cache.find(r => r.name === 'Base');
    if (cargoBase) await usuarioAlvo.roles.add(cargoBase).catch(() => {});

    // Muda o apelido no servidor para o nome do personagem no jogo
    await usuarioAlvo.setNickname(nomeJogo).catch(() => {
      console.warn(`⚠️ Não foi possível mudar nickname de ${usuarioAlvo.user.username}`);
    });

    const canalAprovados = guild.channels.cache.find(c => c.name === CANAL_APROVADOS);
    if (canalAprovados) await canalAprovados.send({ embeds: [embedAprovado(`<@${usuarioAlvo.id}>`, nomeJogo, idJogo, idadeJogo)] });

    await usuarioAlvo.send(`✅ **Parabéns! Sua candidatura à BeiraRIO foi APROVADA!**\nBem-vindo à organização. 🔴\n\n🎮 **Personagem:** ${nomeJogo}\n🪪 **ID:** ${idJogo}`).catch(() => {});
    await enviarLog(guild, `✅ **Aprovado** — <@${usuarioAlvo.id}> (${nomeJogo} • ID: ${idJogo}) por <@${user.id}>`, 0x2ecc71);

    await interaction.reply({ content: `✅ **${nomeJogo}** (ID: ${idJogo}) aprovado e recebeu o cargo Base!` });
    setTimeout(async () => { await interaction.channel.delete().catch(() => {}); }, 5000);
    return;
  }

  // ── Reprovar Candidatura (admin) ──────────────────────────────────────────
  if (customId === 'reprovar_candidatura') {
    if (!temPermissaoAdmin(member)) return interaction.reply({ content: '❌ Apenas administradores podem reprovar.', ephemeral: true });

    let usuarioAlvo = null;
    for (const [uid, dados] of candidaturasAbertas.entries()) {
      if (dados.channelId === interaction.channel.id) {
        usuarioAlvo = await guild.members.fetch(uid).catch(() => null);
        candidaturasAbertas.delete(uid);
        break;
      }
    }

    if (!usuarioAlvo) return interaction.reply({ content: '❌ Candidato não encontrado.', ephemeral: true });

    const canalReprovados = guild.channels.cache.find(c => c.name === CANAL_REPROVADOS);
    if (canalReprovados) await canalReprovados.send({ embeds: [embedReprovado(`<@${usuarioAlvo.id}>`)] });

    await usuarioAlvo.send('❌ **Sua candidatura à BeiraRIO foi reprovada.**\nTente novamente após 7 dias.').catch(() => {});
    await enviarLog(guild, `❌ **Reprovado** — <@${usuarioAlvo.id}> por <@${user.id}>`, 0xe74c3c);

    await interaction.reply({ content: `❌ ${usuarioAlvo.user.username} foi reprovado.` });
    setTimeout(async () => { await interaction.channel.delete().catch(() => {}); }, 5000);
    return;
  }
}
