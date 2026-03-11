import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const commands = [];
const commandFiles = readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(pathToFileURL(path.join(__dirname, 'commands', file)).href);
  if (command.default?.data) {
    commands.push(command.default.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.TOKEN);

try {
  console.log(`🔄 Registrando ${commands.length} comandos slash...`);
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log('✅ Comandos registrados com sucesso!');
} catch (err) {
  console.error('❌ Erro ao registrar comandos:', err);
}
