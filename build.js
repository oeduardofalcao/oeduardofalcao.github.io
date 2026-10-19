const fs = require("node:fs");
const path = require("node:path");

const raiz = __dirname;

const fonte = fs.readFileSync(path.join(raiz, "js", "dados.js"), "utf8");
const dados = new Function(
  fonte + "\nreturn { PROJETOS, ESTUDOS, PERFIL, CATEGORIAS };"
)();

const { PROJETOS, ESTUDOS, PERFIL, CATEGORIAS } = dados;

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escA = (s) => esc(s).replace(/'/g, "&#39;");

const layout = ({ titulo, descricao, slugAtivo, corpo, base }) => {
  const nav = [
    ["index.html", "Início"],
    ["projetos.html", "Projetos"],
    ["estudos.html", "Estudos"],
    ["sobre.html", "Sobre"]
  ]
    .map(([h, t]) => {
      const cur = h === slugAtivo ? ' aria-current="page"' : "";
      return `<a href="${base}${h}"${cur}>${t}</a>`;
    })
    .join("\n          ");

  return `<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${escA(descricao)}">
<meta name="author" content="${escA(PERFIL.nome)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escA(titulo)}">
<meta property="og:description" content="${escA(descricao)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="${base}css/estilo.css">
<link rel="icon" type="image/svg+xml" href="${base}assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="${base}assets/favicon-32.png">
<link rel="apple-touch-icon" href="${base}assets/favicon-180.png">
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<div class="progress" aria-hidden="true"></div>

<header class="site-header">
  <nav class="nav wrap">
    <a class="brand" href="${base}index.html">${esc(PERFIL.nome)}</a>
    <div class="nav-links">
          ${nav}
    </div>
      <button class="theme-btn" type="button" aria-label="Alternar tema claro e escuro" data-theme-toggle>
        <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>
        <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
      </button>
  </nav>
</header>

<main id="conteudo">
${corpo}
</main>

<footer class="site-footer wrap">
  <span>&copy; ${new Date().getFullYear()} ${esc(PERFIL.nome)}</span>
  <span>${esc(PERFIL.cargo)} &middot; ${esc(PERFIL.cidade)}</span>
</footer>

<script src="${base}js/main.js"></script>
</body>
</html>
`;
};

const linkify = (html) =>
  html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (m, txt, url) => `<a href="${url}" target="_blank" rel="noopener">${txt}</a>`
  );

const blocoTexto = (titulo, texto) => `
<div class="block">
  <h2>${esc(titulo)}</h2>
  ${String(texto)
    .split(/\n{2,}/)
    .filter((t) => t.trim())
    .map((t) => {
      const linhas = t
        .trim()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (linhas.length && linhas.every((l) => l.startsWith("- "))) {
        return `<ul>\n    ${linhas
          .map((l) => `<li>${linkify(esc(l.slice(2).trim()))}</li>`)
          .join("\n    ")}\n  </ul>`;
      }
      return `<p>${linkify(esc(t.trim()))}</p>`;
    })
    .join("\n  ")}
</div>`;

const figPrincipal = (src, alt, leg) => `
<figure class="fig reveal">
  <img src="${src}" alt="${escA(alt)}" onerror="this.closest('.fig').classList.add('is-empty')">
  ${leg ? `<figcaption>${esc(leg)}</figcaption>` : ""}
</figure>`;

const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const VID_EXT = [".mp4", ".webm"];

const galeria = (itens, pasta, rotulo, dir) => {
  const achados = itens
    .map((n) => {
      const vid = dir && VID_EXT.find((e) => fs.existsSync(path.join(dir, n + e)));
      if (vid) return { n, ext: vid, video: true };
      const img = dir && IMG_EXT.find((e) => fs.existsSync(path.join(dir, n + e)));
      return img ? { n, ext: img, video: false } : null;
    })
    .filter(Boolean);

  if (!achados.length) return "";

  return `
<div class="gallery reveal">
${achados
  .map((x) => {
    if (x.video) {
      const posterArq =
        IMG_EXT.map((e) => x.n + e).find((f) => fs.existsSync(path.join(dir, f))) ||
        (fs.existsSync(path.join(dir, "destaque.jpg")) ? "destaque.jpg" : null);
      const poster = posterArq ? ` poster="${pasta}${posterArq}"` : "";
      return `  <a class="gal-media" href="${pasta}${x.n}${x.ext}" data-tipo="video" target="_blank" rel="noopener">
    <video src="${pasta}${x.n}${x.ext}"${poster} muted playsinline preload="metadata"></video>
    <span class="gal-play" aria-hidden="true"></span>
  </a>`;
    }
    return `  <a href="${pasta}${x.n}${x.ext}" target="_blank" rel="noopener">
    <img src="${pasta}${x.n}${x.ext}" alt="${escA(rotulo + " " + x.n)}" loading="lazy" onerror="var p=this.closest('.gallery');this.replaceWith(Object.assign(document.createElement('div'),{className:'ph',textContent:'${rotulo} ${x.n}'}))">
  </a>`;
  })
  .join("\n")}
</div>`;
};

