(function () {
  var root = document.documentElement;

  function lerTema(t) {
    root.setAttribute("data-theme", t);
    try {
      localStorage.setItem("tema", t);
    } catch (e) {}
  }

  try {
    var salvo = localStorage.getItem("tema");
    if (!salvo) {
      salvo = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    root.setAttribute("data-theme", salvo);
  } catch (e) {
    root.setAttribute("data-theme", "dark");
  }

  var botao = document.querySelector("[data-theme-toggle]");
  if (botao) {
    botao.addEventListener("click", function () {
      lerTema(root.getAttribute("data-theme") === "light" ? "dark" : "light");
      botao.blur();
    });
  }

  var header = document.querySelector(".site-header");
  var barra = document.querySelector(".progress");
  var travado = false;

  function aoRolar() {
    if (header && !travado) header.classList.toggle("is-stuck", window.scrollY > 12);
    if (barra) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    }
  }

  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  function revelar() {
    var alvos = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      alvos.forEach(function (e) {
        e.classList.add("is-in");
      });
      return;
    }
    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
    );
    alvos.forEach(function (e) {
      obs.observe(e);
    });
  }

  revelar();

  var filtro = document.querySelector("[data-filters]");
  var grade = document.querySelector("[data-grid]");

  if (filtro && grade) {
    var botoes = filtro.querySelectorAll(".filter");
    botoes.forEach(function (b) {
      b.addEventListener("click", function () {
        botoes.forEach(function (o) {
          o.setAttribute("aria-pressed", String(o === b));
        });
        var cat = b.getAttribute("data-cat");
        var cards = grade.querySelectorAll(".card");
        cards.forEach(function (c, i) {
          var visivel = cat === "Todos" || c.getAttribute("data-cat") === cat;
          c.style.display = visivel ? "" : "none";
          if (visivel) {
            c.style.animation = "none";
            void c.offsetWidth;
            c.style.animation = "";
            c.classList.add("is-in");
          }
        });
      });
    });
  }

  var contato = document.querySelectorAll("[data-contact]");
  var PERFIL_CONTATO = {
    email: "eduardofalcao.teixeira@gmail.com",
    whatsapp: "5551997247520",
    linkedin: "https://www.linkedin.com/in/oeduardofalcao",
    behance: "https://www.behance.net/oeduardofalcao"
  };

  contato.forEach(function (alvo) {
    [
      ["mailto:" + PERFIL_CONTATO.email, "eduardofalcao.teixeira@gmail.com"],
      ["https://wa.me/" + PERFIL_CONTATO.whatsapp, "WhatsApp"],
      [PERFIL_CONTATO.linkedin, "LinkedIn"],
      [PERFIL_CONTATO.behance, "Behance"]
    ].forEach(function (par) {
      var a = document.createElement("a");
      a.href = par[0];
      a.textContent = par[1];
      if (par[0].indexOf("mailto:") !== 0) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      alvo.appendChild(a);
    });
  });

  var galerias = document.querySelectorAll(".gallery");
  if (galerias.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Visualizador de mídia");
    lb.hidden = true;
    lb.innerHTML =
      '<button class="lb-btn lb-close" type="button" aria-label="Fechar">&#215;</button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Anterior">&#8249;</button>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Próximo">&#8250;</button>' +
      '<div class="lb-stage"></div>' +
      '<div class="lb-count" aria-hidden="true"></div>';
    document.body.appendChild(lb);

    var stage = lb.querySelector(".lb-stage");
    var contador = lb.querySelector(".lb-count");
    var itens = [];
    var atual = 0;
    var ultimoFoco = null;

    function dadosDoLink(a) {
      var img = a.querySelector("img");
      return {
        src: a.getAttribute("href"),
        tipo: a.querySelector("video") ? "video" : "imagem",
        alt: img ? img.getAttribute("alt") : ""
      };
    }

    function linksValidos(g) {
      return Array.prototype.slice
        .call(g.querySelectorAll("a"))
        .filter(function (a) {
          return a.querySelector("img, video");
        });
    }

    function render() {
      var it = itens[atual];
      stage.innerHTML = "";
      if (it.tipo === "video") {
        var v = document.createElement("video");
        v.src = it.src;
        v.controls = true;
        v.autoplay = true;
        v.setAttribute("playsinline", "");
        v.setAttribute("controlsList", "nodownload");
        stage.appendChild(v);
      } else {
        var img = document.createElement("img");
        img.src = it.src;
        img.alt = it.alt || "";
        stage.appendChild(img);
      }
      contador.textContent = itens.length > 1 ? atual + 1 + " / " + itens.length : "";
      lb.classList.toggle("is-solo", itens.length < 2);
    }

    function abrir(lista, idx) {
      itens = lista;
      atual = idx;
      ultimoFoco = document.activeElement;
      render();
      lb.hidden = false;
      document.documentElement.classList.add("lb-open");
      lb.querySelector(".lb-close").focus();
    }

    function fechar() {
      lb.hidden = true;
      stage.innerHTML = "";
      document.documentElement.classList.remove("lb-open");
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    function navegar(passo) {
      if (itens.length < 2) return;
      atual = (atual + passo + itens.length) % itens.length;
      render();
    }

    galerias.forEach(function (g) {
      g.addEventListener("click", function (ev) {
        var a = ev.target.closest ? ev.target.closest("a") : null;
        if (!a || !g.contains(a)) return;
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
        if (!a.querySelector("img, video")) return;
        var validos = linksValidos(g);
        var idx = validos.indexOf(a);
        if (idx < 0) return;
        ev.preventDefault();
        abrir(validos.map(dadosDoLink), idx);
      });
    });

    lb.querySelector(".lb-close").addEventListener("click", fechar);
    lb.querySelector(".lb-prev").addEventListener("click", function () {
      navegar(-1);
    });
    lb.querySelector(".lb-next").addEventListener("click", function () {
      navegar(1);
    });
    lb.addEventListener("click", function (ev) {
      if (ev.target === lb || ev.target === stage) fechar();
    });
    document.addEventListener("keydown", function (ev) {
      if (lb.hidden) return;
      if (ev.key === "Escape") fechar();
      else if (ev.key === "ArrowLeft") navegar(-1);
      else if (ev.key === "ArrowRight") navegar(1);
    });
  }
})();