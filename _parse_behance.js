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

const out = {};
for (const l of LINKS) {
  const file = path.join("_behance", l.id + ".html");
  const s = fs.readFileSync(file, "utf8");

  const title = (s.match(/<meta property="og:title" content="([^"]+)"/) || [])[1] ||
                (s.match(/<title>([^<]+)<\/title>/) || [])[1] || "";
  const descMeta = (s.match(/<meta name="description" content="([^"]+)"/) || [])[1] ||
                   (s.match(/<meta property="og:description" content="([^"]+)"/) || [])[1] || "";

  // imagens do CDN behance (unescape JSON)
  const raw = (s.match(/https?:\\?\/\\?\/mir-s3-cdn-cf\.behance\.net[^"'\\\s]+?\.(?:jpg|jpeg|png)/g) || [])
    .map((u) => u.replaceAll("\\/", "/"));
  const imgs = [...new Set(raw)];
  // tenta descobrir a ordem original (projeto modules) mantendo primeira ocorrência
  const order = [];
  for (const m of s.matchAll(/https?:\\?\/\\?\/mir-s3-cdn-cf\.behance\.net[^"'\\\s]+?\.(?:jpg|jpeg|png)/g)) {
    const u = m[0].replaceAll("\\/", "/");
    if (!order.includes(u)) order.push(u);
  }

  // descricao longa dentro do JSON embutido
  let descLonga = "";
  const cand = [];
  for (const m of s.matchAll(/"description\\?"\s*:\s*\\?"([^"\\]{60,})/g)) cand.push(m[1]);
  for (const m of s.matchAll(/"description"\s*:\s*"((?:[^"\\]|\\.){60,})"/g)) cand.push(m[1]);
  if (cand.length) descLonga = cand.sort((a, b) => b.length - a.length)[0].replace(/\\n/g, "\n").replace(/\\"/g, '"');

  out[l.slug] = {
    id: l.id,
    nome: l.nome,
    tipo: l.tipo,
    tituloBehance: title.replace(/ - Eduardo Falc\u00e3o$/, ""),
    descMeta,
    descLonga: descLonga.slice(0, 3000),
    nImgs: imgs.length,
    imgs: order
  };
}
fs.writeFileSync("_behance/resumo.json", JSON.stringify(out, null, 2), "utf8");
for (const [k, v] of Object.entries(out)) {
  console.log("== " + k + " (" + v.tipo + ") :: " + v.tituloBehance);
  console.log("   meta: " + v.descMeta.slice(0, 200));
  console.log("   longa(" + v.descLonga.length + "): " + v.descLonga.slice(0, 300).replace(/\n/g, " / "));
  console.log("   imgs: " + v.nImgs);
  v.imgs.slice(0, 8).forEach((u) => console.log("     " + u.slice(0, 140)));
}