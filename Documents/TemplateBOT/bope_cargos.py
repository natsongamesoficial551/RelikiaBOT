import discord
from discord.ext import commands
import asyncio

# ============================================================
#  CONFIGURAÇÃO — edite apenas esta seção
# ============================================================
TOKEN = "MTQ4MTA5MzY3NzkzMjYwOTcwNw.GSMDqj.JoFnq2f8nTfdB9B91EKqYGadPdTjqMK_hlUUOQ"
GUILD_ID = 989299798685413386
# ============================================================

intents = discord.Intents.default()
intents.guilds = True
bot = commands.Bot(command_prefix="!", intents=intents)

# Cargos: (nome, cor em hex, hoist=aparecer separado na lista, mentionavel)
CARGOS = [
    # --- Administrativos (topo) ---
    {"nome": "Administrador", "cor": 0xE74C3C, "hoist": True,  "mentionavel": True},
    {"nome": "BOTS",          "cor": 0x979C9F, "hoist": True,  "mentionavel": False},

    # --- Hierarquia BOPE ---
    {"nome": "Coronel",       "cor": 0xF1C40F, "hoist": True,  "mentionavel": True},
    {"nome": "Cabo",          "cor": 0x3498DB, "hoist": True,  "mentionavel": True},
    {"nome": "Soldado",       "cor": 0x2ECC71, "hoist": True,  "mentionavel": True},
]


@bot.event
async def on_ready():
    print(f"✅ Bot conectado como {bot.user}")

    guild = bot.get_guild(GUILD_ID)
    if not guild:
        print("❌ Servidor não encontrado! Verifique o GUILD_ID.")
        await bot.close()
        return

    print(f"🚀 Criando cargos em: {guild.name}\n")

    for cargo in CARGOS:
        await guild.create_role(
            name=cargo["nome"],
            colour=discord.Colour(cargo["cor"]),
            hoist=cargo["hoist"],         # aparece separado na lista de membros
            mentionable=cargo["mentionavel"],
            permissions=discord.Permissions.none()
        )
        print(f"   ✅ Cargo criado: {cargo['nome']}")
        await asyncio.sleep(0.5)  # evita rate limit

    print("\n🎉 Todos os cargos foram criados com sucesso!")
    await bot.close()


bot.run(TOKEN)
