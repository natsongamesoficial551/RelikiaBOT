import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const COR_BOPE = 0x1a1a1a;       // preto
const COR_APROVADO = 0x2ecc71;   // verde
const COR_REPROVADO = 0xe74c3c;  // vermelho
const COR_INFO = 0x3498db;       // azul
const RODAPE = 'BOPE — Batalhão de Operações Policiais Especiais | FiveM RP';

// ── REGRAS ────────────────────────────────────────────────────────────────────
export function embedRegras() {
  return new EmbedBuilder()
    .setColor(COR_BOPE)
    .setTitle('📋 REGULAMENTO OFICIAL — BOPE')
    .setDescription('Leia com atenção. O descumprimento das regras resulta em punição ou exclusão do grupo.')
    .addFields(
      {
        name: '🎮 1. ROLEPLAY',
        value: [
          '> **1.1** O BOPE é uma unidade de elite. Seu personagem deve agir como tal dentro e fora de operações.',
          '> **1.2** É proibido sair do personagem (break RP) durante ocorrências ativas.',
          '> **1.3** Proibido RDM (matar sem motivo roleplay válido) e VDM (usar veículo como arma sem RP).',
          '> **1.4** Não é permitido usar informações OOC (fora do personagem) dentro do jogo.',
          '> **1.5** O uniforme e equipamento do BOPE devem ser usados apenas em serviço.',
        ].join('\n')
      },
      {
        name: '🗣️ 2. COMUNICAÇÃO',
        value: [
          '> **2.1** O rádio é exclusivo para comunicações operacionais. Sem brincadeiras durante ocorrências.',
          '> **2.2** Respeito obrigatório com todos os membros, dentro e fora do jogo.',
          '> **2.3** Proibido expor informações internas do grupo em canais públicos.',
          '> **2.4** Qualquer conflito deve ser resolvido via ticket — jamais em canais públicos.',
        ].join('\n')
      },
      {
        name: '⚙️ 3. CONDUTA',
        value: [
          '> **3.1** Presença mínima exigida. Ausências longas devem ser justificadas no ticket de suporte.',
          '> **3.2** Proibido fazer parte de grupos rivais ou ilegais enquanto membro ativo do BOPE.',
          '> **3.3** Não é permitido vazar operações, estratégias ou membros para outros grupos.',
          '> **3.4** Abuso de poder ou de patente será punido com rebaixamento imediato.',
        ].join('\n')
      },
      {
        name: '🚔 4. OPERAÇÕES',
        value: [
          '> **4.1** Somente entre em operação com autorização do Coronel ou superior.',
          '> **4.2** Proibido realizar abordagens, prisões ou operações de forma solo sem avisar ao rádio.',
          '> **4.3** O uso de força letal só é permitido quando necessário e dentro do RP.',
          '> **4.4** Todo relatório de operação deve ser postado no canal correto após o término.',
        ].join('\n')
      },
      {
        name: '⚠️ 5. PUNIÇÕES',
        value: [
          '> **Advertência** → Descumprimento leve das regras',
          '> **Rebaixamento** → Reincidência ou falta grave',
          '> **Expulsão** → Traição, RDM intencional ou conduta tóxica grave',
        ].join('\n')
      }
    )
    .setFooter({ text: RODAPE })
    .setTimestamp();
}

// ── SOBRE O BOPE ──────────────────────────────────────────────────────────────
export function embedSobre() {
  return new EmbedBuilder()
    .setColor(COR_BOPE)
    .setTitle('🦅 SOBRE O BOPE')
    .setDescription('**Batalhão de Operações Policiais Especiais**\nUnidade de elite da Polícia Militar — especializada em situações de alto risco.')
    .addFields(
      {
        name: '📌 Nossa Missão',
        value: '> Manter a ordem e a segurança da cidade com profissionalismo, tática e respeito ao roleplay. O BOPE não é um grupo qualquer — é uma unidade de excelência.'
      },
      {
        name: '🎯 Especialidades',
        value: [
          '> 🔫 Operações táticas em zonas de alto risco',
          '> 🚁 Suporte aéreo e terrestre em ocorrências graves',
          '> 🔒 Controle de reféns e negociação',
          '> 🚔 Perseguições e abordagens avançadas',
          '> 🧠 Inteligência e planejamento operacional',
        ].join('\n')
      },
      {
        name: '⚖️ Nossos Valores',
        value: '> Disciplina • Lealdade • Profissionalismo • Trabalho em equipe'
      }
    )
    .setFooter({ text: RODAPE })
    .setTimestamp();
}