function svgPlaceholder(slug, titulo, num, etiqueta) {
  const dir = path.join(raiz, "assets", etiqueta === "Estudo" ? "estudos" : "projetos", slug);
  fs.mkdirSync(dir, { recursive: true });
  const base = "assets/" + (etiqueta === "Estudo" ? "estudos" : "projetos") + "/" + slug + "/";
  for (const f of ["destaque.jpg", "capa.jpg"]) {
    if (fs.existsSync(path.join(dir, f))) return base + f;
  }
  const t = titulo.length > 34 ? titulo.slice(0, 33) + "\u2026" : titulo;
  const linhas = t.split(" ").reduce((acc, p, i, arr) => {
    const atual = acc[acc.length - 1];
    if (!atual || (atual + " " + p).length > 17) acc.push(p);
    else acc[acc.length - 1] = atual + " " + p;
    return acc;
  }, []);
  const y0 = 250 - (linhas.length - 1) * 26;
  const txt = linhas
    .map((l, i) => `<tspan x="70" y="${y0 + i * 52}">${esc(l)}</tspan>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 750" width="1000" height="750" role="img">
<rect width="1000" height="750" fill="#141418"/>
<rect x="70" y="70" width="62" height="10" fill="#00aeff"/>
<text x="70" y="140" fill="#8f8f99" font-family="Helvetica,Arial,sans-serif" font-size="26" letter-spacing="6">${esc(num)}</text>
<text x="70" y="${y0}" fill="#f2f1ee" font-family="Georgia,serif" font-size="60">${txt}</text>
<text x="70" y="660" fill="#8f8f99" font-family="Helvetica,Arial,sans-serif" font-size="24" letter-spacing="4">SUBSTITUIR PELA CAPA REAL</text>
</svg>`;
  fs.writeFileSync(path.join(dir, "capa.svg"), svg, "utf8");
  return base + "capa.svg";
}

const figurasProj = ["destaque", "processo-01", "processo-02", "entrega-01", "entrega-02", "entrega-03"];
const figurasEst = ["capa", "processo-01", "processo-02", "processo-03", "entrega-01"];

PROJETOS.forEach((p, i) => {
  p.capaFinal = svgPlaceholder(p.slug, p.titulo, String(i + 1).padStart(2, "0"), "Projeto");
});

ESTUDOS.forEach((e, i) => {
  e.capaFinal = svgPlaceholder(e.slug, e.titulo, String(i + 1).padStart(2, "0"), "Estudo");
});

const escrever = (rel, conteudo) => {
  const destino = path.join(raiz, rel);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, conteudo, "utf8");
};

const cards = (lista, base, dir) =>
  lista
    .map(
      (item, i) => `      <a class="card reveal" href="${base}${dir}${item.slug}.html"${item.categoria ? ` data-cat="${escA(item.categoria)}"` : ""}>
        <div class="card-media">
          <span class="card-index">${String(i + 1).padStart(2, "0")}</span>
          ${item.categoria ? `<span class="card-tag">${esc(item.categoria)}</span>` : ""}
          <img src="${base}${item.capaFinal}" alt="" loading="lazy"${item.capaPos ? ` style="object-position:${item.capaPos}"` : ""}>
        </div>
        <div class="card-body">
          <div class="card-head">
            <h3>${esc(item.titulo)}</h3>
            <span class="card-year">${esc(item.ano)}</span>
          </div>
          <p>${esc(item.resumo)}</p>
        </div>
      </a>`
    )
    .join("\n");

const destaque = PROJETOS.filter((p) => p.destaque !== false);

const hero = `
  <section class="hero">
    <div class="wrap hero-grid">
      <p class="eyebrow reveal">${esc(PERFIL.cargo)} &middot; ${esc(PERFIL.cidade)}</p>
      <h1 class="reveal">Design que vai do <em>rascunho</em> à peça impressa.</h1>
      <p class="lead reveal">${esc(PERFIL.bio)}</p>
    </div>
    <div class="wrap">
      <div class="hero-meta">
        <span><b>50+</b> projetos</span>
        <span><b>Agências</b> e órgãos públicos</span>
        <span><b>3+ anos</b> de experiência</span>
        <span>Disponível para <b>projetos e vagas</b></span>
      </div>
    </div>
  </section>`;

