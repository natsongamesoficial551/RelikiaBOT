import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const status = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Exibe estatísticas do servidor'),
  async execute(interaction) {
    const guild = interaction.guild;
    await guild.members.fetch();
    const total = guild.memberCount;
    const bots = guild.members.cache.filter(m => m.user.bot).size;
    const humanos = total - bots;
    const online = guild.members.cache.filter(m => m.presence?.status !== 'offline' && !m.user.bot).size;

    const soldados = guild.members.cache.filter(m => m.roles.cache.some(r => r.name === 'Soldado')).size;
    const cabos = guild.members.cache.filter(m => m.roles.cache.some(r => r.name === 'Cabo')).size;
    const coroneis = guild.members.cache.filter(m => m.roles.cache.some(r => r.name === 'Coronel')).size;

    return interaction.reply({
      embeds: [
        new EmbedBuilder().setColor(0x1a1a1a).setTitle('📊 ESTATÍSTICAS DO SERVIDOR')
          .addFields(
            { name: '👥 Total de membros', value: `${humanos} humanos + ${bots} bots`, inline: true },
            { name: '🟢 Online agora', value: `${online} membros`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '🟡 Coronéis', value: `${coroneis}`, inline: true },
            { name: '🔵 Cabos', value: `${cabos}`, inline: true },
            { name: '🟢 Soldados', value: `${soldados}`, inline: true }
          )
          .setFooter({ text: 'BOPE — FiveM RP' }).setTimestamp()
      ]
    });
  }
};

export const ping = {
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

// Exporta os dois como default separados
export default status;
