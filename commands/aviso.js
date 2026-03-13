import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const CANAL_AVISOS_ID = '1481094376821096480';

export default {
  data: new SlashCommandBuilder()
    .setName('aviso')
    .setDescription('Envia um aviso oficial no canal de avisos')
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
    const mensagem = interaction.options.getString('mensagem');
    const tituloCustom = interaction.options.getString('titulo');
    const autor = interaction.member;

    const canal = interaction.guild.channels.cache.get(CANAL_AVISOS_ID);
    if (!canal) {
      return interaction.reply({
        content: '❌ Canal de avisos não encontrado!',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle(`📢 ${tituloCustom || 'AVISO OFICIAL — BOPE'}`)
      .setDescription(
        `> ${mensagem.split('\n').join('\n> ')}`
      )
      .addFields(
        {
          name: '⚠️ Atenção',
          value: 'Este é um comunicado oficial. O descumprimento pode resultar em punição.',
          inline: false
        },
        {
          name: '👮 Emitido por',
          value: `<@${autor.id}>`,
          inline: true
        },
        {
          name: '📅 Data',
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: true
        }
      )
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setImage('https://i.imgur.com/placeholder.png')
      .setFooter({
        text: 'BOPE — Batalhão de Operações Policiais Especiais | FiveM RP',
        iconURL: interaction.guild.iconURL({ dynamic: true })
      })
      .setTimestamp();

    // Posta no canal de avisos com @everyone
    await canal.send({
      content: '@everyone',
      embeds: [embed]
    });

    await enviarLog(
      interaction.guild,
      `📢 **Aviso postado** por <@${interaction.user.id}> no canal <#${CANAL_AVISOS_ID}>\n**Mensagem:** ${mensagem}`,
      0xff0000
    );

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x2ecc71)
          .setTitle('✅ Aviso enviado com sucesso!')
          .setDescription(`O aviso foi postado em <#${CANAL_AVISOS_ID}>`)
          .setFooter({ text: `Emitido por ${interaction.user.username}` })
          .setTimestamp()
      ],
      ephemeral: true
    });
  }
};