escrever(
  "index.html",
  layout({
    titulo: "Eduardo Falcão - Designer de Comunicação",
    descricao:
      "Portfólio de Eduardo Falcão, designer de comunicação em Porto Alegre: identidades visuais, peças impressas, design editorial e campanhas.",
    slugAtivo: "index.html",
    base: "",
    corpo: `${hero}
  <div class="ticker" aria-hidden="true">
    <div class="ticker-track">
      ${["Identidade visual", "Peças impressas", "Design editorial", "Redes sociais", "Sinalização", "Adobe", "Figma", "Campanhas"]
        .concat(["Identidade visual", "Peças impressas", "Design editorial", "Redes sociais", "Sinalização", "Adobe", "Figma", "Campanhas"])
        .map((p) => `<span>${esc(p)}</span>`)
        .join("\n      ")}
    </div>
  </div>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <h2 class="reveal">Projetos selecionados</h2>
        <a class="eyebrow" href="projetos.html">Ver todos</a>
      </div>
      <div class="grid">
${cards(destaque.slice(0, 4), "", "projetos/")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <h2 class="reveal">Estudos e exercícios</h2>
        <a class="eyebrow" href="estudos.html">Ver todos</a>
      </div>
      <div class="grid study-grid">
${cards(ESTUDOS.slice(0, 4), "", "estudos/")}
      </div>
    </div>
  </section>

  <section class="contact">
    <div class="wrap">
      <h2 class="reveal">Vamos conversar sobre o seu projeto.</h2>
      <div class="contact-list reveal" data-contact></div>
    </div>
  </section>`
  })
);

