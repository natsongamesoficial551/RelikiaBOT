import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('aviso')
    .setDescription('Envia um aviso por DM para um membro')
    .addUserOption(o => o.setName('usuario').setDescription('Membro a avisar').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Mensagem do aviso').setRequired(true)),
  async execute(interaction, { enviarLog }) {
    const alvo = interaction.options.getMember('usuario');
    const motivo = interaction.options.getString('motivo');

    const enviado = await alvo.send(
      `⚠️ **AVISO OFICIAL — BOPE**\n\n${motivo}\n\n*Caso não concorde, abra um ticket no servidor.*`
    ).catch(() => null);

    await enviarLog(interaction.guild, `⚠️ **Aviso enviado** para <@${alvo.id}> por <@${interaction.user.id}>\n**Mensagem:** ${motivo}`, 0xf39c12);

    return interaction.reply({
      embeds: [
        new EmbedBuilder().setColor(0xf39c12).setTitle('⚠️ AVISO ENVIADO')
          .setDescription(`**Para:** <@${alvo.id}>\n**Mensagem:** ${motivo}\n**DM entregue:** ${enviado ? 'Sim ✅' : 'Não (DMs fechadas) ❌'}`)
          .setFooter({ text: `Enviado por ${interaction.user.username}` }).setTimestamp()
      ]
    });
  }
};
