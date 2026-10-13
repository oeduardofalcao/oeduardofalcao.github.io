const fs = require("fs");
const path = require("path");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const resumo = JSON.parse(fs.readFileSync("_behance/resumo.json", "utf8"));

const ALVOS = {
  "cartao-do-processo": ["assets/projetos/cartao-do-processo/destaque.jpg"],
  "coletanea-industria-criativa": ["assets/projetos/coletanea-industria-criativa/destaque.jpg"],
  "garibaldi-rotas": ["assets/projetos/garibaldi-rotas/destaque.jpg"],
  "zule": ["assets/estudos/zule/capa.jpg"],
  "mizuno-poster": ["assets/estudos/mizuno-poster/capa.jpg"],
  "whisper-capa": ["assets/estudos/whisper-capa/capa.jpg"],
  "mendini-stencil": ["assets/estudos/mendini-stencil/capa.jpg"],
  "letter-gothic": ["assets/estudos/letter-gothic/capa.jpg"]
};

(async () => {
  for (const [slug, dests] of Object.entries(ALVOS)) {
    const info = resumo[slug];
    if (!info || !info.imgs.length) { console.log("SEM IMG:", slug); continue; }
    const src = info.imgs[info.imgs.length - 1].replace(/\/projects\/[^/]+\//, "/projects/original/");
    try {
      const r = await fetch(src, { headers: { "user-agent": UA } });
      if (!r.ok) { console.log("FALHA", slug, r.status, src); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      const tipo = r.headers.get("content-type");
      for (const d of dests) {
        fs.mkdirSync(path.dirname(d), { recursive: true });
        fs.writeFileSync(d, buf);
      }
      console.log("OK", slug.padEnd(30), (buf.length / 1024).toFixed(0) + "KB", tipo, "->", dests.join(", "));
    } catch (e) { console.log("ERRO", slug, e.message); }
    await new Promise((res) => setTimeout(res, 700));
  }
})();