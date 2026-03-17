import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avisodm')
    .setDescription('Envia um aviso oficial por DM para um membro')
    .addUserOption(o =>
      o.setName('membro')
        .setDescription('Membro que vai receber o aviso')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('mensagem')
        .setDescription('Mensagem do aviso')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('titulo')
        .setDescription('Título do aviso (opcional)')
        .setRequired(false)
    ),

  async execute(interaction, { enviarLog }) {
    const alvo      = interaction.options.getMember('membro');
    const mensagem  = interaction.options.getString('mensagem');
    const titulo    = interaction.options.getString('titulo') || 'AVISO OFICIAL — CIDADE ALTA';
    const autor     = interaction.member;

    // Embed que o membro recebe na DM
    const embedDM = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle(`📨 ${titulo}`)
      .setDescription(`> ${mensagem}`)
      .addFields(
        {
          name: '👮 Enviado por',
          value: `${autor.displayName} — Cidade Alta`,
          inline: true
        },
        {
          name: '📅 Data',
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: true
        },
        {
          name: '⚠️ Importante',
          value: 'Este é um aviso oficial da facção. Caso queira contestar ou tirar dúvidas, abra um ticket no servidor.',
          inline: false
        }
      )
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({
        text: 'Cidade Alta — Facção — Cidade Alta | FiveM RP',
        iconURL: interaction.guild.iconURL({ dynamic: true })
      })
      .setTimestamp();

    // Tenta enviar a DM
    const enviado = await alvo.send({ embeds: [embedDM] }).catch(() => null);

    // Log interno
    await enviarLog(
      interaction.guild,
      `📨 **Aviso DM** enviado para <@${alvo.id}> por <@${interaction.user.id}>\n**Mensagem:** ${mensagem}\n**DM entregue:** ${enviado ? 'Sim ✅' : 'Não (DMs fechadas) ❌'}`,
      0xff0000
    );

    // Resposta privada pro admin confirmando
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(enviado ? 0x2ecc71 : 0xe74c3c)
          .setTitle(enviado ? '✅ Aviso enviado com sucesso!' : '⚠️ Não foi possível entregar o aviso')
          .setDescription(
            enviado
              ? `O aviso foi entregue na DM de <@${alvo.id}> com sucesso.`
              : `<@${alvo.id}> está com as **DMs fechadas**. O aviso não pôde ser entregue.\nPeça para ele abrir as DMs e tente novamente.`
          )
          .addFields(
            { name: '👤 Destinatário', value: `<@${alvo.id}>`, inline: true },
            { name: '📝 Mensagem', value: mensagem, inline: false }
          )
          .setFooter({ text: `Enviado por ${interaction.user.username}` })
          .setTimestamp()
      ],
      ephemeral: true
    });
  }
};
