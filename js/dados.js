/* =========================================
   DADOS DO SISTEMA
   Persistência temporária com localStorage
========================================= */

// Chaves usadas para identificar os dados salvos
const CHAVE_CLIENTES = "caixaObra_clientes";
const CHAVE_OBRAS = "caixaObra_obras";
const CHAVE_CONTRATOS = "caixaObra_contratos";
const CHAVE_MOVIMENTACOES = "caixaObra_movimentacoes";
const CHAVE_DIARISTAS = "caixaObra_diaristas";
const CHAVE_DIARIAS = "caixaObra_diarias";
const CHAVE_LOCACOES_MAQUINARIO = "caixaObra_locacoes_maquinario";
const CHAVE_PAGAMENTOS_MAQUINARIO = "caixaObra_pagamentos_maquinario";



// Recupera os dados salvos no navegador
function recuperarDados(chave, dadosIniciais = []) {
    try {
        const dadosSalvos = localStorage.getItem(chave);

        if (dadosSalvos === null) {
            return dadosIniciais;
        }

        const dadosConvertidos = JSON.parse(dadosSalvos);

        return Array.isArray(dadosConvertidos)
            ? dadosConvertidos
            : dadosIniciais;

    } catch (erro) {
        console.error(`Erro ao recuperar ${chave}:`, erro);
        return dadosIniciais;
    }
}

// Arrays principais do sistema
export let clientes = recuperarDados(CHAVE_CLIENTES, []);
export let obras = recuperarDados(CHAVE_OBRAS, []);
// Recupera os contratos salvos no navegador
export let contratos = recuperarDados(CHAVE_CONTRATOS, []);
// Recupera as movimentações financeiras salvas
export let movimentacoes = recuperarDados(CHAVE_MOVIMENTACOES, []);
// Recupera os diaristas salvos no navegador
export let diaristas = recuperarDados(CHAVE_DIARISTAS, []);

// Recupera os lançamentos de diárias salvos no navegador
export let diarias = recuperarDados(CHAVE_DIARIAS, []);
// Recupera as locações de maquinário salvos no navegador
export let locacoesMaquinario = recuperarDados(CHAVE_LOCACOES_MAQUINARIO, []);

export let pagamentosMaquinario = recuperarDados(
    CHAVE_PAGAMENTOS_MAQUINARIO,
    []
);

// Salva os clientes no navegador

export function salvarClientes() {
    try {
        localStorage.setItem(CHAVE_CLIENTES, JSON.stringify(clientes));
    } catch (erro) {
        console.error("Erro ao salvar clientes:", erro);
        alert("Não foi possível salvar os clientes neste navegador.");
    }
}

// Salva as obras no navegador
export function salvarObras() {
    try {
        localStorage.setItem(CHAVE_OBRAS, JSON.stringify(obras));
    } catch (erro) {
        console.error("Erro ao salvar obras:", erro);
        alert("Não foi possível salvar as obras neste navegador.");
    }
}

// Salva os contratos no navegador
export function salvarContratos() {
    try {
        localStorage.setItem(
            CHAVE_CONTRATOS,
            JSON.stringify(contratos)
        );
    } catch (erro) {
        console.error("Erro ao salvar contratos:", erro);
        alert("Não foi possível salvar os contratos neste navegador.");
    }
}

// Salva as movimentações financeiras no navegador
export function salvarMovimentacoes() {
    try {
        localStorage.setItem(
            CHAVE_MOVIMENTACOES,
            JSON.stringify(movimentacoes)
        );
    } catch (erro) {
        console.error("Erro ao salvar movimentações:", erro);
        alert("Não foi possível salvar as movimentações neste navegador.");
    }
}

// Salva os diaristas no navegador
export function salvarDiaristas() {
    try {
        localStorage.setItem(
            CHAVE_DIARISTAS,
            JSON.stringify(diaristas)
        );
    } catch (erro) {
        console.error("Erro ao salvar diaristas:", erro);
        alert("Não foi possível salvar os diaristas neste navegador.");
    }
}

// Salva os lançamentos de diárias no navegador
export function salvarDiarias() {
        try {
        localStorage.setItem(
            CHAVE_DIARIAS,
            JSON.stringify(diarias)
        );
    } catch (erro) {
        console.error("Erro ao salvar diárias:", erro);
        alert("Não foi possível salvar as diárias neste navegador.");
    }
}

// Salva as locações de maquinário no navegador
export function salvarLocacoesMaquinario() {
    try {
        localStorage.setItem(
            CHAVE_LOCACOES_MAQUINARIO,
            JSON.stringify(locacoesMaquinario)
        );
    } catch (erro) {
        console.error("Erro ao salvar locações de maquinário:", erro);
        alert("Não foi possível salvar as locações neste navegador.");
    }
}

export function salvarPagamentosMaquinario() {
    try {
        localStorage.setItem(
            CHAVE_PAGAMENTOS_MAQUINARIO,
            JSON.stringify(pagamentosMaquinario)
        );
    } catch (erro) {
        console.error("Erro ao salvar pagamentos de maquinário:", erro);
        alert("Não foi possível salvar os pagamentos de maquinário.");
    }
}

// MAP: cria uma lista somente com os nomes das obras
export const nomesDasObras = obras.map((obra) => {
    return obra.nome;
});

// FILTER: seleciona as obras em andamento
export const obrasEmAndamento = obras.filter((obra) => {
    return obra.status === "Em andamento";
});

// Busca as obras de um cliente
export function buscarObrasPorCliente(clienteId) {
    return obras.filter((obra) => {
        return obra.clienteId === clienteId;
    });
}

// Busca um cliente pelo ID
export function buscarClientePorId(clienteId) {
    return clientes.find((cliente) => {
        return cliente.id === clienteId;
    });
}

// Consulta os dados e as obras de um cliente
export function consultarObrasDoCliente(clienteId) {
    const cliente = buscarClientePorId(clienteId);

    if (!cliente) {
        return null;
    }

    const obrasCliente = buscarObrasPorCliente(cliente.id);

    return {
        cliente: cliente.nome,
        quantidadeObras: obrasCliente.length,
        obras: obrasCliente
    };
}

// Busca todos os contratos vinculados a uma obra
export function buscarContratosPorObra(obraId) {
    return contratos.filter((contrato) => {
        return contrato.obraId === obraId;
    });
}

// Busca um diarista pelo ID
export function buscarDiaristaPorId(diaristaId) {
    return diaristas.find((diarista) => {
        return diarista.id === diaristaId;
    });
}

// Busca as diárias vinculadas a um diarista
export function buscarDiariasPorDiarista(diaristaId) {
    return diarias.filter((diaria) => {
        return diaria.diaristaId === diaristaId;
    });
}

// Busca as diárias vinculadas a uma obra
export function buscarDiariasPorObra(obraId) {
    return diarias.filter((diaria) => {
        return diaria.obraId === obraId;
    });
}

// Busca as locações de maquinário vinculadas a uma obra
export function buscarLocacoesMaquinarioPorObra(obraId) {
    return locacoesMaquinario.filter((locacao) => {
        return locacao.obraId === obraId;
    });
}

// Busca as locações de maquinário vinculadas a um cliente
export function buscarLocacoesMaquinarioPorCliente(clienteId) {
    return locacoesMaquinario.filter((locacao) => {
        return locacao.clienteId === clienteId;
    });
}

export function buscarPagamentosMaquinarioPorLocacao(locacaoId) {
    return pagamentosMaquinario.filter((pagamento) => {
        return pagamento.locacaoId === locacaoId;
    });
}
