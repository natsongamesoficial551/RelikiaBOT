// commands/promover.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('promover')
    .setDescription('Promove um membro para um cargo')
    .addUserOption(o => o.setName('usuario').setDescription('Membro a promover').setRequired(true))
    .addStringOption(o =>
      o.setName('cargo')
        .setDescription('Cargo destino')
        .setRequired(true)
        .addChoices(
          { name: 'Cabo', value: 'Cabo' },
          { name: 'Coronel', value: 'Coronel' }
        )
    ),
  async execute(interaction, { enviarLog }) {
    const alvo = interaction.options.getMember('usuario');
    const nomeCargo = interaction.options.getString('cargo');
    const cargo = interaction.guild.roles.cache.find(r => r.name === nomeCargo);

    if (!cargo) return interaction.reply({ content: `❌ Cargo "${nomeCargo}" não encontrado!`, ephemeral: true });

    await alvo.roles.add(cargo).catch(() => {});
    await enviarLog(interaction.guild, `🎖️ **Promoção** — <@${alvo.id}> promovido para **${nomeCargo}** por <@${interaction.user.id}>`, 0xf1c40f);

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xf1c40f)
          .setTitle('🎖️ PROMOÇÃO')
          .setDescription(`<@${alvo.id}> foi promovido para **${nomeCargo}**!`)
          .setFooter({ text: `Promovido por ${interaction.user.username}` })
          .setTimestamp()
      ]
    });
  }
};
