import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa um membro do servidor')
    .addUserOption(o => o.setName('usuario').setDescription('Membro a expulsar').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Motivo da expulsão').setRequired(true)),
  async execute(interaction, { enviarLog }) {
    const alvo = interaction.options.getMember('usuario');
    const motivo = interaction.options.getString('motivo');

    if (!alvo.kickable) return interaction.reply({ content: '❌ Não consigo expulsar este membro.', ephemeral: true });

    await alvo.send(`⚠️ Você foi **expulso** do servidor BOPE.\n**Motivo:** ${motivo}`).catch(() => {});
    await alvo.kick(motivo);
    await enviarLog(interaction.guild, `👢 **Kick** — <@${alvo.id}> expulso por <@${interaction.user.id}>\n**Motivo:** ${motivo}`, 0xe67e22);

    return interaction.reply({
      embeds: [
        new EmbedBuilder().setColor(0xe67e22).setTitle('👢 MEMBRO EXPULSO')
          .setDescription(`**Membro:** <@${alvo.id}>\n**Motivo:** ${motivo}`)
          .setFooter({ text: `Executado por ${interaction.user.username}` }).setTimestamp()
      ]
    });
  }
};
