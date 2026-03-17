import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const CARGOS_Cidade Alta = ['Coronel', 'Cabo', 'Soldado'];

export default {
  data: new SlashCommandBuilder()
    .setName('rebaixar')
    .setDescription('Remove o cargo Cidade Alta de um membro')
    .addUserOption(o => o.setName('usuario').setDescription('Membro a rebaixar').setRequired(true)),
  async execute(interaction, { enviarLog }) {
    const alvo = interaction.options.getMember('usuario');
    const cargosRemovidos = [];

    for (const nomeCargo of CARGOS_Cidade Alta) {
      const cargo = alvo.roles.cache.find(r => r.name === nomeCargo);
      if (cargo) {
        await alvo.roles.remove(cargo).catch(() => {});
        cargosRemovidos.push(nomeCargo);
      }
    }

    if (cargosRemovidos.length === 0) {
      return interaction.reply({ content: '❌ Este membro não possui nenhum cargo do Cidade Alta.', ephemeral: true });
    }

    await enviarLog(interaction.guild, `⬇️ **Rebaixamento** — <@${alvo.id}> perdeu os cargos: **${cargosRemovidos.join(', ')}** por <@${interaction.user.id}>`, 0xe67e22);

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xe67e22)
          .setTitle('⬇️ REBAIXAMENTO')
          .setDescription(`<@${alvo.id}> teve os cargos **${cargosRemovidos.join(', ')}** removidos.`)
          .setFooter({ text: `Executado por ${interaction.user.username}` })
          .setTimestamp()
      ]
    });
  }
};
