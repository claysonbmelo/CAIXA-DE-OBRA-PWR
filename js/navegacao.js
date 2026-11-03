
// =========================================
// NAVEGAÇÃO DO MENU LATERAL
// =========================================

export function inicializarNavegacao() {

    const menu = document.querySelector("#menu-lateral");
    const botaoAbrir = document.querySelector("#menu-toggle");
    const botaoFechar = document.querySelector("#fechar-menu");

    // =========================================
    // 1. ABRIR E FECHAR O MENU LATERAL
    // =========================================

    function abrirMenu() {
        menu.classList.add("aberta");
        botaoFechar.classList.add("visivel");

        botaoAbrir.setAttribute("aria-expanded", "true");
        botaoAbrir.setAttribute("aria-label", "Fechar menu");
    }

    function fecharMenu() {
        menu.classList.remove("aberta");
        botaoFechar.classList.remove("visivel");

        botaoAbrir.setAttribute("aria-expanded", "false");
        botaoAbrir.setAttribute("aria-label", "Abrir menu");
    }

    // Clique no botão hambúrguer
    botaoAbrir.addEventListener("click", () => {

        if (menu.classList.contains("aberta")) {
            fecharMenu();
        } else {
            abrirMenu();
        }

    });

    // Clique fora do menu
    botaoFechar.addEventListener("click", fecharMenu);

    // =========================================
    // 2. ABRIR E FECHAR SUBMENUS
    // =========================================

    const botoesExpansiveis = menu.querySelectorAll(".menu-expansivel");

    botoesExpansiveis.forEach(botao => {

        botao.addEventListener("click", () => {

            // Verifica se o submenu está aberto
            const estaAberto = botao.getAttribute("aria-expanded") === "true";

            // Inverte o estado do botão
            botao.setAttribute("aria-expanded", String(!estaAberto));

            // Localiza o submenu controlado pelo botão
            const idSubmenu = botao.getAttribute("aria-controls");
            const submenu = document.getElementById(idSubmenu);

            // Mostra ou esconde o submenu
            submenu.hidden = estaAberto;

        });

    });

    // =========================================
    // 3. FECHAR MENU AO SELECIONAR UMA OPÇÃO
    // =========================================

    menu.querySelectorAll("nav a").forEach(link => {

        link.addEventListener("click", fecharMenu);

    });

    // =========================================
    // 4. FECHAR MENU COM A TECLA ESC
    // =========================================

    document.addEventListener("keydown", evento => {

        if (evento.key === "Escape") {
            fecharMenu();
        }

    });

    // =========================================
// LINK ATIVO DO MENU LATERAL
// =========================================

const linksMenu = menu.querySelectorAll("nav a");

function atualizarLinkAtivo() {

    const destino = window.location.hash || "#painel";

    linksMenu.forEach(link => {

        const estaAtivo = link.getAttribute("href") === destino;

        link.classList.toggle("ativo", estaAtivo);

        if (estaAtivo) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }

    });
}

// Atualiza ao clicar em uma opção
linksMenu.forEach(link => {

    link.addEventListener("click", atualizarLinkAtivo);

});

// Atualiza também quando a URL mudar
window.addEventListener("hashchange", atualizarLinkAtivo);

// Define a opção ativa ao carregar o sistema
atualizarLinkAtivo();

}
