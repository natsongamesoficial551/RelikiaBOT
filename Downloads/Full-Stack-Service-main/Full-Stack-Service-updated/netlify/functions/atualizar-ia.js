// netlify/functions/atualizar-ia.js
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  console.log("🚀 Iniciando atualização completa IA + Site + GitHub");

  const auth = event.headers.authorization?.replace("Bearer ", "");
  if (!auth || auth !== process.env.WEBHOOK_SECRET) {
    console.log("❌ Token inválido");
    return { statusCode: 401, body: "Não autorizado" };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
  );

  const siteURL = "https://natansites.com.br";
  const githubRoot = "https://api.github.com/repos/natsongamesoficial551/Full-Stack-Service/contents";

  const pages = [
    "/", "/index.html", "/home.html", "/login.html", "/contato.html",
    "/suporte.html", "/planos.html", "/dashboard.html",
    "/promocao_relampago.html", "/websites.html"
  ];

  async function saveSiteContent(page, section, content, url) {
    try {
      await supabase.from("site_content").upsert({
        page_name: page,
        section,
        content: content.slice(0, 20000),
        source_url: url,
        scraped_at: new Date().toISOString()
      });
      console.log("✅ site_content salvo:", page);
    } catch {}
  }

  async function savePlataformaInfo(secao, dados) {
    try {
      await supabase.from("plataforma_info").upsert({
        secao,
        dados,
        atualizado_em: new Date().toISOString()
      });
      console.log(`✅ plataforma_info: ${secao}`);
    } catch {}
  }

  // ✅ NOVO → salva memória IA automática
  async function saveIAMemoria(texto, origem) {
    try {
      await supabase.from("ia_memoria").insert({
        texto: texto.slice(0, 500),
        origem,
        criado_em: new Date()
      });
      console.log("✅ ia_memoria registrada");
    } catch {}
  }

  async function scrapePage(path) {
  const url = siteURL + path;
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const text = $("body").text().replace(/\s+/g, " ").trim();

    await saveSiteContent(path, "body", text, url);

    // planos
    const planos = [];
    $(".plan, .pricing-card, .plano-card").each((i, el) => {
      planos.push({
        nome: $(el).find("h2, h3").first().text().trim(),
        preco: $(el).find(".price, .preco").first().text().trim()
      });
    });
    if (planos.length) await savePlataformaInfo("planos", { planos });

    // 🆕 PROMO - AUMENTA LIMITE PARA 5000 CARACTERES
    if (text.match(/promo|desconto|relâmpago|relampago/i)) {
      await savePlataformaInfo("promocoes", { 
        texto: text.slice(0, 5000),  // ✅ Aumentado de 500 para 5000
        url 
      });
    }

    // contato
    const wa = $('a[href*="wa.me"],a[href*="whatsapp"]').first().attr("href");
    const mail = $('a[href^="mailto:"]').first().attr("href");
    if (wa || mail) await savePlataformaInfo("contato", { whatsapp: wa, email: mail });

    // memória IA interna
    await saveIAMemoria(`Mudanças detectadas na página ${path}`, "scraper");

    console.log("📄 Página OK →", path);
  } catch (e) { 
    console.log("⚠️ Página falhou:", path); 
  }
}

  async function fetchGitHubDir(url, prefix="") {
    try {
      const res = await fetch(url);
      const files = await res.json();

      for (const file of files) {
        if (file.type === "file" && file.name.match(/\.(html|js|md|json)$/)) {
          const raw = await fetch(file.download_url);
          const text = await raw.text();

          await supabase.from("repo_content").upsert({
            file_path: prefix + file.name,
            content: text,
            updated_at: new Date()
          });

          await saveIAMemoria(`Arquivo atualizado: ${file.name}`, "github");
          console.log("📦 GitHub import:", prefix + file.name);
        }

        if (file.type === "dir") {
          await fetchGitHubDir(file.url, file.path + "/");
        }
      }
    } catch {}
  }

  for (const p of pages) await scrapePage(p);
  await fetchGitHubDir(githubRoot);

  console.log("✨ Atualização 100% concluída");
  return { statusCode: 200, body: "✅ IA atualizada com sucesso" };
};