escrever(
  "projetos.html",
  layout({
    titulo: "Projetos — Eduardo Falcão",
    descricao:
      "Todos os projetos de design de comunicação de Eduardo Falcão: identidade, institucional, editorial e informação.",
    slugAtivo: "projetos.html",
    base: "",
    corpo: `  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <h2 class="reveal">Projetos</h2>
        <p class="lead reveal">Trabalho entregue para clientes, órgãos públicos e projetos coletivos.</p>
      </div>
      <div class="filters reveal" data-filters>
        ${CATEGORIAS.map((c, i) => `<button class="filter" type="button" data-cat="${escA(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join("\n        ")}
      </div>
      <div class="grid" data-grid>
${cards(PROJETOS, "", "projetos/")}
      </div>
    </div>
  </section>`
  })
);

escrever(
  "estudos.html",
  layout({
    titulo: "Estudos — Eduardo Falcão",
    descricao:
      "Estudos tipográficos, pôsteres e capa mostrando processo e experimentação em design.",
    slugAtivo: "estudos.html",
    base: "",
    corpo: `  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <h2 class="reveal">Estudos</h2>
        <p class="lead reveal">Exercícios de sala de aula, homenagem e experimentação. Mostram processo, não entregável.</p>
      </div>
      <div class="grid study-grid">
${cards(ESTUDOS, "", "estudos/")}
      </div>
    </div>
  </section>`
  })
);

const sobre = `
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <h2 class="reveal">Sobre</h2>
      </div>
      <div class="about">
        <div class="reveal">
          <h2 class="display">Designer que faz a peça e entende o porquê dela.</h2>
          <div class="prose">
            <p>${esc(PERFIL.bio)}</p>
          </div>
        </div>
        <div class="reveal">
          <div class="block" style="margin-top:0">
            <h2>Ferramentas</h2>
            <div class="skills">
              ${PERFIL.ferramentas.map((f) => `<span class="chip">${esc(f)}</span>`).join("\n              ")}
            </div>
          </div>
          <div class="block">
            <h2>Práticas</h2>
            <div class="skills">
              ${PERFIL.praticas.map((f) => `<span class="chip is-on">${esc(f)}</span>`).join("\n              ")}
            </div>
          </div>
          <div class="block">
            <h2>Traços</h2>
            <div class="skills">
              ${PERFIL.tracos.map((f) => `<span class="chip">${esc(f)}</span>`).join("\n              ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head"><h2 class="reveal">Experiência</h2></div>
      <div class="timeline">
        ${PERFIL.experiencia
          .map(
            (e) => `        <div class="tl-item">
          <div class="tl-when">${esc(e.quando)}</div>
          <div class="tl-what">
            <strong>${esc(e.cargo)}</strong>
            <span>${esc(e.org)}</span>
            <p style="margin-top:.4rem">${esc(e.nota)}</p>
          </div>
        </div>`
          )
          .join("\n        ")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head"><h2 class="reveal">Formação</h2></div>
      <div class="timeline">
        ${PERFIL.formacao
          .map(
            (e) => `        <div class="tl-item">
          <div class="tl-when">${esc(e.quando)}</div>
          <div class="tl-what">
            <strong>${esc(e.cargo)}</strong>
            <span>${esc(e.org)}</span>
            <p style="margin-top:.4rem">${esc(e.nota)}</p>
          </div>
        </div>`
          )
          .join("\n        ")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head"><h2 class="reveal">Idiomas</h2></div>
      <div class="languages">
        ${PERFIL.idiomas.map(([n, v]) => `<div><strong>${esc(n)}</strong> <span class="lang-level">&mdash; ${esc(v)}</span></div>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="contact">
    <div class="wrap">
      <h2 class="reveal">Contato</h2>
      <div class="contact-list reveal" data-contact></div>
    </div>
  </section>`;

escrever(
  "sobre.html",
  layout({
    titulo: "Sobre — Eduardo Falcão",
    descricao:
      "Formação, experiência, ferramentas e como falar com Eduardo Falcão, designer de comunicação em Porto Alegre.",
    slugAtivo: "sobre.html",
    base: "",
    corpo: sobre
  })
);

const ordem = PROJETOS.concat(ESTUDOS);

ordem.forEach((item) => {
  const eEstud = ESTUDOS.includes(item);
  const lista = eEstud ? ESTUDOS : PROJETOS;
  const i = lista.indexOf(item);
  const baseDir = "../";
  const pastaRaiz = "assets/" + (eEstud ? "estudos/" : "projetos/") + item.slug + "/";
  const pasta = baseDir + pastaRaiz;
  const ant = lista[(i - 1 + lista.length) % lista.length];
  const prox = lista[(i + 1) % lista.length];
  const dirLista = baseDir + (eEstud ? "estudos/" : "projetos/");
  const rel = (eEstud ? "estudos/" : "projetos/") + item.slug + ".html";
  const capaAbs = baseDir + item.capaFinal;
  const capaLeg = capaAbs.endsWith("capa.svg") ? "Capa do projeto — substituir pelo arquivo real." : "";

  const fatos = (
    eEstud
      ? [
          ["Tipo", "Estudo pessoal"],
          ["Ano", item.ano]
        ]
      : [
          ["Cliente", item.cliente],
          ["Período", item.periodo],
          ["Categoria", item.categoria],
          ["Ano", item.ano],
          ["Meu papel", item.papel],
          ["Equipe", item.equipe]
        ]
  ).filter(([, v]) => v && String(v).trim());

  const papelCorpo = item.papelTexto || item.papel;

  const corpo = `  <section class="proj-hero">
    <div class="wrap">
      <a class="eyebrow reveal" href="${baseDir}${eEstud ? "estudos.html" : "projetos.html"}">${eEstud ? "Estudos" : "Projetos"}</a>
      <h1 class="display reveal">${esc(item.titulo)}</h1>
      <p class="lead reveal">${esc(item.resumo)}</p>
      <dl class="proj-facts reveal">
        ${fatos
          .map(
            ([k, v]) => `        <div class="fact">
          <dt>${esc(k)}</dt>
          <dd>${esc(v)}</dd>
        </div>`
          )
          .join("\n        ")}
      </dl>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
${figPrincipal(capaAbs, item.titulo, capaLeg)}
${
  eEstud
    ? blocoTexto(
        "Sobre este estudo",
        item.sobre ||
          "TODO: escrever de 3 a 4 frases sobre a intenção do estudo, o que você experimentou e o que aprendeu. Estudos valem mais quando você mostra raciocínio, não só resultado."
      )
    : blocoTexto("Contexto", item.resumo) +
      blocoTexto(
        "Meu papel no projeto",
        /[.!?]$/.test(papelCorpo) ? papelCorpo : papelCorpo + "."
      ) +
      blocoTexto("Processo", item.processo) +
      blocoTexto("Entregáveis", item.entregas) +
      blocoTexto("Resultado", item.resultado)
}
${galeria(item.figuras || (eEstud ? figurasEst : figurasProj), pasta, eEstud ? "estudo" : "peça", path.join(raiz, pastaRaiz))}

  <div class="next-nav">
    <a class="next-link reveal" href="${dirLista}${ant.slug}.html">
      <small>Anterior</small>
      <strong>${esc(ant.titulo)}</strong>
    </a>
    <a class="next-link reveal" href="${dirLista}${prox.slug}.html">
      <small>Próximo</small>
      <strong>${esc(prox.titulo)}</strong>
    </a>
  </div>
    </div>
  </section>`;

  escrever(
    rel,
    layout({
      titulo: item.titulo + " — Eduardo Falcão",
      descricao: item.resumo,
      slugAtivo: eEstud ? "estudos.html" : "projetos.html",
      base: "../",
      corpo
    })
  );
});

console.log("Gerados:");
console.log("  index.html, projetos.html, estudos.html, sobre.html");
ordem.forEach((i) => {
  console.log("  " + (ESTUDOS.includes(i) ? "estudos/" : "projetos/") + i.slug + ".html");
});
console.log("Total de paginas: " + (4 + ordem.length));