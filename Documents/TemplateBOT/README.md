# 🤖 RELIKIABOT — FiveM RP

Bot oficial do BOPE para Discord. Gerencia tickets, candidaturas, cargos e moderação com embeds e botões.

---

## 📦 Instalação

```bash
npm install
```

---

## ⚙️ Configuração

1. Copie o arquivo `.env.example` e renomeie para `.env`
2. Preencha os valores:

```env
TOKEN=token_do_seu_bot
CLIENT_ID=id_do_seu_bot
GUILD_ID=id_do_seu_servidor
```

**Como obter cada valor:**
- `TOKEN` → Discord Developer Portal → seu app → Bot → Reset Token
- `CLIENT_ID` → Discord Developer Portal → seu app → General Information → Application ID
- `GUILD_ID` → Discord com Modo Desenvolvedor ativado → clique direito no servidor → Copiar ID

---

## 🚀 Como rodar

**1. Registrar os comandos slash (só precisa rodar uma vez):**
```bash
node deploy-commands.js
```

**2. Iniciar o bot:**
```bash
node index.js
```

---

## ☁️ Deploy no Railway (recomendado — grátis)

1. Suba o projeto no **GitHub**
2. Acesse [railway.app](https://railway.app) e faça login
3. Clique em **New Project → Deploy from GitHub Repo**
4. Selecione o repositório
5. Vá em **Variables** e adicione as 3 variáveis do `.env`
6. O bot sobe automaticamente e fica **online 24/7**

---

## 📋 Funcionalidades

### Automático ao iniciar
- Posta embeds atualizadas nos canais: regras, sobre, requisitos, ip, suporte, candidatura

### Botões (qualquer membro)
- **Abrir Ticket** → canal privado com admin
- **Me Candidatar** → canal privado com perguntas

### Botões (apenas Admin)
- **Aprovar candidatura** → dá cargo Soldado + avisa no canal + DM pro usuário
- **Reprovar candidatura** → avisa no canal + DM pro usuário
- **Resolver/Fechar ticket** → fecha o canal

### Comandos Slash (apenas no canal staff-chat)
| Comando | Função |
|---|---|
| `/promover @user cargo` | Promove para Cabo ou Coronel |
| `/rebaixar @user` | Remove cargos BOPE |
| `/kick @user motivo` | Expulsa do servidor |
| `/ban @user motivo` | Bane do servidor |
| `/aviso @user motivo` | DM de aviso |
| `/limpar quantidade` | Apaga mensagens |
| `/perfil @user` | Info do membro |
| `/status` | Estatísticas do servidor |
| `/ping` | Latência do bot |
