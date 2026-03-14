import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const COR_FAC      = 0xC0392B;
const COR_APROVADO = 0x2ecc71;
const COR_REPROVADO = 0xe74c3c;
const COR_INFO     = 0xE67E22;
const RODAPE = 'BeiraRIO — Organização Criminosa | FiveM RP';

// ── REGRAS GERAIS (Discord) ───────────────────────────────────────────────────
export function embedRegras() {
  return new EmbedBuilder()
    .setColor(COR_FAC)
    .setTitle('📋 REGULAMENTO OFICIAL — BEIRARIO')
    .setDescription('Leia com atenção. O descumprimento das regras resulta em punição ou exclusão da organização.')
    .addFields(
      {
        name: '🗣️ 1. CONDUTA NO DISCORD',
        value: [
          '> **1.1** Respeito obrigatório com todos os membros, independente do cargo.',
          '> **1.2** Proibido flood, spam, caps lock excessivo e mensagens repetidas.',
          '> **1.3** Proibido divulgar links externos sem autorização da liderança.',
          '> **1.4** Discussões e conflitos devem ser resolvidos via ticket — nunca em canais públicos.',
          '> **1.5** Proibido expor informações internas da organização fora do servidor.',
        ].join('\n')
      },
      {
        name: '🎮 2. ROLEPLAY',
        value: [
          '> **2.1** É proibido sair do personagem (break RP) durante situações ativas.',
          '> **2.2** Proibido RDM (matar sem motivo roleplay válido) e VDM (usar veículo como arma sem RP).',
          '> **2.3** Não é permitido usar informações OOC (fora do personagem) dentro do jogo.',
          '> **2.4** Qualquer ação da organização deve ter base em roleplay — sem ataque gratuito.',
          '> **2.5** O uniforme e identificação da BeiraRIO devem ser usados apenas em atividade.',
        ].join('\n')
      },
      {
        name: '🔫 3. BAQUES E OPERAÇÕES',
        value: [
          '> **3.1** Nenhum baque pode ser iniciado sem autorização da liderança.',
          '> **3.2** Proibido agir solo em baques ou invasões sem avisar no rádio.',
          '> **3.3** Após todo baque, um relatório deve ser postado no canal correto.',
          '> **3.4** Respeite os aliados — não atire em membros de organizações parceiras.',
        ].join('\n')
      },
      {
        name: '⚙️ 4. ORGANIZAÇÃO',
        value: [
          '> **4.1** Presença mínima exigida. Ausências longas devem ser justificadas via ticket.',
          '> **4.2** Proibido fazer parte de organizações rivais enquanto membro ativo da BeiraRIO.',
          '> **4.3** Não é permitido vazar informações de baques, estratégias ou membros.',
          '> **4.4** Abuso de cargo ou poder será punido com rebaixamento imediato.',
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

// ── REGRAS RP ─────────────────────────────────────────────────────────────────
export function embedRegrasRP() {
  return new EmbedBuilder()
    .setColor(COR_INFO)
    .setTitle('🎭 REGRAS DE ROLEPLAY — BEIRARIO')
    .setDescription('Regras específicas de RP para membros da BeiraRIO dentro do servidor FiveM.')
    .addFields(
      {
        name: '📖 1. BÁSICO DO RP',
        value: [
          '> **1.1** Sempre mantenha o personagem durante situações de jogo.',
          '> **1.2** Não use informações do Discord dentro do jogo (metagame).',
          '> **1.3** Respeite o RP dos outros jogadores, inclusive inimigos.',
          '> **1.4** Qualquer situação de conflito deve ter contexto e motivação dentro do RP.',
        ].join('\n')
      },
      {
        name: '🔫 2. COMBATE',
        value: [
          '> **2.1** RDM (Random Death Match) é estritamente proibido.',
          '> **2.2** VDM (Vehicle Death Match) é proibido — veículo não é arma.',
          '> **2.3** Respeite o FearRP — seu personagem teme pela própria vida.',
          '> **2.4** Após ser abatido, respeite o NLR (New Life Rule) — não retorne ao local imediatamente.',
        ].join('\n')
      },
      {
        name: '🗺️ 3. TERRITÓRIO',
        value: [
          '> **3.1** Respeite os territórios marcados — não invada sem autorização da liderança.',
          '> **3.2** Baques devem ser comunicados com antecedência via rádio interno.',
          '> **3.3** Não execute civis sem motivo dentro do RP.',
          '> **3.4** Sequestros e assaltos devem seguir as regras do servidor FiveM.',
        ].join('\n')
      },
      {
        name: '🤝 4. ALIANÇAS E RIVAIS',
        value: [
          '> **4.1** Respeite os acordos de aliança — não atire em aliados.',
          '> **4.2** Guerras devem ser declaradas formalmente pela liderança.',
          '> **4.3** Proibido se passar por membro de outra organização (false flag).',
        ].join('\n')
      },
      {
        name: '🚔 5. COM A POLÍCIA',
        value: [
          '> **5.1** Render (render-se) é válido quando cercado e sob mira.',
          '> **5.2** Fuga é permitida quando há abertura — use o bom senso do RP.',
          '> **5.3** Proibido matar policiais sem motivo dentro do RP.',
        ].join('\n')
      }
    )
    .setFooter({ text: `${RODAPE} • Dúvidas? Abra um ticket no suporte.` })
    .setTimestamp();
}

// ── SOBRE A FAC ───────────────────────────────────────────────────────────────
export function embedSobre() {
  return new EmbedBuilder()
    .setColor(COR_FAC)
    .setTitle('🔴 SOBRE A BEIRARIO')
    .setDescription('**BeiraRIO — Organização Criminosa**\nNascida nas favelas, dominando as ruas. A BeiraRIO é uma organização mista que atua com força, estratégia e lealdade.')
    .addFields(
      {
        name: '📌 Nossa Missão',
        value: '> Dominar e proteger nosso território com disciplina, força e lealdade. A BeiraRIO não é uma gangue qualquer — é uma organização estruturada com hierarquia e respeito.'
      },
      {
        name: '💀 Especialidades',
        value: [
          '> 🔫 Baques e invasões de território',
          '> 💊 Controle de economia e mercado interno',
          '> 🗺️ Expansão e defesa de territórios',
          '> 🤝 Alianças estratégicas com outras organizações',
          '> 🧠 Planejamento e inteligência operacional',
        ].join('\n')
      },
      {
        name: '⚖️ Nossos Valores',
        value: '> Lealdade • Disciplina • Respeito à hierarquia • Proteção dos membros'
      },
      {
        name: '🎖️ Hierarquia',
        value: [
          '> 👑 **Dono/Líder** — Comando máximo',
          '> 🔴 **Sub-Dono** — Segundo em comando',
          '> 🟠 **Gerente** — Gestão das operações',
          '> 🟡 **Frente** — Linha de frente nos baques',
          '> ⬜ **Soldado** — Membro ativo',
          '> ⚫ **Base** — Recruta em período de avaliação',
        ].join('\n')
      }
    )
    .setFooter({ text: RODAPE })
    .setTimestamp();
}

// ── REQUISITOS ────────────────────────────────────────────────────────────────
export function embedRequisitos() {
  return new EmbedBuilder()
    .setColor(COR_INFO)
    .setTitle('🎯 REQUISITOS PARA ENTRAR NA BEIRARIO')
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
          '> 🏅 Experiência em organizações criminosas de RP',
          '> 🗺️ Conhecimento do mapa e dinâmica da cidade',
          '> 🤝 Indicação de um membro ativo da BeiraRIO',
        ].join('\n')
      },
      {
        name: '❌ Impedimentos',
        value: [
          '> Fazer parte de organizações rivais ativas',
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
        value: '```connect 82.24.40.208```'
      },
      {
        name: '📥 Passo a passo',
        value: [
          '> **1.** Baixe o FiveM em [fivem.net](https://fivem.net)',
          '> **2.** Abra o FiveM e clique em **"Procurar Servidores"**',
          '> **3.** Cole o IP na barra de busca ou pressione **F8** e digite `connect 82.24.40.208`',
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
    .setTitle('🛠️ SUPORTE — BEIRARIO')
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
      { name: '⚠️ Atenção', value: '> Não chame admins no privado. Use sempre o ticket!' }
    )
    .setFooter({ text: RODAPE })
    .setTimestamp();

  const botao = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('abrir_ticket').setLabel('Abrir Ticket 🎟️').setStyle(ButtonStyle.Primary)
  );
  return { embed, botao };
}

// ── CANDIDATURA ───────────────────────────────────────────────────────────────
export function embedCandidatura() {
  const embed = new EmbedBuilder()
    .setColor(COR_FAC)
    .setTitle('📝 CANDIDATURA — BEIRARIO')
    .setDescription('Quer fazer parte da organização? Clique no botão abaixo e inicie sua candidatura.\nUm canal privado será aberto para você responder as perguntas.')
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
      { name: '⏱️ Prazo de resposta', value: '> Responda dentro de **24 horas** ou a candidatura será cancelada.' }
    )
    .setFooter({ text: `${RODAPE} • Verifique os requisitos antes de se candidatar!` })
    .setTimestamp();

  const botao = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('abrir_candidatura').setLabel('Me Candidatar 📝').setStyle(ButtonStyle.Success)
  );
  return { embed, botao };
}

// ── CANDIDATURA ABERTA ────────────────────────────────────────────────────────
export function embedCandidaturaAberta(usuario) {
  const embed = new EmbedBuilder()
    .setColor(COR_FAC)
    .setTitle('📝 CANDIDATURA INICIADA — BEIRARIO')
    .setDescription(`Olá ${usuario}! Responda **todas** as perguntas abaixo para concluir sua candidatura.\n\n⚠️ **Use apenas informações do jogo — não informe dados reais pessoais.**`)
    .addFields(
      {
        name: '🎮 Informações do Personagem',
        value: [
          '> **1.** Qual o **nome do seu personagem** no jogo?',
          '> **2.** Qual o seu **ID** no servidor FiveM?',
          '> **3.** Qual a **idade do seu personagem** no jogo?',
        ].join('\n')
      },
      {
        name: '📋 Perguntas de Candidatura',
        value: [
          '> **4.** Há quanto tempo você joga FiveM RP?',
          '> **5.** Já fez parte de alguma organização ou facção? Qual?',
          '> **6.** Por que quer entrar na BeiraRIO?',
          '> **7.** Qual sua disponibilidade semanal?',
        ].join('\n')
      },
      {
        name: '📖 Teste de Regras — Responda Verdadeiro ou Falso',
        value: [
          '> **R1.** RDM (matar sem motivo de RP) é permitido?',
          '> **R2.** Posso usar informações do Discord dentro do jogo?',
          '> **R3.** Devo respeitar o FearRP quando estou sob mira?',
          '> **R4.** Posso iniciar um baque sem autorização da liderança?',
          '> **R5.** VDM (usar veículo como arma) é proibido?',
          '> **R6.** Devo respeitar o NLR após ser abatido?',
          '> **R7.** Posso atacar aliados durante um baque?',
        ].join('\n')
      },
      {
        name: '⚠️ Atenção',
        value: '> Responda tudo em mensagens separadas ou em uma só. Um admin irá analisar suas respostas.\n> **Respostas corretas:** R1-F • R2-F • R3-V • R4-F • R5-V • R6-V • R7-F'
      }
    )
    .setFooter({ text: RODAPE })
    .setTimestamp();

  const botoes = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('aprovar_candidatura').setLabel('✅ Aprovar').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('reprovar_candidatura').setLabel('❌ Reprovar').setStyle(ButtonStyle.Danger)
  );
  return { embed, botoes };
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
    new ButtonBuilder().setCustomId('resolver_ticket').setLabel('✅ Marcar como Resolvido').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('fechar_ticket').setLabel('❌ Fechar Ticket').setStyle(ButtonStyle.Danger)
  );
  return { embed, botoes };
}

// ── APROVADO ──────────────────────────────────────────────────────────────────
export function embedAprovado(usuario, nomeJogo, idJogo, idadeJogo) {
  return new EmbedBuilder()
    .setColor(COR_APROVADO)
    .setTitle('✅ NOVO MEMBRO APROVADO')
    .setDescription(`${usuario} foi aprovado e agora faz parte da BeiraRIO!\nBem-vindo à organização. 🔴`)
    .addFields(
      { name: '🎮 Nome no jogo', value: `> ${nomeJogo || 'N/A'}`, inline: true },
      { name: '🪪 ID', value: `> ${idJogo || 'N/A'}`, inline: true },
      { name: '🎂 Idade do personagem', value: `> ${idadeJogo || 'N/A'}`, inline: true },
    )
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

export { COR_FAC, COR_INFO, COR_APROVADO, COR_REPROVADO, RODAPE };
