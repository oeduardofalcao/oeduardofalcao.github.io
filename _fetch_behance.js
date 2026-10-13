const fs = require("fs");
const path = require("path");

const LINKS = [
  { id: "249590061", nome: "Cartao do Processo", tipo: "projeto", slug: "cartao-do-processo" },
  { id: "240153603", nome: "ZULE", tipo: "estudo", slug: "zule" },
  { id: "239638583", nome: "Mizuno", tipo: "estudo", slug: "mizuno-poster" },
  { id: "235680153", nome: "Coletanea (capa de livro)", tipo: "projeto", slug: "coletanea-industria-criativa" },
  { id: "231760855", nome: "Whisper (capa revista)", tipo: "estudo", slug: "whisper-capa" },
  { id: "224049099", nome: "Stencil", tipo: "estudo", slug: "mendini-stencil" },
  { id: "223997603", nome: "Garibaldi", tipo: "projeto", slug: "garibaldi-rotas" },
  { id: "223999063", nome: "Letter Gothic", tipo: "estudo", slug: "letter-gothic" }
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

fs.mkdirSync("_behance", { recursive: true });

(async () => {
  for (const l of LINKS) {
    const file = path.join("_behance", l.id + ".html");
    if (fs.existsSync(file) && fs.statSync(file).size > 5000) {
      console.log("cache:", l.nome);
      continue;
    }
    try {
      const r = await fetch("https://www.behance.net/embed/project/" + l.id + "?ilo0=1", {
        headers: { "user-agent": UA, "accept-language": "pt-BR,pt;q=0.9,en;q=0.8" }
      });
      const t = await r.text();
      fs.writeFileSync(file, t, "utf8");
      console.log(r.status, l.nome, t.length);
    } catch (e) {
      console.log("ERRO", l.nome, e.message);
    }
    await new Promise((res) => setTimeout(res, 1200));
  }
})();