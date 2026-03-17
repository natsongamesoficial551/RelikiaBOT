import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Exibe informações de um membro')
    .addUserOption(o => o.setName('usuario').setDescription('Membro').setRequired(true)),
  async execute(interaction) {
    const alvo = interaction.options.getMember('usuario');
    const cargos = alvo.roles.cache.filter(r => r.name !== '@everyone').map(r => r.toString()).join(', ') || 'Nenhum';

    return interaction.reply({
      embeds: [
        new EmbedBuilder().setColor(0x3498db).setTitle('👤 PERFIL DO MEMBRO')
          .setThumbnail(alvo.user.displayAvatarURL())
          .addFields(
            { name: '👤 Usuário', value: `<@${alvo.id}>`, inline: true },
            { name: '🏷️ Apelido', value: alvo.nickname || alvo.user.username, inline: true },
            { name: '📅 Entrou no servidor', value: `<t:${Math.floor(alvo.joinedTimestamp / 1000)}:D>`, inline: true },
            { name: '📅 Conta criada', value: `<t:${Math.floor(alvo.user.createdTimestamp / 1000)}:D>`, inline: true },
            { name: '🎖️ Cargos', value: cargos }
          )
          .setFooter({ text: `Cidade Alta — FiveM RP` }).setTimestamp()
      ]
    });
  }
};
