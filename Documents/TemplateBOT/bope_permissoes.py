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

# Permissão: pode ler e escrever
def permitir(overwrites, cargo):
    overwrites[cargo] = discord.PermissionOverwrite(
        view_channel=True,
        send_messages=True,
        connect=True,
        speak=True
    )

# Permissão: pode ver mas não escrever
def so_leitura(overwrites, cargo):
    overwrites[cargo] = discord.PermissionOverwrite(
        view_channel=True,
        send_messages=False
    )

# Permissão: não pode ver nem acessar
def bloquear(overwrites, role):
    overwrites[role] = discord.PermissionOverwrite(
        view_channel=False,
        send_messages=False,
        connect=False
    )


@bot.event
async def on_ready():
    print(f"✅ Bot conectado como {bot.user}")

    guild = bot.get_guild(GUILD_ID)
    if not guild:
        print("❌ Servidor não encontrado! Verifique o GUILD_ID.")
        await bot.close()
        return

    # Busca os cargos pelo nome
    def cargo(nome):
        role = discord.utils.get(guild.roles, name=nome)
        if not role:
            print(f"⚠️  Cargo não encontrado: {nome}")
        return role

    everyone    = guild.default_role
    adm         = cargo("Administrador")
    bots        = cargo("BOTS")
    coronel     = cargo("Coronel")
    cabo        = cargo("Cabo")
    soldado     = cargo("Soldado")

    print(f"\n🚀 Aplicando permissões em: {guild.name}\n")

    # Estrutura: nome_do_canal → função que monta as permissões
    PERMISSOES = {

        # ── INFORMAÇÕES (só Adm escreve, todos veem) ──────────────────
        "📌┃regras-gerais":       lambda: _info(everyone, adm),
        "📢┃avisos":              lambda: _info(everyone, adm),
        "📋┃sobre-o-bope":        lambda: _info(everyone, adm),
        "🎯┃requisitos-entrada":  lambda: _info(everyone, adm),

        # ── RECRUTAMENTO (só Adm escreve, todos veem) ─────────────────
        "📥┃como-se-candidatar":  lambda: _info(everyone, adm),
        "📊┃status-candidaturas": lambda: _info(everyone, adm),
        "✅┃aprovados":           lambda: _info(everyone, adm),
        "❌┃reprovados":          lambda: _info(everyone, adm),

        # ── GERAL (todos escrevem) ─────────────────────────────────────
        "💬┃chat-geral":          lambda: _todos(everyone),
        "📸┃capturas-operacoes":  lambda: _todos(everyone),
        "🎮┃off-topic":           lambda: _todos(everyone),
        "🤣┃memes":               lambda: _todos(everyone),

        # ── OPERACIONAL (restrito por cargo) ──────────────────────────
        "📡┃comunicados-internos": lambda: _operacional([coronel, adm],          everyone),
        "📋┃escala-operacional":   lambda: _operacional([coronel, adm],          everyone),
        "🗺️┃planejamento-missoes": lambda: _operacional([coronel, cabo, adm],    everyone),
        "📝┃relatorios":           lambda: _operacional([coronel, cabo, soldado], everyone),
        "🚨┃ocorrencias":          lambda: _operacional([coronel, cabo, soldado], everyone),

        # ── FIVEM ─────────────────────────────────────────────────────
        "🔗┃ip-servidor":         lambda: _info(everyone, adm),
        "📜┃regras-rp":           lambda: _info(everyone, adm),
        "🛠️┃suporte":             lambda: _todos(everyone),

        # ── VOZ OPERACIONAL ───────────────────────────────────────────
        "🔇 Briefing Operacional": lambda: _voz([coronel, adm],          everyone),
        "🔇 Operação em Curso 1":  lambda: _voz([coronel, cabo, soldado], everyone),
        "🔇 Operação em Curso 2":  lambda: _voz([coronel, cabo, soldado], everyone),
        "🔇 Sala de Espera":       lambda: _voz_todos(everyone),

        # ── VOZ GERAL ─────────────────────────────────────────────────
        "🔊 Bate-papo Geral":     lambda: _voz_todos(everyone),
        "🔊 Off-topic":           lambda: _voz_todos(everyone),
        "🎵 Música":              lambda: _voz_todos(everyone),

        # ── ADMINISTRAÇÃO (invisível pra todos exceto Adm e Bots) ─────
        "⚙️┃logs-moderacao":      lambda: _admin(adm, bots, everyone),
        "📊┃logs-entradas-saidas": lambda: _admin(adm, bots, everyone),
        "🔧┃staff-chat":          lambda: _admin(adm, None, everyone),
    }

    # ── Funções auxiliares de permissão ───────────────────────────────

    def _info(ev, admin):
        ow = {
            ev:    discord.PermissionOverwrite(view_channel=True,  send_messages=False),
            admin: discord.PermissionOverwrite(view_channel=True,  send_messages=True),
        }
        return ow

    def _todos(ev):
        return {ev: discord.PermissionOverwrite(view_channel=True, send_messages=True)}

    def _operacional(cargos_permitidos, ev):
        ow = {ev: discord.PermissionOverwrite(view_channel=False, send_messages=False)}
        for c in cargos_permitidos:
            if c:
                ow[c] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
        return ow

    def _voz(cargos_permitidos, ev):
        ow = {ev: discord.PermissionOverwrite(view_channel=False, connect=False)}
        for c in cargos_permitidos:
            if c:
                ow[c] = discord.PermissionOverwrite(view_channel=True, connect=True, speak=True)
        return ow

    def _voz_todos(ev):
        return {ev: discord.PermissionOverwrite(view_channel=True, connect=True, speak=True)}

    def _admin(admin, bots_role, ev):
        ow = {ev: discord.PermissionOverwrite(view_channel=False)}
        if admin:
            ow[admin] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
        if bots_role:
            ow[bots_role] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
        return ow

    # ── Aplica as permissões ───────────────────────────────────────────
    for canal in guild.channels:
        if canal.name in PERMISSOES:
            try:
                overwrites = PERMISSOES[canal.name]()
                await canal.edit(overwrites=overwrites)
                print(f"   ✅ {canal.name}")
                await asyncio.sleep(0.5)
            except Exception as e:
                print(f"   ❌ Erro em '{canal.name}': {e}")

    print("\n🎉 Permissões aplicadas com sucesso!")
    await bot.close()


bot.run(TOKEN)
