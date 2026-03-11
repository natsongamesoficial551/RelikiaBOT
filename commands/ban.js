import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um membro do servidor')
    .addUserOption(o => o.setName('usuario').setDescription('Membro a banir').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Motivo do ban').setRequired(true)),
  async execute(interaction, { enviarLog }) {
    const alvo = interaction.options.getMember('usuario');
    const motivo = interaction.options.getString('motivo');

    if (!alvo.bannable) return interaction.reply({ content: '❌ Não consigo banir este membro.', ephemeral: true });

    await alvo.send(`🔨 Você foi **banido** do servidor BOPE.\n**Motivo:** ${motivo}`).catch(() => {});
    await alvo.ban({ reason: motivo });
    await enviarLog(interaction.guild, `🔨 **Ban** — <@${alvo.id}> banido por <@${interaction.user.id}>\n**Motivo:** ${motivo}`, 0xe74c3c);

    return interaction.reply({
      embeds: [
        new EmbedBuilder().setColor(0xe74c3c).setTitle('🔨 MEMBRO BANIDO')
          .setDescription(`**Membro:** <@${alvo.id}>\n**Motivo:** ${motivo}`)
          .setFooter({ text: `Executado por ${interaction.user.username}` }).setTimestamp()
      ]
    });
  }
};