// ── REQUISITOS ────────────────────────────────────────────────────────────────
export function embedRequisitos() {
  return new EmbedBuilder()
    .setColor(COR_INFO)
    .setTitle('🎯 REQUISITOS PARA ENTRAR NO BOPE')
    .setDescription('Antes de se candidatar, confirme que você atende **todos** os requisitos abaixo.')
    .addFields(
      {
        name: '✅ Requisitos Obrigatórios',
        value: [
          '> 🎮 Ter experiência prévia em servidores de RP',
          '> 🎙️ Possuir microfone funcional',
          '> 📅 Disponibilidade mínima de 3x por semana',
          '> 📖 Ter lido e concordado com todas as regras',
          '> 🔞 Ter 16 anos ou mais',
          '> 💬 Saber comunicar-se de forma clara e respeitosa',
        ].join('\n')
      },
      {
        name: '⭐ Diferenciais (não obrigatórios)',
        value: [
          '> 🏅 Experiência em grupos policiais de RP',
          '> 🗺️ Conhecimento do mapa e dinâmica da cidade',
          '> 🤝 Indicação de um membro ativo do BOPE',
        ].join('\n')
      },
      {
        name: '❌ Impedimentos',
        value: [
          '> Fazer parte de facções criminosas ativas',
          '> Histórico de ban ou punição grave em outros servidores',
          '> Conduta tóxica conhecida na comunidade',
        ].join('\n')
      }
    )
    .setFooter({ text: `${RODAPE} • Atendendo os requisitos, vá em #como-se-candidatar` })
    .setTimestamp();
}

// ── IP SERVIDOR ───────────────────────────────────────────────────────────────
export function embedIpServidor() {
  return new EmbedBuilder()
    .setColor(COR_INFO)
    .setTitle('🎮 COMO ENTRAR NO SERVIDOR')
    .addFields(
      {
        name: '🔗 IP do Servidor FiveM',
        value: '```connect relikiarj.fivembr.com.br```'
      },
      {
        name: '📥 Passo a passo',
        value: [
          '> **1.** Baixe o FiveM em [fivem.net](https://fivem.net)',
          '> **2.** Abra o FiveM e clique em **"Procurar Servidores"**',
          '> **3.** Cole o IP na barra de busca ou pressione **F8** e digite `connect relikiarj.fivembr.com.br`',
          '> **4.** Aguarde o carregamento e divirta-se!',
        ].join('\n')
      },
      {
        name: '⚠️ Problemas para conectar?',
        value: '> Abra um ticket no canal 🛠️┃suporte que te ajudamos!'
      }
    )
    .setFooter({ text: RODAPE })
    .setTimestamp();
}

// ── SUPORTE ───────────────────────────────────────────────────────────────────
export function embedSuporte() {
  const embed = new EmbedBuilder()
    .setColor(COR_INFO)
    .setTitle('🛠️ SUPORTE — BOPE')
    .setDescription('Precisa de ajuda? Clique no botão abaixo para abrir um ticket privado.\nUm administrador irá te atender o quanto antes.')
    .addFields(
      {
        name: '📋 Use o ticket para:',
        value: [
          '> 🔧 Problemas técnicos no servidor',
          '> ⚖️ Denúncias ou reclamações',
          '> 📝 Justificar ausência',
          '> ❓ Dúvidas gerais',
        ].join('\n')
      },
      {
        name: '⚠️ Atenção',
        value: '> Não chame admins no privado. Use sempre o ticket!'
      }
    )
    .setFooter({ text: RODAPE })
    .setTimestamp();

  const botao = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('abrir_ticket')
      .setLabel('Abrir Ticket 🎟️')
      .setStyle(ButtonStyle.Primary)
  );

  return { embed, botao };
}

