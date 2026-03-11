import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Verifica a latência do bot'),
  async execute(interaction) {
    const inicio = Date.now();
    await interaction.reply({ content: '🏓 Calculando...' });
    const latencia = Date.now() - inicio;

    return interaction.editReply({
      content: '',
      embeds: [
        new EmbedBuilder().setColor(0x2ecc71).setTitle('🏓 PONG!')
          .addFields(
            { name: '⚡ Latência', value: `${latencia}ms`, inline: true },
            { name: '💓 API Discord', value: `${interaction.client.ws.ping}ms`, inline: true }
          )
          .setFooter({ text: 'BOPE — FiveM RP' }).setTimestamp()
      ]
    });
  }
};
