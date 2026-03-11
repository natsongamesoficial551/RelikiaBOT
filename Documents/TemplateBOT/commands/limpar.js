import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('limpar')
    .setDescription('Apaga mensagens do canal')
    .addIntegerOption(o =>
      o.setName('quantidade').setDescription('Quantidade de mensagens (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)
    ),
  async execute(interaction, { enviarLog }) {
    const qtd = interaction.options.getInteger('quantidade');
    const deletadas = await interaction.channel.bulkDelete(qtd, true).catch(() => null);

    await enviarLog(interaction.guild, `🧹 **Limpeza** — ${deletadas?.size ?? 0} mensagens deletadas em #${interaction.channel.name} por <@${interaction.user.id}>`, 0x95a5a6);

    return interaction.reply({
      embeds: [
        new EmbedBuilder().setColor(0x95a5a6).setTitle('🧹 CANAL LIMPO')
          .setDescription(`**${deletadas?.size ?? 0}** mensagens deletadas em ${interaction.channel}.`)
          .setFooter({ text: `Executado por ${interaction.user.username}` }).setTimestamp()
      ],
      ephemeral: true
    });
  }
};