// ── CANDIDATURA ───────────────────────────────────────────────────────────────
export function embedCandidatura() {
  const embed = new EmbedBuilder()
    .setColor(COR_BOPE)
    .setTitle('📝 CANDIDATURA — BOPE')
    .setDescription('Quer fazer parte da unidade de elite? Clique no botão abaixo e inicie sua candidatura.\nUm canal privado será aberto para você responder as perguntas.')
    .addFields(
      {
        name: '📋 O processo funciona assim:',
        value: [
          '> **1.** Clique em "Me Candidatar"',
          '> **2.** Responda as perguntas no canal privado',
          '> **3.** Aguarde a análise de um Administrador',
          '> **4.** Você será avisado por mensagem privada',
        ].join('\n')
      },
      {
        name: '⏱️ Prazo de resposta',
        value: '> Responda dentro de **24 horas** ou a candidatura será cancelada automaticamente.'
      }
    )
    .setFooter({ text: `${RODAPE} • Verifique os requisitos antes de se candidatar!` })
    .setTimestamp();

  const botao = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('abrir_candidatura')
      .setLabel('Me Candidatar 📝')
      .setStyle(ButtonStyle.Success)
  );

  return { embed, botao };
}

// ── TICKET ABERTO ─────────────────────────────────────────────────────────────
export function embedTicketAberto(usuario) {
  const embed = new EmbedBuilder()
    .setColor(COR_INFO)
    .setTitle('🎟️ TICKET ABERTO')
    .setDescription(`Olá ${usuario}! Seu ticket foi aberto com sucesso.\nDescreva seu problema ou dúvida abaixo e aguarde um administrador.`)
    .addFields({ name: '⏱️ Tempo médio de resposta', value: '> Até 24 horas' })
    .setFooter({ text: RODAPE })
    .setTimestamp();

  const botoes = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('resolver_ticket')
      .setLabel('✅ Marcar como Resolvido')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('fechar_ticket')
      .setLabel('❌ Fechar Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  return { embed, botoes };
}

// ── CANDIDATURA ABERTA ────────────────────────────────────────────────────────
export function embedCandidaturaAberta(usuario) {
  const embed = new EmbedBuilder()
    .setColor(COR_BOPE)
    .setTitle('📝 CANDIDATURA INICIADA')
    .setDescription(`Olá ${usuario}! Responda as perguntas abaixo para concluir sua candidatura.`)
    .addFields(
      {
        name: '❓ Perguntas',
        value: [
          '> **1.** Qual seu nome e idade?',
          '> **2.** Há quanto tempo você joga FiveM RP?',
          '> **3.** Já fez parte de algum grupo policial? Qual?',
          '> **4.** Por que quer entrar no BOPE?',
          '> **5.** Qual sua disponibilidade semanal?',
          '> **6.** Possui microfone e consegue se comunicar bem?',
        ].join('\n')
      },
      {
        name: '⚠️ Atenção',
        value: '> Responda todas as perguntas em uma única mensagem ou separadas. Um admin irá analisar em breve.'
      }
    )
    .setFooter({ text: RODAPE })
    .setTimestamp();

  const botoes = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('aprovar_candidatura')
      .setLabel('✅ Aprovar')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('reprovar_candidatura')
      .setLabel('❌ Reprovar')
      .setStyle(ButtonStyle.Danger)
  );

  return { embed, botoes };
}

// ── APROVADO ──────────────────────────────────────────────────────────────────
export function embedAprovado(usuario) {
  return new EmbedBuilder()
    .setColor(COR_APROVADO)
    .setTitle('✅ NOVO SOLDADO APROVADO')
    .setDescription(`${usuario} foi aprovado e agora faz parte do BOPE!\nBem-vindo à unidade de elite. 🦅`)
    .setFooter({ text: RODAPE })
    .setTimestamp();
}

// ── REPROVADO ─────────────────────────────────────────────────────────────────
export function embedReprovado(usuario) {
  return new EmbedBuilder()
    .setColor(COR_REPROVADO)
    .setTitle('❌ CANDIDATURA REPROVADA')
    .setDescription(`${usuario} não foi aprovado desta vez.\nPode tentar novamente após 7 dias.`)
    .setFooter({ text: RODAPE })
    .setTimestamp();
}

export { COR_BOPE, COR_INFO, COR_APROVADO, COR_REPROVADO, RODAPE };
