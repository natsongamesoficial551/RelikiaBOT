import {
  embedRegras,
  embedRegrasRP,
  embedSobre,
  embedRequisitos,
  embedIpServidor,
  embedSuporte,
  embedCandidatura
} from '../embeds/index.js';

// Mapa: nome do canal → função que retorna o conteúdo
const CANAIS_AUTOMATICOS = {
  '📌┃regras-gerais':       () => ({ embeds: [embedRegras()] }),
  '📜┃regras-rp':           () => ({ embeds: [embedRegrasRP()] }),
  '🔴┃sobre-a-faccao':      () => ({ embeds: [embedSobre()] }),
  '🎯┃requisitos-entrada':  () => ({ embeds: [embedRequisitos()] }),
  '🔗┃ip-servidor':         () => ({ embeds: [embedIpServidor()] }),
  '🛠️┃suporte':             () => {
    const { embed, botao } = embedSuporte();
    return { embeds: [embed], components: [botao] };
  },
  '📥┃como-se-candidatar':  () => {
    const { embed, botao } = embedCandidatura();
    return { embeds: [embed], components: [botao] };
  },
};

export async function postarMensagensAutomaticas(client) {
  for (const guild of client.guilds.cache.values()) {
    console.log(`\n📡 Atualizando mensagens automáticas em: ${guild.name}`);

    for (const [nomeCanal, gerarConteudo] of Object.entries(CANAIS_AUTOMATICOS)) {
      const canal = guild.channels.cache.find(c => c.name === nomeCanal);

      if (!canal) {
        console.log(`   ⚠️  Canal não encontrado: ${nomeCanal}`);
        continue;
      }

      try {
        // Busca mensagens do canal e deleta as que são do bot
        const mensagens = await canal.messages.fetch({ limit: 20 });
        const msgBot = mensagens.filter(m => m.author.id === client.user.id);
        for (const msg of msgBot.values()) {
          await msg.delete().catch(() => {});
        }

        // Posta a nova embed
        await canal.send(gerarConteudo());
        console.log(`   ✅ Atualizado: ${nomeCanal}`);
      } catch (err) {
        console.error(`   ❌ Erro em ${nomeCanal}:`, err.message);
      }
    }
  }

  console.log('\n🎉 Mensagens automáticas atualizadas!\n');
}
