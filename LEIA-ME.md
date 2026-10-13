# Portfólio — Eduardo Falcão

Site estático, sem dependências, publicado no GitHub Pages.

## Estrutura

```
portfolio/
  index.html                  home
  projetos.html               listagem de projetos, com filtro por categoria
  estudos.html                listagem de estudos
  sobre.html                  perfil, experiência, formação, contato
  projetos/<slug>.html        página de cada projeto
  estudos/<slug>.html          página de cada estudo
  css/estilo.css              todo o design
  js/main.js                  tema, animação de entrada, filtro
  js/dados.js                 TODO o texto do site
  build.js                    gerador: lê dados.js e escreve os HTMLs
  assets/
    projetos/<slug>/capa.svg  capa substituta
    assets/projetos/<slug>/   imagens reais do projeto
```

## Os dois jeitos de editar

### Editar direto no HTML

Abra qualquer `.html` com o Bloco de Notas ou o VS Code e altere o texto. É o jeito
mais simples, e o resultado aparece ao recarregar o navegador.

### Editar pelo gerador

Se você quiser mudar muitos textos de uma vez, edite `js/dados.js` e rode:

```
node build.js
```

Isso reescreve todos os HTMLs e recria as capas substitutas. O `dados.js` é a fonte da
verdade: os textos que você escrever direto no HTML serão apagados na próxima vez que
rodar o gerador.

Para o dia a dia, prefira editar o HTML direto. Use o gerador só quando estiver adicionando
ou renomeando projetos.

## Adicionar uma imagem

Nomeie os arquivos assim dentro de `assets/projetos/<slug>/`:

| Arquivo | Para que serve |
|---|---|
| `capa.jpg` | imagem grande do topo da página e miniatura nos cards |
| `destaque.jpg` | segunda imagem, em largura total |
| `processo-01.jpg`, `processo-02.jpg` | etapas do processo |
| `entrega-01.jpg` ... `entrega-03.jpg` | as peças finais |

Enquanto um arquivo não existe, o site mostra um bloco tracejado com o nome no lugar dele.
Nada quebra.

Use JPEG de até 2000px de largura e cerca de 80% de qualidade. Para o site inteiro, 1 MB
já é razoável; acima disso, comprima em [tinypng.com](https://tinypng.com).

Enquanto `capa.jpg` não existir, o site usa o `capa.svg` gerado, que mostra o nome do
projeto num fundo escuro. Serve como placeholder, mas não como capa definitiva.

## Ajustar o design

Tudo visual está em `css/estilo.css`, no bloco `:root` do começo do arquivo. As variáveis
que importam:

```css
--bg       fundo
--text     cor do texto
--accent   cor de destaque
--font-display   fonte dos títulos
--font-sans      fonte do texto
```

Trocar a identidade visual do site inteiro é mudar quatro linhas. Para um tema claro, o
botão no canto superior direito alterna na hora e a escolha fica salva no navegador.

## Publicar no GitHub Pages

1. Crie uma conta em [github.com](https://github.com)
2. Crie um repositório chamado `portfolio` e deixe ele **público**
3. No terminal, dentro desta pasta:

```
git init
git add .
git commit -m "portfolio"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/portfolio.git
git push -u origin main
```

4. No repositório, vá em **Settings > Pages**, em *Source* escolha **main** e a pasta
   **/ (root)**, e salve
5. Em meio minuto o site fica no ar em:

```
https://SEU_USUARIO.github.io/portfolio/
```

O endereço `github.io/portfolio` funciona, mas fica melhor com domínio próprio. Um `.com.br`
custa de R$ 40 a R$ 60 por ano. Depois de publicar, configure o domínio em **Settings >
Pages > Custom domain**.

## Antes de mandar para qualquer vaga

- [ ] Substituir todas as capas `.svg` por imagens reais
- [ ] Preencher todos os textos marcados como `TODO` no `js/dados.js`
- [ ] Passar o leitor de tela no celular
- [ ] Testar em Firefox e Safari, não só no Chrome

Os `TODO` estão concentrados em `js/dados.js`. Para achar todos:

```
Select-String -Path js\dados.js -Pattern TODO
```