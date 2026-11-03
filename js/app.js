import {
    clientes,
    obras,
    nomesDasObras,
    obrasEmAndamento,
    buscarObrasPorCliente,
    buscarClientePorId,
    consultarObrasDoCliente,
    salvarClientes,
    salvarObras,
    contratos,
    salvarContratos,
    buscarContratosPorObra,
    movimentacoes,
    salvarMovimentacoes,
    diaristas,
    diarias,
    salvarDiaristas,
    salvarDiarias,
    buscarDiaristaPorId,
    buscarDiariasPorDiarista,
    buscarDiariasPorObra,
    locacoesMaquinario,
    salvarLocacoesMaquinario,
    buscarLocacoesMaquinarioPorObra,
    buscarLocacoesMaquinarioPorCliente,
    pagamentosMaquinario,
    salvarPagamentosMaquinario,
    buscarPagamentosMaquinarioPorLocacao
} from "./dados.js";


function renderizarClientes() {
    const listaClientes = document.getElementById("lista-clientes");

    listaClientes.innerHTML = "";

    if (clientes.length === 0) {
        listaClientes.textContent = "Nenhum cliente cadastrado.";
        return;
    }

    clientes.forEach((cliente) => {

        const cartao = document.createElement("div");
        cartao.classList.add("cliente-card");

        const nome = document.createElement("h3");
        nome.textContent = cliente.nome;

        const documento = document.createElement("p");
        documento.textContent = `Documento: ${cliente.documento}`;

        const obrasDoCliente = buscarObrasPorCliente(cliente.id);

        const tituloObras = document.createElement("h4");
        tituloObras.textContent = "Obras vinculadas";

        const listaObras = document.createElement("ul");

        if (obrasDoCliente.length === 0) {
            const item = document.createElement("li");
            item.textContent = "Nenhuma obra cadastrada.";
            listaObras.appendChild(item);

        } else {
            obrasDoCliente.forEach((obra) => {
                const item = document.createElement("li");
                item.textContent = `${obra.nome} - ${obra.status}`;
                listaObras.appendChild(item);
            });
        }

        // Botão para excluir cliente
        const botaoExcluir = document.createElement("button");

        botaoExcluir.textContent = "Excluir cliente";
        botaoExcluir.classList.add("botao-excluir");

        botaoExcluir.addEventListener("click", () => {

            const obrasDoCliente = buscarObrasPorCliente(cliente.id);

            if (obrasDoCliente.length > 0) {
                alert("Não é possível excluir este cliente porque existem obras vinculadas a ele.");
                return;
            }

            const confirmar = confirm(
                `Deseja realmente excluir o cliente ${cliente.nome}?`
            );

            if (!confirmar) {
                return;
            }

            const indice = clientes.findIndex((item) => {
                return item.id === cliente.id;
            });

            clientes.splice(indice, 1);
            salvarClientes();

            renderizarClientes();
            carregarClientesNoSelect();

            alert("Cliente excluído com sucesso!");
        });

        // Monta o cartão
        cartao.append(
            nome,
            documento,
            tituloObras,
            listaObras,
            botaoExcluir
        );

        listaClientes.appendChild(cartao);
    });
}


// Exibe os diaristas cadastrados
function renderizarDiaristas() {

    const listaDiaristas = document.getElementById("lista-diaristas");

    listaDiaristas.innerHTML = "";

    if (diaristas.length === 0) {
        listaDiaristas.textContent = "Nenhum diarista cadastrado.";
        return;
    }

    diaristas.forEach((diarista) => {

        const cartao = document.createElement("div");
        cartao.classList.add("cliente-card");

        const nome = document.createElement("h3");
        nome.textContent = diarista.nome;

        const telefone = document.createElement("p");
        telefone.textContent = `Telefone: ${diarista.telefone || "Não informado"}`;

        const funcao = document.createElement("p");
        funcao.textContent = `Função: ${diarista.funcao}`;

        const valor = document.createElement("p");
        valor.textContent = `Valor da diária: ${Number(diarista.valorDiaria).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}`;

        const status = document.createElement("p");
        status.textContent = `Situação: ${diarista.status}`;

        cartao.append(
            nome,
            telefone,
            funcao,
            valor,
            status
        );

        listaDiaristas.appendChild(cartao);
    });
}

// RENDERIZAR LANÇAMENTOS DE DIÁRIAS
function renderizarDiarias() {
    const listaDiarias = document.getElementById("lista-diarias");

    listaDiarias.innerHTML = "";

    if (diarias.length === 0) {
        listaDiarias.textContent = "Nenhuma diária registrada.";
        return;
    }

    diarias.forEach((diaria) => {
        const cartao = document.createElement("div");
        cartao.classList.add("cliente-card");

        const diarista = buscarDiaristaPorId(diaria.diaristaId);

        const nome = document.createElement("h3");
        nome.textContent = diarista
            ? diarista.nome
            : "Diarista não encontrado";

        const data = document.createElement("p");

const dataFormatada = diaria.data
    ? diaria.data.split("-").reverse().join("/")
    : "Não informada";

data.textContent = `Data do serviço: ${dataFormatada}`;

        const quantidade = document.createElement("p");
        quantidade.textContent = `Quantidade: ${diaria.quantidade}`;

        const total = document.createElement("p");
        total.textContent = `Valor total: ${Number(diaria.total).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}`;

        const status = document.createElement("p");

        cartao.append(nome, data, quantidade, total, status);

if (diaria.status === "Pendente") {

    const botaoPagar = document.createElement("button");

    botaoPagar.type = "button";
    botaoPagar.textContent = "Marcar como paga";
    botaoPagar.classList.add("botao-editar");

    botaoPagar.addEventListener("click", () => {
        marcarDiariaComoPaga(diaria);
    });

    cartao.appendChild(botaoPagar);

} else if (diaria.status === "Pago") {

    const dataPagamento = document.createElement("p");
    dataPagamento.textContent =
        `Data do pagamento: ${formatarData(diaria.dataPagamento)}`;

    const formaPagamento = document.createElement("p");
    formaPagamento.textContent =
        `Forma de pagamento: ${diaria.pagamento.toUpperCase()}`;

    cartao.append(dataPagamento, formaPagamento);
}

        listaDiarias.appendChild(cartao);
    });
}

// CADASTRAR LANÇAMENTO DE DIÁRIA
const formLancamentoDiaria = document.getElementById("form-lancamento-diaria");

formLancamentoDiaria.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const diaristaId = document.getElementById("diaria-diarista").value;
    const clienteId = document.getElementById("diaria-cliente").value;
    const obraId = document.getElementById("diaria-obra").value;

    const data = document.getElementById("diaria-data").value;
    const quantidade = Number(document.getElementById("diaria-quantidade").value);
    const valor = Number(document.getElementById("diaria-valor").value);
    const total = Number(document.getElementById("diaria-total").value);

    const status = document.getElementById("diaria-status").value;
    const dataPagamento = document.getElementById("diaria-data-pagamento").value;
    const pagamento = document.getElementById("diaria-pagamento").value;
    const observacoes = document.getElementById("diaria-observacoes").value.trim();

    if (!buscarDiaristaPorId(diaristaId)) {
        alert("Selecione um diarista válido.");
        return;
    }

    if (!buscarClientePorId(clienteId)) {
        alert("Selecione um cliente válido.");
        return;
    }

    if (!buscarObrasPorCliente(clienteId).some((obra) => obra.id === obraId)) {
        alert("Selecione uma obra válida para o cliente.");
        return;
    }

    if (!data || !Number.isFinite(quantidade) || quantidade <= 0
        || !Number.isFinite(valor) || valor <= 0
        || !Number.isFinite(total) || total <= 0) {
        alert("Confira a data, a quantidade e os valores da diária.");
        return;
    }

    if (status === "Pago" && (!dataPagamento || !pagamento)) {
        alert("Para registrar uma diária como paga, informe a data e a forma de pagamento.");
        return;
    }

    const novaDiaria = {
        id: crypto.randomUUID(),
        diaristaId,
        clienteId,
        obraId,
        data,
        quantidade,
        valor,
        total,
        status,
        dataPagamento: status === "Pago" ? dataPagamento : null,
        pagamento: status === "Pago" ? pagamento : null,
        observacoes,
        movimentacaoId: null,
        dataRegistro: new Date().toISOString()
    };

    diarias.push(novaDiaria);

// Se o cadastro já foi feito como pago, gera a saída financeira
if (novaDiaria.status === "Pago") {

    const sucesso = gerarMovimentacaoDaDiaria(novaDiaria);

    if (!sucesso) {
        diarias.pop();
        salvarDiarias();
        return;
    }
}

const diariasSalvas = JSON.parse(
    localStorage.getItem("caixaObra_diarias")
);

console.table(diariasSalvas.map(d => ({
    id: d.id,
    diaristaId: d.diaristaId,
    obraId: d.obraId,
    data: d.data,
    status: d.status,
    movimentacaoId: d.movimentacaoId
})));

salvarDiarias();

renderizarDiarias();

    formLancamentoDiaria.reset();

    document.getElementById("diaria-obra").disabled = true;
    document.getElementById("diaria-obra").innerHTML =
        '<option value="">Selecione primeiro um cliente</option>';

    document.getElementById("diaria-total").value = "";

    alert("Diária registrada com sucesso!");
});

// CARREGAR DIARISTAS ATIVOS NO SELECT
function carregarDiaristasNoSelect() {
    const campoDiarista = document.getElementById("diaria-diarista");

    campoDiarista.innerHTML = '<option value="">Selecione um diarista</option>';

    diaristas
        .filter((diarista) => diarista.status === "Ativo")
        .forEach((diarista) => {
            const option = document.createElement("option");

            option.value = diarista.id;
            option.textContent = diarista.nome;

            campoDiarista.appendChild(option);
        });
}


// CARREGAR CLIENTES NO SELECT DE DIÁRIAS
function carregarClientesNoSelectDiarias() {
    const campoCliente = document.getElementById("diaria-cliente");

    campoCliente.innerHTML = '<option value="">Selecione um cliente</option>';

    clientes.forEach((cliente) => {
        const option = document.createElement("option");

        option.value = cliente.id;
        option.textContent = cliente.nome;

        campoCliente.appendChild(option);
    });
}


// CARREGAR OBRAS CONFORME O CLIENTE SELECIONADO
function carregarObrasNoSelectDiarias() {
    const campoCliente = document.getElementById("diaria-cliente");
    const campoObra = document.getElementById("diaria-obra");

    const clienteId = campoCliente.value;

    campoObra.innerHTML = '<option value="">Selecione uma obra</option>';

    if (!clienteId) {
        campoObra.disabled = true;
        return;
    }

    const obrasDoCliente = buscarObrasPorCliente(clienteId);

    obrasDoCliente.forEach((obra) => {
        const option = document.createElement("option");

        option.value = obra.id;
        option.textContent = obra.nome;

        campoObra.appendChild(option);
    });

    campoObra.disabled = obrasDoCliente.length === 0;
}


// PREENCHER VALOR PADRÃO DO DIARISTA
function preencherValorDiaria() {
    const campoDiarista = document.getElementById("diaria-diarista");
    const campoValor = document.getElementById("diaria-valor");

    const diarista = buscarDiaristaPorId(campoDiarista.value);

    if (!diarista) {
        campoValor.value = "";
        calcularTotalDiaria();
        return;
    }

    campoValor.value = diarista.valorDiaria;

    calcularTotalDiaria();
}


// CALCULAR VALOR TOTAL
function calcularTotalDiaria() {
    const quantidade = Number(
        document.getElementById("diaria-quantidade").value
    );

    const valor = Number(
        document.getElementById("diaria-valor").value
    );

    const total = quantidade * valor;

    document.getElementById("diaria-total").value =
        Number.isFinite(total) ? total.toFixed(2) : "0.00";
}

// EVENTOS DO FORMULÁRIO DE DIÁRIAS

document.getElementById("diaria-diarista")
    .addEventListener("change", preencherValorDiaria);

document.getElementById("diaria-cliente")
    .addEventListener("change", carregarObrasNoSelectDiarias);

document.getElementById("diaria-quantidade")
    .addEventListener("input", calcularTotalDiaria);

document.getElementById("diaria-valor")
    .addEventListener("input", calcularTotalDiaria);



// Captura o formulário de clientes
const formCliente = document.getElementById("form-cliente");

// Escuta o envio do formulário
formCliente.addEventListener("submit", (evento) => {

    // Impede o recarregamento da página
    evento.preventDefault();

    // Captura os valores digitados
    const nome = document.getElementById("cliente-nome").value.trim();
    const documento = document.getElementById("cliente-documento").value.trim();
    const telefone = document.getElementById("cliente-telefone").value.trim();
    const email = document.getElementById("cliente-email").value.trim();
    const endereco = document.getElementById("cliente-endereco").value.trim();

    // Verifica se já existe um cliente com esse documento
    const clienteExistente = clientes.find((cliente) => {
        return cliente.documento === documento;
    });

    if (clienteExistente) {
        alert("Já existe um cliente cadastrado com esse documento.");
        return;
    }

    // Cria o novo cliente
    const novoCliente = {
        id: crypto.randomUUID(),
        nome: nome,
        documento: documento,
        telefone: telefone,
        email: email,
        endereco: endereco
    };

    // Adiciona o cliente ao array
    clientes.push(novoCliente);
    salvarClientes();

    // Atualiza a listagem
    renderizarClientes();

    // Atualiza a lista de clientes no formulário de obras
    carregarClientesNoSelect();

    // Limpa o formulário
    formCliente.reset();

    alert("Cliente cadastrado com sucesso!");
});


// Captura o formulário de diaristas
const formDiarista = document.getElementById("form-diarista");

// Escuta o envio do formulário
formDiarista.addEventListener("submit", (evento) => {

    evento.preventDefault();

    // Captura os valores digitados
    const nome = document.getElementById("diarista-nome").value.trim();
    const telefone = document.getElementById("diarista-telefone").value.trim();
    const funcao = document.getElementById("diarista-funcao").value.trim();
    const valorDiaria = Number(document.getElementById("diarista-valor").value);
    const status = document.getElementById("diarista-status").value;

    // Verifica se já existe um cadastro com o mesmo nome e telefone
    // Normaliza o telefone, mantendo somente os números
const telefoneNormalizado = telefone.replace(/\D/g, "");

// Verifica se o telefone já está cadastrado
const diaristaExistente = diaristas.find((diarista) => {

    const telefoneCadastrado = (diarista.telefone || "").replace(/\D/g, "");

    return telefoneNormalizado !== ""
        && telefoneCadastrado === telefoneNormalizado;

});

if (diaristaExistente) {
    alert("Este telefone já está vinculado a outro diarista.");
    return;
}

    if (diaristaExistente) {
        alert("Este diarista já está cadastrado.");
        return;
    }

    // Valida o valor da diária
    if (!Number.isFinite(valorDiaria) || valorDiaria <= 0) {
        alert("Informe um valor válido para a diária.");
        return;
    }

    // Cria o novo diarista
    const novoDiarista = {
        id: crypto.randomUUID(),
        nome: nome,
        telefone: telefone,
        funcao: funcao,
        valorDiaria: valorDiaria,
        status: status
    };

    // Adiciona ao array
    diaristas.push(novoDiarista);

    // Salva no navegador
    salvarDiaristas();

    // Atualiza a listagem
    renderizarDiaristas();

    // Limpa o formulário
    formDiarista.reset();

    alert("Diarista cadastrado com sucesso!");
});


function carregarClientesNoSelect() {
    const selectCliente = document.getElementById("obra-cliente");

    // Mantém apenas a opção inicial
    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

    clientes.forEach((cliente) => {
        const opcao = document.createElement("option");

        opcao.value = cliente.id;
        opcao.textContent = cliente.nome;

        selectCliente.appendChild(opcao);
    });
}

function carregarClientesNoSelectContratos() {

    const selectCliente = document.getElementById("contrato-cliente");

    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

    clientes.forEach((cliente) => {

        const opcao = document.createElement("option");

        opcao.value = cliente.id;
        opcao.textContent = cliente.nome;

        selectCliente.appendChild(opcao);

    });

}

// MAQUINÁRIO: carregar clientes no select
function carregarClientesNoSelectMaquinario() {
    const selectCliente = document.getElementById("maquinario-cliente");

    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

    clientes.forEach((cliente) => {
        const opcao = document.createElement("option");

        opcao.value = cliente.id;
        opcao.textContent = cliente.nome;

        selectCliente.appendChild(opcao);
    });
}

// Carrega os clientes no formulário de movimentações
function carregarClientesNoSelectMovimentacoes() {

    const selectCliente = document.getElementById("movimentacao-cliente");

    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

    clientes.forEach((cliente) => {

        const opcao = document.createElement("option");

        opcao.value = cliente.id;
        opcao.textContent = cliente.nome;

        selectCliente.appendChild(opcao);

    });

}

// MAQUINÁRIO: carregar obras do cliente selecionado
function carregarObrasNoSelectMaquinario(clienteId) {
    const selectObra = document.getElementById("maquinario-obra");

    selectObra.innerHTML = '<option value="">Selecione uma obra</option>';

    if (!clienteId) {
        selectObra.disabled = true;
        return;
    }

    const obrasDoCliente = buscarObrasPorCliente(clienteId);

    obrasDoCliente.forEach((obra) => {
        const opcao = document.createElement("option");

        opcao.value = obra.id;
        opcao.textContent = obra.nome;

        selectObra.appendChild(opcao);
    });

    selectObra.disabled = false;
}

// Atualiza as obras quando o cliente é selecionado
document.getElementById("maquinario-cliente").addEventListener("change", (evento) => {
    carregarObrasNoSelectMaquinario(evento.target.value);
});

// MAQUINÁRIO: carregar locações no select de pagamentos
function carregarLocacoesNoSelectPagamentoMaquinario() {

    const selectLocacao = document.getElementById(
        "pagamento-maquinario-locacao"
    );

    selectLocacao.innerHTML =
        '<option value="">Selecione uma locação</option>';

    locacoesMaquinario
    .filter((locacao) => {

        if (locacao.status !== "Ativa") {
            return false;
        }

        const totalPago = pagamentosMaquinario
            .filter((pagamento) =>
                pagamento.locacaoId === locacao.id &&
                pagamento.status === "Pago"
            )
            .reduce((total, pagamento) => {
                return total + Number(pagamento.valor || 0);
            }, 0);

        return totalPago < Number(locacao.custoPrevisto);
    })
        .forEach((locacao) => {

            const opcao = document.createElement("option");

            opcao.value = locacao.id;

            opcao.textContent =
                `${locacao.equipamento} - ${locacao.locadora}`;

            selectLocacao.appendChild(opcao);
        });
}

// MAQUINÁRIO: exibir locações cadastradas
function renderizarMaquinario() {

    const listaMaquinario = document.getElementById("lista-maquinario");

    listaMaquinario.innerHTML = "";

    if (locacoesMaquinario.length === 0) {
        listaMaquinario.textContent =
            "Nenhuma locação de maquinário cadastrada.";
        return;
    }

    locacoesMaquinario.forEach((locacao) => {

        const cartao = document.createElement("div");
        cartao.classList.add("cliente-card");

        const cliente = buscarClientePorId(locacao.clienteId);

        const obra = obras.find((item) => {
            return item.id === locacao.obraId;
        });

        // Busca os pagamentos vinculados a esta locação
        const pagamentosDaLocacao =
            buscarPagamentosMaquinarioPorLocacao(locacao.id);

        // Soma somente os pagamentos efetivamente pagos
        const totalPago = pagamentosDaLocacao
            .filter((pagamento) => pagamento.status === "Pago")
            .reduce((total, pagamento) => {
                return total + Number(pagamento.valor || 0);
            }, 0);

        const custoPrevisto = Number(locacao.custoPrevisto || 0);

        const saldoPendente = Math.max(0, custoPrevisto - totalPago);

        const equipamento = document.createElement("h3");
        equipamento.textContent = locacao.equipamento;

        const locadora = document.createElement("p");
        locadora.textContent = `Locadora: ${locacao.locadora}`;

        const identificacao = document.createElement("p");
        identificacao.textContent =
            `Identificação: ${locacao.identificacao || "Não informada"}`;

        const nomeCliente = document.createElement("p");
        nomeCliente.textContent =
            `Cliente: ${cliente ? cliente.nome : "Não encontrado"}`;

        const nomeObra = document.createElement("p");
        nomeObra.textContent =
            `Obra: ${obra ? obra.nome : "Não encontrada"}`;

        const inicio = document.createElement("p");
        inicio.textContent =
            `Início: ${formatarData(locacao.inicio)}`;

        const devolucao = document.createElement("p");
        devolucao.textContent =
            `Devolução prevista: ${formatarData(locacao.devolucaoPrevista)}`;

        const valor = document.createElement("p");
        valor.textContent =
            `Valor da diária: ${Number(locacao.valorUnitario).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })}`;

        const custo = document.createElement("p");
        custo.textContent =
            `Custo previsto: ${custoPrevisto.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })}`;

        const pago = document.createElement("p");
        pago.textContent =
            `Total pago: ${totalPago.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })}`;

        const saldo = document.createElement("p");
        saldo.textContent =
            `Saldo pendente: ${saldoPendente.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })}`;

        // Situação da locação
const status = document.createElement("p");
status.textContent = `Situação da locação: ${locacao.status}`;

// Situação financeira
const situacaoFinanceira = document.createElement("p");

if (saldoPendente <= 0) {
    situacaoFinanceira.textContent = "Situação financeira: Quitada";
} else if (totalPago > 0) {
    situacaoFinanceira.textContent = "Situação financeira: Parcialmente paga";
} else {
    situacaoFinanceira.textContent = "Situação financeira: Pendente";
}

        // Histórico de pagamentos
        const tituloHistorico = document.createElement("h4");
        tituloHistorico.textContent = "Histórico de pagamentos";

        const historico = document.createElement("div");

        if (pagamentosDaLocacao.length === 0) {

            historico.textContent = "Nenhum pagamento registrado.";

        } else {

            pagamentosDaLocacao.forEach((pagamento) => {

                const itemPagamento = document.createElement("p");

                itemPagamento.textContent =
                    `${formatarData(pagamento.data)} - ` +
                    `${Number(pagamento.valor).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })} - ${pagamento.formaPagamento} - ${pagamento.status}`;

                historico.appendChild(itemPagamento);
            });
        }

        cartao.append(
            equipamento,
            locadora,
            identificacao,
            nomeCliente,
            nomeObra,
            inicio,
            devolucao,
            valor,
            custo,
            pago,
            saldo,
            status,
            situacaoFinanceira,
            tituloHistorico,
            historico
        );

        listaMaquinario.appendChild(cartao);
    });
}



 // =========================================
// REGISTRAR PAGAMENTO DE MAQUINÁRIO
// =========================================

document.getElementById("form-pagamento-maquinario")
    .addEventListener("submit", (evento) => {

        evento.preventDefault();

        // Captura os dados do formulário
        const locacaoId = document.getElementById(
            "pagamento-maquinario-locacao"
        ).value;

        const data = document.getElementById(
            "pagamento-maquinario-data"
        ).value;

        const valor = Number(
            document.getElementById(
                "pagamento-maquinario-valor"
            ).value
        );

        const formaPagamento = document.getElementById(
            "pagamento-maquinario-forma"
        ).value;

        const documento = document.getElementById(
            "pagamento-maquinario-documento"
        ).value.trim();

        const observacoes = document.getElementById(
            "pagamento-maquinario-observacoes"
        ).value.trim();

        // Localiza a locação
        const locacao = locacoesMaquinario.find(
            (item) => item.id === locacaoId
        );

        if (!locacao || locacao.status !== "Ativa") {
            alert("Selecione uma locação ativa válida.");
            return;
        }

        // Valida a data
        const dataPagamento = new Date(`${data}T00:00:00`);

        if (!data || Number.isNaN(dataPagamento.getTime())) {
            alert("Informe uma data de pagamento válida.");
            return;
        }

        // Valida o valor
        if (!Number.isFinite(valor) || valor <= 0) {
            alert("Informe um valor de pagamento válido.");
            return;
        }

        if (!formaPagamento) {
            alert("Selecione a forma de pagamento.");
            return;
        }

        // Calcula quanto já foi pago nesta locação
        const totalPago = pagamentosMaquinario
            .filter((pagamento) =>
                pagamento.locacaoId === locacaoId &&
                pagamento.status === "Pago"
            )
            .reduce((total, pagamento) => {
                return total + Number(pagamento.valor || 0);
            }, 0);

        const custoPrevisto = Number(locacao.custoPrevisto);

        const saldoPendente = custoPrevisto - totalPago;

        // Impede pagamento acima do custo previsto
        if (valor > saldoPendente + 0.001) {
            alert(
                `O valor informado ultrapassa o saldo pendente.\n\n` +
                `Saldo disponível: ${saldoPendente.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}`
            );
            return;
        }

        // Cria o registro do pagamento
        const novoPagamento = {

            id: crypto.randomUUID(),

            locacaoId,

            data,
            valor,
            formaPagamento,

            documento,
            observacoes,

            status: "Pago",

            movimentacaoId: null,

            dataRegistro: new Date().toISOString()
        };

        // Guarda o pagamento
        pagamentosMaquinario.push(novoPagamento);

        // Gera a saída financeira correspondente
        const movimentacaoGerada =
            gerarMovimentacaoDoPagamentoMaquinario(novoPagamento);

        // Se não conseguir gerar a movimentação, desfaz o registro
        if (!movimentacaoGerada) {

            pagamentosMaquinario.pop();

            salvarPagamentosMaquinario();

            return;
        }

        // Atualiza os dados e as telas
        salvarPagamentosMaquinario();

        renderizarMaquinario();

        // Limpa o formulário
        evento.target.reset();

        alert("Pagamento registrado e lançado no financeiro com sucesso!");

    });

// =========================================
// CADASTRAR LOCAÇÃO DE MAQUINÁRIO
// =========================================

document.getElementById("form-maquinario").addEventListener("submit", (evento) => {

    evento.preventDefault();

    // Captura os dados do formulário
    const equipamento = document.getElementById("maquinario-equipamento").value.trim();
    const locadora = document.getElementById("maquinario-locadora").value.trim();
    const identificacao = document.getElementById("maquinario-identificacao").value.trim();

    const clienteId = document.getElementById("maquinario-cliente").value;
    const obraId = document.getElementById("maquinario-obra").value;

    const inicio = document.getElementById("maquinario-inicio").value;
    const devolucaoPrevista = document.getElementById("maquinario-devolucao").value;

    const tipoCobranca = document.getElementById("maquinario-tipo-cobranca").value;

    const valorUnitario = Number(
        document.getElementById("maquinario-valor").value
    );

    const observacoes = document.getElementById("maquinario-observacoes").value.trim();

    // Verifica se cliente e obra estão corretamente vinculados
    const cliente = buscarClientePorId(clienteId);

    const obra = obras.find((item) => {
        return item.id === obraId && item.clienteId === clienteId;
    });

    if (!cliente || !obra) {
        alert("Selecione um cliente e uma obra válida.");
        return;
    }

    // Neste primeiro momento, trabalharemos somente com diária
    if (tipoCobranca !== "diaria") {
        alert("Por enquanto, o sistema aceita somente cobrança por diária.");
        return;
    }

    // Valida as datas
    const dataInicio = new Date(`${inicio}T00:00:00`);
    const dataDevolucao = new Date(`${devolucaoPrevista}T00:00:00`);

    if (
        !inicio ||
        !devolucaoPrevista ||
        Number.isNaN(dataInicio.getTime()) ||
        Number.isNaN(dataDevolucao.getTime())
    ) {
        alert("Informe datas válidas para a locação.");
        return;
    }

    if (dataDevolucao <= dataInicio) {
        alert("A previsão de devolução deve ser posterior ao início da locação.");
        return;
    }

    // Valida o valor da diária
    if (!Number.isFinite(valorUnitario) || valorUnitario <= 0) {
        alert("Informe um valor de diária válido.");
        return;
    }

    // Calcula a quantidade de diárias
    const milissegundosPorDia = 1000 * 60 * 60 * 24;

    const quantidadeDiarias = Math.round(
        (dataDevolucao - dataInicio) / milissegundosPorDia
    );

    // Calcula o custo previsto
    const custoPrevisto = quantidadeDiarias * valorUnitario;

    // Verifica possível cadastro duplicado
    const locacaoDuplicada = locacoesMaquinario.some((locacao) => {
        return (
            locacao.equipamento.toLowerCase() === equipamento.toLowerCase() &&
            locacao.locadora.toLowerCase() === locadora.toLowerCase() &&
            locacao.obraId === obraId &&
            locacao.inicio === inicio &&
            locacao.devolucaoPrevista === devolucaoPrevista &&
            locacao.status !== "Cancelada"
        );
    });

    if (locacaoDuplicada) {
        alert("Esta locação já está cadastrada.");
        return;
    }

    // Cria o registro da locação
    const novaLocacao = {
        id: crypto.randomUUID(),

        equipamento,
        locadora,
        identificacao,

        clienteId,
        obraId,

        inicio,
        devolucaoPrevista,

        tipoCobranca,
        valorUnitario,

        quantidadeDiarias,
        custoPrevisto,

        observacoes,

        status: "Ativa",

        dataRegistro: new Date().toISOString()
    };

    // Salva a locação
    locacoesMaquinario.push(novaLocacao);

    salvarLocacoesMaquinario();

    // Atualiza a tela
    renderizarMaquinario();
    carregarLocacoesNoSelectPagamentoMaquinario();

    // Limpa o formulário
    evento.target.reset();

    // Restaura o select de obras
    const selectObra = document.getElementById("maquinario-obra");

    selectObra.innerHTML =
        '<option value="">Selecione primeiro um cliente</option>';

    selectObra.disabled = true;

    alert("Locação de maquinário cadastrada com sucesso!");

});

function filtrarObrasDoContrato() {

    const selectCliente = document.getElementById("contrato-cliente");
    const selectObra = document.getElementById("contrato-obra");

    const clienteId = selectCliente.value;

    // Limpa as opções anteriores
    selectObra.innerHTML = "";

    if (!clienteId) {

        selectObra.innerHTML = '<option value="">Selecione primeiro um cliente</option>';

        selectObra.disabled = true;

        return;
    }

    // Busca somente as obras do cliente selecionado
    const obrasDoCliente = buscarObrasPorCliente(clienteId);

    if (obrasDoCliente.length === 0) {

        selectObra.innerHTML = '<option value="">Este cliente não possui obras cadastradas</option>';

        selectObra.disabled = true;

        return;
    }

    selectObra.innerHTML = '<option value="">Selecione uma obra</option>';

    obrasDoCliente.forEach((obra) => {

        const opcao = document.createElement("option");

        opcao.value = obra.id;
        opcao.textContent = obra.nome;

        selectObra.appendChild(opcao);

    });

    selectObra.disabled = false;

}

// Filtra as obras de acordo com o cliente selecionado em Movimentações
function filtrarObrasDaMovimentacao() {

    const selectCliente = document.getElementById("movimentacao-cliente");
    const selectObra = document.getElementById("movimentacao-obra");

    const clienteId = selectCliente.value;

    // Limpa as opções anteriores
    selectObra.innerHTML = "";

    if (!clienteId) {

        selectObra.innerHTML = '<option value="">Selecione primeiro um cliente</option>';

        selectObra.disabled = true;

        return;
    }

    // Busca as obras vinculadas ao cliente
    const obrasDoCliente = buscarObrasPorCliente(clienteId);

    if (obrasDoCliente.length === 0) {

        selectObra.innerHTML = '<option value="">Este cliente não possui obras cadastradas</option>';

        selectObra.disabled = true;

        return;
    }

    selectObra.innerHTML = '<option value="">Selecione uma obra</option>';

    obrasDoCliente.forEach((obra) => {

        const opcao = document.createElement("option");

        opcao.value = obra.id;
        opcao.textContent = obra.nome;

        selectObra.appendChild(opcao);

    });

    selectObra.disabled = false;

}


function formatarData(data) {
    if (!data) {
        return "Não informada";
    }

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
}

// Formata valores para o padrão monetário brasileiro
function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Guarda o ID da movimentação que está sendo editada
let movimentacaoEmEdicaoId = null;

// Registra ações no histórico da movimentação
function registrarHistoricoMovimentacao(movimentacao, acao, detalhes = {}) {

    if (!Array.isArray(movimentacao.historico)) {
        movimentacao.historico = [];
    }

    const registro = {
        id: crypto.randomUUID(),
        acao,
        data: new Date().toISOString(),
        usuario: "Usuário local (sem autenticação)",
        ...detalhes
    };

    movimentacao.historico.push(registro);
}

// GERA UMA MOVIMENTAÇÃO FINANCEIRA A PARTIR DE UMA DIÁRIA PAGA
function gerarMovimentacaoDaDiaria(diaria) {

    // Impede gerar outra movimentação para a mesma diária
    if (diaria.movimentacaoId) {
        return true;
    }

    // Segunda proteção: procura uma movimentação já vinculada à diária
    const movimentacaoExistente = movimentacoes.find(
        (item) => item.origemDiariaId === diaria.id
    );

    if (movimentacaoExistente) {
        diaria.movimentacaoId = movimentacaoExistente.id;
        salvarDiarias();
        return true;
    }

    const diarista = buscarDiaristaPorId(diaria.diaristaId);

    if (!diarista) {
        alert("Não foi possível localizar o diarista.");
        return false;
    }

    if (!diaria.dataPagamento || !diaria.pagamento) {
        alert("Informe a data e a forma de pagamento.");
        return false;
    }

    // Monta a saída financeira
    const novaMovimentacao = {
        id: crypto.randomUUID(),

        tipo: "saida",
        tipoDespesa: "operacional",

        data: diaria.dataPagamento,

        clienteId: diaria.clienteId,
        obraId: diaria.obraId,

        descricao: `Pagamento de diária — ${diarista.nome}`,
        categoria: "mao-de-obra",
        fornecedor: diarista.nome,

        valor: diaria.total,
        pagamento: diaria.pagamento,
        documento: "",

        status: "ativa",
        dataRegistro: new Date().toISOString(),

        // Identifica a origem para impedir duplicidade
        origemDiariaId: diaria.id,

        historico: []
    };

    registrarHistoricoMovimentacao(
        novaMovimentacao,
        "Despesa gerada automaticamente a partir de uma diária",
        {
            diariaId: diaria.id,
            valor: diaria.total
        }
    );

    movimentacoes.push(novaMovimentacao);

    // Guarda o vínculo entre a diária e a movimentação
    diaria.movimentacaoId = novaMovimentacao.id;

    salvarMovimentacoes();
    salvarDiarias();

    renderizarMovimentacoes();
    renderizarResumoFinanceiro();

    return true;
}


// GERA UMA MOVIMENTAÇÃO FINANCEIRA A PARTIR DE UM PAGAMENTO DE MAQUINÁRIO
function gerarMovimentacaoDoPagamentoMaquinario(pagamento) {

    // Impede gerar outra movimentação para o mesmo pagamento
    if (pagamento.movimentacaoId) {
        return true;
    }

    // Segunda proteção: procura uma movimentação já vinculada
    const movimentacaoExistente = movimentacoes.find(
        (item) =>
            item.origemPagamentoMaquinarioId === pagamento.id
    );

    if (movimentacaoExistente) {
        pagamento.movimentacaoId = movimentacaoExistente.id;
        salvarPagamentosMaquinario();
        return true;
    }

    // Localiza a locação correspondente
    const locacao = locacoesMaquinario.find(
        (item) => item.id === pagamento.locacaoId
    );

    if (!locacao) {
        alert("Não foi possível localizar a locação do equipamento.");
        return false;
    }

    // Confere se o pagamento está efetivamente pago
    if (pagamento.status !== "Pago") {
        alert("Somente pagamentos confirmados podem gerar despesas financeiras.");
        return false;
    }

    if (!pagamento.data || !pagamento.formaPagamento) {
        alert("Informe a data e a forma de pagamento.");
        return false;
    }

    const valor = Number(pagamento.valor);

    if (!Number.isFinite(valor) || valor <= 0) {
        alert("O valor do pagamento é inválido.");
        return false;
    }

    // Localiza o cliente e a obra vinculados à locação
    const obra = obras.find(
        (item) =>
            item.id === locacao.obraId &&
            item.clienteId === locacao.clienteId
    );

    if (!obra) {
        alert("Não foi possível localizar a obra vinculada à locação.");
        return false;
    }

    // Monta a saída financeira
    const novaMovimentacao = {
        id: crypto.randomUUID(),

        tipo: "saida",
        tipoDespesa: "operacional",

        data: pagamento.data,

        clienteId: locacao.clienteId,
        obraId: locacao.obraId,

        descricao: `Pagamento de maquinário — ${locacao.equipamento}`,
        categoria: "maquinario",
        fornecedor: locacao.locadora,

        valor: valor,
        pagamento: pagamento.formaPagamento,
        documento: pagamento.documento || "",

        status: "ativa",
        dataRegistro: new Date().toISOString(),

        // Identifica a origem para impedir duplicidade
        origemPagamentoMaquinarioId: pagamento.id,

        historico: []
    };

    registrarHistoricoMovimentacao(
        novaMovimentacao,
        "Despesa gerada automaticamente a partir de um pagamento de maquinário",
        {
            pagamentoMaquinarioId: pagamento.id,
            locacaoId: locacao.id,
            valor: valor
        }
    );

    movimentacoes.push(novaMovimentacao);

    // Guarda o vínculo entre o pagamento e a movimentação
    pagamento.movimentacaoId = novaMovimentacao.id;

    salvarMovimentacoes();
    salvarPagamentosMaquinario();

    renderizarMovimentacoes();
    renderizarResumoFinanceiro();

    return true;
}


// TRANSFORMAR UMA DIÁRIA PENDENTE EM PAGA
function marcarDiariaComoPaga(diaria) {

    if (diaria.status === "Pago") {
        alert("Esta diária já está marcada como paga.");
        return;
    }

    if (diaria.movimentacaoId) {
        alert("Esta diária já possui uma movimentação financeira vinculada.");
        return;
    }

    const dataPagamento = prompt(
        "Informe a data do pagamento (AAAA-MM-DD):"
    );

    if (dataPagamento === null) {
        return;
    }

    // Valida o formato e a existência da data
    const dataValida = /^\d{4}-\d{2}-\d{2}$/.test(dataPagamento)
        && (() => {
            const [ano, mes, dia] = dataPagamento.split("-").map(Number);
            const data = new Date(ano, mes - 1, dia);

            return data.getFullYear() === ano
                && data.getMonth() === mes - 1
                && data.getDate() === dia;
        })();

    if (!dataValida) {
        alert("Informe uma data válida no formato AAAA-MM-DD.");
        return;
    }

    const pagamento = prompt(
        "Informe a forma de pagamento:\n\n" +
        "pix\n" +
        "transferencia\n" +
        "boleto\n" +
        "dinheiro\n" +
        "cartao\n" +
        "outros"
    );

    if (pagamento === null) {
        return;
    }

    const formasPagamento = [
        "pix",
        "transferencia",
        "boleto",
        "dinheiro",
        "cartao",
        "outros"
    ];

    const formaNormalizada = pagamento.trim().toLowerCase();

    if (!formasPagamento.includes(formaNormalizada)) {
        alert("Forma de pagamento inválida.");
        return;
    }

    const confirmar = confirm(
        `Confirma o pagamento de ${formatarMoeda(diaria.total)}?\n\n` +
        "Uma saída operacional será registrada no financeiro."
    );

    if (!confirmar) {
        return;
    }

    // Prepara os dados do pagamento
    diaria.dataPagamento = dataPagamento;
    diaria.pagamento = formaNormalizada;
    diaria.status = "Pago";

    const sucesso = gerarMovimentacaoDaDiaria(diaria);

    if (!sucesso) {
        // Restaura a situação anterior se não conseguir gerar a despesa
        diaria.status = "Pendente";
        diaria.dataPagamento = null;
        diaria.pagamento = null;

        salvarDiarias();
        return;
    }

    salvarDiarias();

    renderizarDiarias();

    alert("Pagamento registrado e saída financeira gerada com sucesso!");
}

// Converte uma data para o formato YYYY-MM-DD
function formatarDataFiltro(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


// Calcula uma data voltando determinado número de meses
function calcularDataMesesAntes(dataAtual, quantidadeMeses) {

    const data = new Date(dataAtual);
    const diaOriginal = data.getDate();

    data.setDate(1);
    data.setMonth(data.getMonth() - quantidadeMeses);

    const ultimoDiaDoMes = new Date(
        data.getFullYear(),
        data.getMonth() + 1,
        0
    ).getDate();

    data.setDate(Math.min(diaOriginal, ultimoDiaDoMes));

    return data;
}


// Retorna as movimentações do período selecionado
function obterMovimentacoesDoPeriodo() {

    const periodo = document.getElementById("filtro-periodo").value;

    const hoje = new Date();
    const dataHoje = formatarDataFiltro(hoje);

    let dataInicio = null;
    let dataFim = dataHoje;

    switch (periodo) {

        case "todos":
            return [...movimentacoes];

        case "mes":
            dataInicio = formatarDataFiltro(
                new Date(hoje.getFullYear(), hoje.getMonth(), 1)
            );
            break;

        case "trimestre":
            dataInicio = formatarDataFiltro(
                calcularDataMesesAntes(hoje, 3)
            );
            break;

        case "semestre":
            dataInicio = formatarDataFiltro(
                calcularDataMesesAntes(hoje, 6)
            );
            break;

        case "ano":
            dataInicio = `${hoje.getFullYear()}-01-01`;
            break;

        case "personalizado":
            dataInicio = document.getElementById("filtro-data-inicio").value;
            dataFim = document.getElementById("filtro-data-fim").value;
            break;
    }

    // Mantém somente as movimentações dentro do período
    return movimentacoes.filter((item) => {
        return item.data >= dataInicio && item.data <= dataFim;
    });
}


// =========================================
// GRÁFICO: ENTRADAS X SAÍDAS POR MÊS
// =========================================

let graficoEntradasSaidas = null;

function renderizarGraficoEntradasSaidas(movimentacoesDoPeriodo) {

    const elemento = document.getElementById(
        "grafico-entradas-saidas"
    );

    if (!elemento) return;

    // Agrupa as movimentações por mês e ano
    const dadosPorMes = {};

    movimentacoesDoPeriodo.forEach((item) => {

        if (!item.data) return;

        const partesData = item.data.split("-");

        if (partesData.length !== 3) return;

        const ano = Number(partesData[0]);
        const mes = Number(partesData[1]);

        if (!ano || mes < 1 || mes > 12) return;

        const chave = `${ano}-${String(mes).padStart(2, "0")}`;

        if (!dadosPorMes[chave]) {
            dadosPorMes[chave] = {
                entradas: 0,
                saidas: 0
            };
        }

        const valor = Number(item.valor) || 0;

        if (item.tipo === "entrada") {
            dadosPorMes[chave].entradas += valor;
        }

        if (item.tipo === "saida") {
            dadosPorMes[chave].saidas += valor;
        }

    });

    // Organiza os meses cronologicamente
    const mesesOrdenados = Object.keys(dadosPorMes).sort();

    const nomesMeses = [
        "Jan", "Fev", "Mar", "Abr",
        "Mai", "Jun", "Jul", "Ago",
        "Set", "Out", "Nov", "Dez"
    ];

    const labels = mesesOrdenados.map((chave) => {

        const [ano, mes] = chave.split("-");

        return `${nomesMeses[Number(mes) - 1]}/${ano}`;
    });

    const entradas = mesesOrdenados.map(
        (chave) => dadosPorMes[chave].entradas
    );

    const saidas = mesesOrdenados.map(
        (chave) => dadosPorMes[chave].saidas
    );

    // Evita criar gráficos duplicados
    if (graficoEntradasSaidas) {
        graficoEntradasSaidas.destroy();
    }

    // Cria o gráfico
    graficoEntradasSaidas = new Chart(elemento, {

        type: "bar",

        data: {
            labels,

            datasets: [
                {
                    label: "Entradas",
                    data: entradas,
                    backgroundColor: "#2E9D68",
                    borderRadius: 6
                },
                {
                    label: "Saídas",
                    data: saidas,
                    backgroundColor: "#EF4A37",
                    borderRadius: 6
                }
            ]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {

                legend: {
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ": " +
                                context.parsed.y.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                });
                        }
                    }
                }
            },

            scales: {

                y: {
                    beginAtZero: true,

                    ticks: {
                        callback: function(valor) {
                            return valor.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                maximumFractionDigits: 0
                            });
                        }
                    }
                }
            }
        }
    });
}

let graficoDespesasCategoria = null;

function renderizarGraficoDespesasPorCategoria(movimentacoesDoPeriodo) {

    const elemento = document.getElementById("grafico-despesas-categoria");

    if (!elemento) return;

    // Categorias e nomes apresentados no gráfico
    const categorias = {
        "materiais": "Materiais",
        "mao-de-obra": "Mão de obra",
        "maquinario": "Aluguel de maquinário",
        "fornecedores": "Fornecedores",
        "medicoes": "Medições recebidas",
        "outros": "Outros"
    };

    // Inicializa os valores de cada categoria
    const valoresPorCategoria = {};

    Object.keys(categorias).forEach((categoria) => {
        valoresPorCategoria[categoria] = 0;
    });

    // Soma somente as saídas ativas
    movimentacoesDoPeriodo.forEach((item) => {

        if (item.tipo !== "saida") return;

        const categoria = categorias[item.categoria]
            ? item.categoria
            : "outros";

        valoresPorCategoria[categoria] += Number(item.valor) || 0;
    });

    // Remove categorias sem despesas no período
    const categoriasComValores = Object.keys(valoresPorCategoria)
        .filter((categoria) => valoresPorCategoria[categoria] > 0);

    const labels = categoriasComValores.map(
        (categoria) => categorias[categoria]
    );

    const valores = categoriasComValores.map(
        (categoria) => valoresPorCategoria[categoria]
    );

    if (graficoDespesasCategoria) {
        graficoDespesasCategoria.destroy();
    }

    graficoDespesasCategoria = new Chart(elemento, {
        type: "doughnut",

        data: {
            labels,
            datasets: [{
                label: "Despesas",
                data: valores,
                backgroundColor: [
                    "#283248",
                    "#EF4A37",
                    "#F58634",
                    "#322775",
                    "#2E9D68",
                    "#DCE7F2"
                ],
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {

                            const valor = context.parsed;

                            return context.label + ": " +
                                valor.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                });
                        }
                    }
                }
            }
        }
    });
}

let graficoResultadoObras = null;

function renderizarGraficoResultadoObras(movimentacoesDoPeriodo) {

    const elemento = document.getElementById("grafico-resultado-obras");

    if (!elemento) return;

    // Calcula os resultados financeiros de cada obra
    const resultados = obras.map((obra) => {

        const movimentacoesDaObra = movimentacoesDoPeriodo.filter((item) =>
            item.status !== "estornada" &&
            item.obraId === obra.id
        );

        const entradas = movimentacoesDaObra
            .filter((item) => item.tipo === "entrada")
            .reduce((total, item) => total + Number(item.valor || 0), 0);

        const despesas = movimentacoesDaObra
            .filter((item) =>
                item.tipo === "saida" &&
                item.tipoDespesa === "operacional"
            )
            .reduce((total, item) => total + Number(item.valor || 0), 0);

        return {
            nome: obra.nome,
            entradas,
            despesas,
            resultado: entradas - despesas
        };
    });

    const labels = resultados.map((item) => item.nome);

    const entradas = resultados.map((item) => item.entradas);

    const despesas = resultados.map((item) => item.despesas);

    const resultado = resultados.map((item) => item.resultado);

    // Resultado positivo em verde e negativo em vermelho
    const coresResultado = resultado.map((valor) =>
        valor < 0 ? "#EF4A37" : "#2E9D68"
    );

    if (graficoResultadoObras) {
        graficoResultadoObras.destroy();
    }

    graficoResultadoObras = new Chart(elemento, {

        type: "bar",

        data: {
            labels,

            datasets: [
                {
                    label: "Entradas",
                    data: entradas,
                    backgroundColor: "#283248",
                    borderRadius: 5
                },
                {
                    label: "Despesas operacionais",
                    data: despesas,
                    backgroundColor: "#F58634",
                    borderRadius: 5
                },
                {
                    label: "Resultado",
                    data: resultado,
                    backgroundColor: coresResultado,
                    borderRadius: 5
                }
            ]
        },

        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {
                legend: {
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {

                            return context.dataset.label + ": " +
                                context.parsed.x.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                });
                        }
                    }
                }
            },

            scales: {
                x: {
                    beginAtZero: true,

                    ticks: {
                        callback: function(valor) {
                            return valor.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                maximumFractionDigits: 0
                            });
                        }
                    }
                }
            }
        }
    });
}

// Calcula e atualiza o resumo financeiro
function renderizarResumoFinanceiro() {

    // Ignora movimentações estornadas
    const movimentacoesDoPeriodo = obterMovimentacoesDoPeriodo();

const movimentacoesAtivas = movimentacoesDoPeriodo.filter(
    (item) => item.status !== "estornada"
);

    // Total de entradas
    const totalEntradas = movimentacoesAtivas
        .filter((item) => item.tipo === "entrada")
        .reduce((total, item) => total + Number(item.valor), 0);

    // Total de todas as saídas
    const totalSaidas = movimentacoesAtivas
        .filter((item) => item.tipo === "saida")
        .reduce((total, item) => total + Number(item.valor), 0);

    // Despesas operacionais
    const despesasOperacionais = movimentacoesAtivas
        .filter((item) =>
            item.tipo === "saida" &&
            item.tipoDespesa === "operacional"
        )
        .reduce((total, item) => total + Number(item.valor), 0);

    // Despesas administrativas
    const despesasAdministrativas = movimentacoesAtivas
        .filter((item) =>
            item.tipo === "saida" &&
            item.tipoDespesa === "administrativa"
        )
        .reduce((total, item) => total + Number(item.valor), 0);

    // Saldo geral da empresa
    const saldo = totalEntradas - totalSaidas;

    
// =========================================
// INDICADORES OPERACIONAIS DO DASHBOARD
// =========================================

// 1. Contratos vigentes
const totalContratosAtivos = contratos.filter(
    (contrato) => contrato.status === "Vigente"
).length;

// 2. Diárias pendentes
const totalDiariasPendentes = diarias.filter(
    (diaria) => diaria.status === "Pendente"
).length;

// 3. Equipamentos alugados
const totalEquipamentosAlugados = locacoesMaquinario.filter(
    (locacao) => locacao.status === "Ativa"
).length;

// 4. Saldo pendente de maquinário
const saldoPendenteMaquinario = locacoesMaquinario
    .filter((locacao) => locacao.status === "Ativa")
    .reduce((total, locacao) => {

        const totalPago = pagamentosMaquinario
            .filter((pagamento) =>
                pagamento.locacaoId === locacao.id &&
                pagamento.status === "Pago"
            )
            .reduce((soma, pagamento) =>
                soma + Number(pagamento.valor || 0), 0
            );

        const saldo = Math.max(
            0,
            Number(locacao.custoPrevisto || 0) - totalPago
        );

        return total + saldo;

    }, 0);


    // Resultado agregado das obras
    const resultadoObras = totalEntradas - despesasOperacionais;

    // Atualiza os indicadores do resumo
    document.getElementById("total-entradas").textContent =
        formatarMoeda(totalEntradas);

    document.getElementById("total-saidas").textContent =
        formatarMoeda(totalSaidas);

    document.getElementById("saldo-atual").textContent =
        formatarMoeda(saldo);

    document.getElementById("total-operacionais").textContent =
        formatarMoeda(despesasOperacionais);

    document.getElementById("total-administrativas").textContent =
        formatarMoeda(despesasAdministrativas);

    document.getElementById("resultado-obras").textContent =
        formatarMoeda(resultadoObras);

    // Atualiza o saldo disponível no painel
document.getElementById("saldo-disponivel").textContent =
    formatarMoeda(saldo);

// Atualiza a quantidade de obras ativas
document.getElementById("total-obras-ativas").textContent =
    obrasEmAndamento.length;

    
// Atualiza os indicadores operacionais
document.getElementById("total-contratos-ativos").textContent =
    totalContratosAtivos;

document.getElementById("total-diarias-pendentes").textContent =
    totalDiariasPendentes;

document.getElementById("total-equipamentos-alugados").textContent =
    totalEquipamentosAlugados;

document.getElementById("saldo-pendente-maquinario").textContent =
    formatarMoeda(saldoPendenteMaquinario);


    // Atualiza o desempenho financeiro individual das obras
renderizarResultadosPorObra(movimentacoesDoPeriodo);

// Atualiza o gráfico de entradas e saídas
renderizarGraficoEntradasSaidas(movimentacoesAtivas);

renderizarGraficoDespesasPorCategoria(movimentacoesAtivas);

renderizarGraficoResultadoObras(movimentacoesAtivas);

}

// GERA O RELATÓRIO FINANCEIRO
function gerarRelatorioFinanceiro() {

    console.log("Botão Gerar relatório acionado!");
    // Recupera as movimentações do período selecionado
    const movimentacoesDoPeriodo = obterMovimentacoesDoPeriodo();

    // Ignora movimentações estornadas
    const movimentacoesAtivas = movimentacoesDoPeriodo.filter(
        (item) => item.status !== "estornada"
    );

    // Calcula os totais
    const entradas = movimentacoesAtivas
        .filter((item) => item.tipo === "entrada")
        .reduce((total, item) => total + Number(item.valor), 0);

    const saidas = movimentacoesAtivas
        .filter((item) => item.tipo === "saida")
        .reduce((total, item) => total + Number(item.valor), 0);

    const operacionais = movimentacoesAtivas
        .filter((item) =>
            item.tipo === "saida" &&
            item.tipoDespesa === "operacional"
        )
        .reduce((total, item) => total + Number(item.valor), 0);

    const administrativas = movimentacoesAtivas
        .filter((item) =>
            item.tipo === "saida" &&
            item.tipoDespesa === "administrativa"
        )
        .reduce((total, item) => total + Number(item.valor), 0);

    const saldo = entradas - saidas;
    const resultadoObras = entradas - operacionais;

    // Formata os valores em reais
    const moeda = (valor) =>
        Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    // Preenche os indicadores do relatório
    document.getElementById("relatorio-entradas").textContent = moeda(entradas);
    document.getElementById("relatorio-saidas").textContent = moeda(saidas);
    document.getElementById("relatorio-saldo").textContent = moeda(saldo);
    document.getElementById("relatorio-operacionais").textContent = moeda(operacionais);
    document.getElementById("relatorio-administrativas").textContent = moeda(administrativas);
    document.getElementById("relatorio-resultado-obras").textContent = moeda(resultadoObras);

    // Identifica o período selecionado
    const filtroPeriodo = document.getElementById("filtro-periodo");
    const periodoSelecionado =
        filtroPeriodo.options[filtroPeriodo.selectedIndex].text;

    let descricaoPeriodo = periodoSelecionado;

    if (filtroPeriodo.value === "personalizado") {
        const inicio = document.getElementById("filtro-data-inicio").value;
        const fim = document.getElementById("filtro-data-fim").value;

        descricaoPeriodo = `De ${inicio || "não informado"} até ${fim || "não informado"}`;
    }

    document.getElementById("relatorio-periodo").textContent =
        `Período: ${descricaoPeriodo}`;

    // Registra a data e hora de emissão
    document.getElementById("relatorio-emissao").textContent =
        `Emitido em: ${new Date().toLocaleString("pt-BR")}`;

    // Prepara o desempenho financeiro por obra
    const listaObras = document.getElementById("relatorio-lista-obras");

    listaObras.replaceChildren();

    obras.forEach((obra) => {

        const movimentacoesDaObra = movimentacoesAtivas.filter(
        (item) => item.obraId === obra.id
    );

    // Ignora obras sem movimentações no período
    if (movimentacoesDaObra.length === 0) {
        return;
    }

        const entradasObra = movimentacoesDaObra
            .filter((item) => item.tipo === "entrada")
            .reduce((total, item) => total + Number(item.valor), 0);

        const despesasObra = movimentacoesDaObra
            .filter((item) =>
                item.tipo === "saida" &&
                item.tipoDespesa === "operacional"
            )
            .reduce((total, item) => total + Number(item.valor), 0);

        const resultado = entradasObra - despesasObra;

        const cartao = document.createElement("div");
        cartao.className = "relatorio-obra-item";

        const titulo = document.createElement("h4");
        titulo.textContent = obra.nome;

        const textoEntradas = document.createElement("p");
        textoEntradas.textContent = `Entradas: ${moeda(entradasObra)}`;

        const textoDespesas = document.createElement("p");
        textoDespesas.textContent = `Despesas: ${moeda(despesasObra)}`;

        const textoResultado = document.createElement("p");
        textoResultado.textContent = `Resultado: ${moeda(resultado)}`;

        cartao.append(
            titulo,
            textoEntradas,
            textoDespesas,
            textoResultado
        );

        listaObras.appendChild(cartao);
    });

    // Exibe a área do relatório
const areaRelatorio = document.getElementById("area-relatorio");

areaRelatorio.hidden = false;

// Leva o usuário até o relatório
areaRelatorio.scrollIntoView({
    behavior: "smooth",
    block: "start"
});
}

// Calcula e apresenta o desempenho financeiro de cada obra
function renderizarResultadosPorObra(movimentacoesDoPeriodo) {

    const lista = document.getElementById("lista-resultados-obras");

    // Limpa os resultados anteriores
    lista.replaceChildren();

    // Verifica se existem obras cadastradas
    if (obras.length === 0) {
        lista.textContent = "Nenhuma obra cadastrada.";
        return;
    }

    // Percorre todas as obras cadastradas
    obras.forEach((obra) => {

        // Busca as movimentações vinculadas à obra
        const movimentacoesDaObra = movimentacoesDoPeriodo.filter((item) =>
    item.status !== "estornada" &&
    item.obraId === obra.id
);

        // Calcula as entradas da obra
        const entradas = movimentacoesDaObra
            .filter((item) => item.tipo === "entrada")
            .reduce((total, item) => total + Number(item.valor), 0);

        // Calcula somente as despesas operacionais
        const despesas = movimentacoesDaObra
            .filter((item) =>
                item.tipo === "saida" &&
                item.tipoDespesa === "operacional"
            )
            .reduce((total, item) => total + Number(item.valor), 0);

        // Calcula o resultado financeiro da obra
        const resultado = entradas - despesas;

        // Cria o cartão da obra
        const cartao = document.createElement("div");
        cartao.classList.add("resultado-obra-card");

        // Nome da obra
        const titulo = document.createElement("h4");
        titulo.textContent = obra.nome;

        // Entradas
        const textoEntradas = document.createElement("p");
        textoEntradas.textContent =
            `Entradas: ${formatarMoeda(entradas)}`;

        // Despesas
        const textoDespesas = document.createElement("p");
        textoDespesas.textContent =
            `Despesas operacionais: ${formatarMoeda(despesas)}`;

        // Resultado
        const textoResultado = document.createElement("p");
        textoResultado.textContent =
            `Resultado: ${formatarMoeda(resultado)}`;

        // Destaca resultado positivo ou negativo
        textoResultado.classList.add(
            resultado < 0 ? "resultado-negativo" : "resultado-positivo"
        );

        // Adiciona os elementos ao cartão
        cartao.append(
            titulo,
            textoEntradas,
            textoDespesas,
            textoResultado
        );

        // Informa quando ainda não existem movimentações
        if (movimentacoesDaObra.length === 0) {
            const aviso = document.createElement("small");
            aviso.textContent = "Sem movimentações registradas.";
            cartao.appendChild(aviso);
        }

        // Adiciona o cartão à lista
        lista.appendChild(cartao);
    });

}

    // Elementos dos filtros financeiros
const campoFiltroPeriodo = document.getElementById("filtro-periodo");
const campoDataInicio = document.getElementById("filtro-data-inicio");
const campoDataFim = document.getElementById("filtro-data-fim");

const botaoAplicarFiltro = document.getElementById("btn-aplicar-filtro");
const botaoLimparFiltro = document.getElementById("btn-limpar-filtro");


// Habilita as datas somente no filtro personalizado
function atualizarCamposFiltroPeriodo() {

    const personalizado = campoFiltroPeriodo.value === "personalizado";

    campoDataInicio.disabled = !personalizado;
    campoDataFim.disabled = !personalizado;
}

console.log("Período selecionado:", campoFiltroPeriodo.value);
console.log("Personalizado:", campoFiltroPeriodo.value === "personalizado");

// Monitora a seleção do período
campoFiltroPeriodo.addEventListener("change", atualizarCamposFiltroPeriodo);


// Aplica o filtro selecionado
botaoAplicarFiltro.addEventListener("click", () => {

    if (campoFiltroPeriodo.value === "personalizado") {

        const inicio = campoDataInicio.value;
        const fim = campoDataFim.value;

        if (!inicio || !fim) {
            alert("Informe a data inicial e a data final.");
            return;
        }

        if (inicio > fim) {
            alert("A data inicial não pode ser posterior à data final.");
            return;
        }
    }

    renderizarResumoFinanceiro();
});


// Limpa o filtro e retorna ao período completo
botaoLimparFiltro.addEventListener("click", () => {

    campoFiltroPeriodo.value = "todos";

    campoDataInicio.value = "";
    campoDataFim.value = "";

    atualizarCamposFiltroPeriodo();

    renderizarResumoFinanceiro();
});


// Configuração inicial dos campos
atualizarCamposFiltroPeriodo();


// Exibe o histórico de movimentações financeiras
function renderizarMovimentacoes() {

    const lista = document.getElementById("lista-movimentacoes");

    lista.innerHTML = "";

    if (movimentacoes.length === 0) {
        lista.textContent = "Nenhuma movimentação cadastrada.";
        return;
    }

    const movimentacoesOrdenadas = [...movimentacoes].sort((a, b) => {
        return b.data.localeCompare(a.data);
    });

    movimentacoesOrdenadas.forEach((item) => {

        const cliente = buscarClientePorId(item.clienteId);

        const obra = obras.find((obra) => {
            return obra.id === item.obraId;
        });

        const cartao = document.createElement("div");
        cartao.classList.add("cliente-card");

        const titulo = document.createElement("h3");
        titulo.textContent =
            `${item.tipo === "entrada" ? "Entrada" : "Saída"} — ${item.descricao}`;

        const data = document.createElement("p");
        data.textContent = `Data: ${formatarData(item.data)}`;

        const nomeCliente = document.createElement("p");
        nomeCliente.textContent =
            `Cliente: ${cliente ? cliente.nome : "Não informado"}`;

        const nomeObra = document.createElement("p");
        nomeObra.textContent =
            `Obra: ${obra ? obra.nome : "Não informada"}`;

        const categoria = document.createElement("p");
        categoria.textContent = `Categoria: ${item.categoria}`;

        const fornecedor = document.createElement("p");
        fornecedor.textContent =
            `Fornecedor / Pagador: ${item.fornecedor || "Não informado"}`;

        const pagamento = document.createElement("p");
        pagamento.textContent = `Pagamento: ${item.pagamento}`;

        const documento = document.createElement("p");
        documento.textContent =
            `Documento: ${item.documento || "Não informado"}`;

        const valor = document.createElement("strong");
        valor.textContent = formatarMoeda(item.valor);

        valor.classList.add(
            item.tipo === "entrada" ? "valor-entrada" : "valor-saida"
        );

        const status = document.createElement("p");

        status.textContent =
            item.status === "estornada"
                ? `Status: Estornada — ${item.motivoEstorno}`
                : "Status: Ativa";

        cartao.append(
            titulo,
            data,
            nomeCliente,
            nomeObra,
            categoria,
            fornecedor,
            pagamento,
            documento,
            valor,
            status
        );

        // Exibe os botões somente para movimentações ativas
        if (item.status !== "estornada") {

            const botaoEditar = document.createElement("button");
            botaoEditar.type = "button";
            botaoEditar.textContent = "Editar movimentação";
            botaoEditar.classList.add("botao-editar");

            botaoEditar.addEventListener("click", () => {

                movimentacaoEmEdicaoId = item.id;

                document.getElementById("movimentacao-tipo").value = item.tipo;
                document.getElementById("movimentacao-tipo-despesa").value =
    item.tipoDespesa || "";
                document.getElementById("movimentacao-data").value = item.data;
                document.getElementById("movimentacao-cliente").value =
                    item.clienteId || "";
                
                atualizarCamposMovimentacao();

                filtrarObrasDaMovimentacao();

                document.getElementById("movimentacao-obra").value =
                    item.obraId || "";

                document.getElementById("movimentacao-descricao").value =
                    item.descricao;

                document.getElementById("movimentacao-categoria").value =
                    item.categoria;

                document.getElementById("movimentacao-fornecedor").value =
                    item.fornecedor || "";

                document.getElementById("movimentacao-valor").value =
                    item.valor;

                document.getElementById("movimentacao-pagamento").value =
                    item.pagamento;

                document.getElementById("movimentacao-documento").value =
                    item.documento || "";

                const formulario = document.getElementById("form-movimentacao");

                formulario.querySelector("h3").textContent =
                    "Editar movimentação";

                formulario.querySelector('button[type="submit"]').textContent =
                    "Salvar alterações";

                    botaoCancelarEdicaoMovimentacao.hidden = false;

                formulario.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            const botaoEstornar = document.createElement("button");
            botaoEstornar.type = "button";
            botaoEstornar.textContent = "Estornar";
            botaoEstornar.classList.add("botao-excluir");

            botaoEstornar.addEventListener("click", () => {

                const motivo = prompt(
                    "Informe o motivo do estorno desta movimentação:"
                );

                if (motivo === null) {
                    return;
                }

                if (motivo.trim() === "") {
                    alert("O motivo do estorno é obrigatório.");
                    return;
                }

                const confirmar = confirm(
                    `Confirma o estorno de ${formatarMoeda(item.valor)}?`
                );

                if (!confirmar) {
                    return;
                }

                item.status = "estornada";
                item.motivoEstorno = motivo.trim();
                item.dataEstorno = new Date().toISOString();

                registrarHistoricoMovimentacao(
                    item,
                    "Movimentação estornada",
                    {
                        motivo: motivo.trim(),
                        valorEstornado: item.valor
                    }
                );

                salvarMovimentacoes();

                renderizarMovimentacoes();
                renderizarResumoFinanceiro();

                alert("Movimentação estornada com sucesso!");
            });

            cartao.append(botaoEditar, botaoEstornar);
        }

        // Histórico de auditoria
        const tituloHistorico = document.createElement("h4");
        tituloHistorico.textContent = "Histórico de auditoria";

        const listaHistorico = document.createElement("ul");

        const historico = Array.isArray(item.historico)
            ? item.historico
            : [];

        if (historico.length === 0) {

            const registro = document.createElement("li");
            registro.textContent = "Nenhum acontecimento registrado.";
            listaHistorico.appendChild(registro);

        } else {

            historico.forEach((registro) => {

                const linha = document.createElement("li");

                const dataRegistro = registro.data
                    ? new Date(registro.data).toLocaleString("pt-BR")
                    : "Data não informada";

                linha.textContent =
                    `${registro.acao} — ${dataRegistro}`;

                if (registro.motivo) {
                    linha.textContent += ` | Motivo: ${registro.motivo}`;
                }

                if (registro.usuario) {
                    linha.textContent += ` | Responsável: ${registro.usuario}`;
                }

                if (registro.alteracoes) {
                    linha.textContent +=
                        ` | Alterações: ${registro.alteracoes}`;
                }

                listaHistorico.appendChild(linha);
            });
        }

        cartao.append(tituloHistorico, listaHistorico);

        lista.appendChild(cartao);
    });
}

// Registra uma nova movimentação
const formMovimentacao = document.getElementById("form-movimentacao");

const grupoTipoDespesa = document.getElementById("grupo-tipo-despesa");
const campoTipoDespesa = document.getElementById("movimentacao-tipo-despesa");
const campoTipo = document.getElementById("movimentacao-tipo");
const campoCliente = document.getElementById("movimentacao-cliente");
const campoObra = document.getElementById("movimentacao-obra");

// Atualiza os campos conforme o tipo de movimentação
function atualizarCamposMovimentacao() {

    const tipo = campoTipo.value;
    const tipoDespesa = campoTipoDespesa.value;

    const ehSaida = tipo === "saida";
    const ehEntrada = tipo === "entrada";
    const exigeVinculo = ehEntrada ||
        (ehSaida && tipoDespesa === "operacional");

    // Exibe a classificação somente nas saídas
    grupoTipoDespesa.hidden = !ehSaida;
    campoTipoDespesa.required = ehSaida;

    // Cliente e obra são obrigatórios quando existe vínculo
    campoCliente.required = exigeVinculo;
    campoObra.required = exigeVinculo;

    // Entrada não utiliza classificação de despesa
    if (!ehSaida) {
        campoTipoDespesa.value = "";
    }

    // Despesa administrativa não possui vínculo com obra
    if (ehSaida && tipoDespesa === "administrativa") {
        campoCliente.value = "";
        filtrarObrasDaMovimentacao();
    }
}

// Monitora as mudanças dos campos
campoTipo.addEventListener("change", atualizarCamposMovimentacao);
campoTipoDespesa.addEventListener("change", atualizarCamposMovimentacao);

// Estado inicial do formulário
atualizarCamposMovimentacao();

formMovimentacao.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const tipo = document.getElementById("movimentacao-tipo").value;
    const tipoDespesa = document.getElementById("movimentacao-tipo-despesa").value;
    const data = document.getElementById("movimentacao-data").value;
    const clienteId = document.getElementById("movimentacao-cliente").value;
    const obraId = document.getElementById("movimentacao-obra").value;
    const descricao = document.getElementById("movimentacao-descricao").value.trim();
    const categoria = document.getElementById("movimentacao-categoria").value;
    const fornecedor = document.getElementById("movimentacao-fornecedor").value.trim();
    const valor = Number(document.getElementById("movimentacao-valor").value);
    const pagamento = document.getElementById("movimentacao-pagamento").value;
    const documento = document.getElementById("movimentacao-documento").value.trim();

    if (tipo !== "entrada" && tipo !== "saida") {
        alert("Selecione um tipo de movimentação válido.");
        return;
    }

    
// CLASSIFICAÇÃO E VALIDAÇÃO DO VÍNCULO

let exigeVinculo = false;

if (tipo === "entrada") {

    exigeVinculo = true;

} else {

    if (tipoDespesa !== "operacional" &&
        tipoDespesa !== "administrativa") {

        alert("Selecione a classificação da despesa.");
        return;
    }

    exigeVinculo = tipoDespesa === "operacional";
}

// VALIDA CLIENTE E OBRA QUANDO NECESSÁRIO

if (exigeVinculo) {

    const clienteExistente = buscarClientePorId(clienteId);

    if (!clienteExistente) {
        alert("Selecione um cliente válido.");
        return;
    }

    const obraExistente = obras.find((obra) => {
        return obra.id === obraId;
    });

    if (!obraExistente) {
        alert("Selecione uma obra válida.");
        return;
    }

    if (obraExistente.clienteId !== clienteId) {
        alert("A obra selecionada não pertence ao cliente informado.");
        return;
    }
}


    const dadosNovos = {
    tipo,
    tipoDespesa: tipo === "saida" ? tipoDespesa : null,
    data,
    clienteId: exigeVinculo ? clienteId : null,
    obraId: exigeVinculo ? obraId : null,
        descricao,
        categoria,
        fornecedor,
        valor,
        pagamento,
        documento
    };

    // EDIÇÃO DE MOVIMENTAÇÃO
    if (movimentacaoEmEdicaoId) {

        const movimentacaoOriginal = movimentacoes.find((item) => {
            return item.id === movimentacaoEmEdicaoId;
        });

        if (!movimentacaoOriginal || movimentacaoOriginal.status === "estornada") {
            alert("Esta movimentação não pode ser editada.");
            cancelarEdicaoMovimentacao();
            return;
        }

        const camposMonitorados = [
            "tipo",
            "tipoDespesa",
            "data",
            "clienteId",
            "obraId",
            "descricao",
            "categoria",
            "fornecedor",
            "valor",
            "pagamento",
            "documento"
        ];

        const alteracoes = [];

        camposMonitorados.forEach((campo) => {

            if (movimentacaoOriginal[campo] !== dadosNovos[campo]) {

                alteracoes.push(
                    `${campo}: "${movimentacaoOriginal[campo] ?? ""}" → "${dadosNovos[campo] ?? ""}"`
                );
            }
        });

        if (alteracoes.length === 0) {
            alert("Nenhuma alteração foi realizada.");
            cancelarEdicaoMovimentacao();
            return;
        }

        registrarHistoricoMovimentacao(
            movimentacaoOriginal,
            "Movimentação editada",
            {
                alteracoes: alteracoes.join("; ")
            }
        );

        Object.assign(movimentacaoOriginal, dadosNovos);

        alert("Movimentação atualizada com sucesso!");

    } else {

        // NOVO CADASTRO
        const novaMovimentacao = {
            id: crypto.randomUUID(),
            ...dadosNovos,
            status: "ativa",
            dataRegistro: new Date().toISOString(),
            historico: []
        };

        registrarHistoricoMovimentacao(
            novaMovimentacao,
            "Movimentação cadastrada",
            {
                valorInicial: valor
            }
        );

        movimentacoes.push(novaMovimentacao);

        alert("Movimentação registrada com sucesso!");
    }

    salvarMovimentacoes();

    renderizarMovimentacoes();
    renderizarResumoFinanceiro();

    cancelarEdicaoMovimentacao();
});

function cancelarEdicaoMovimentacao() {

    movimentacaoEmEdicaoId = null;

    botaoCancelarEdicaoMovimentacao.hidden = true;

    formMovimentacao.reset();

    atualizarCamposMovimentacao();

    formMovimentacao.querySelector("h3").textContent =
        "Registrar movimentação";

    formMovimentacao.querySelector('button[type="submit"]').textContent =
        "Registrar movimentação";

    filtrarObrasDaMovimentacao();
}

const botaoCancelarEdicaoMovimentacao = document.createElement("button");

botaoCancelarEdicaoMovimentacao.type = "button";
botaoCancelarEdicaoMovimentacao.textContent = "Cancelar edição";
botaoCancelarEdicaoMovimentacao.classList.add("botao-cancelar-edicao");
botaoCancelarEdicaoMovimentacao.hidden = true;

formMovimentacao.querySelector('button[type="submit"]')
    .insertAdjacentElement("afterend", botaoCancelarEdicaoMovimentacao);

botaoCancelarEdicaoMovimentacao.addEventListener("click", () => {
    cancelarEdicaoMovimentacao();
});


// Registra acontecimentos no histórico do contrato
function registrarHistoricoContrato(contrato, acao, detalhes = {}) {

    // Garante que o contrato tenha uma lista de histórico
    if (!Array.isArray(contrato.historico)) {
        contrato.historico = [];
    }

    // Cria um novo registro de auditoria
    const registro = {
        id: crypto.randomUUID(),
        acao: acao,
        data: new Date().toISOString(),
        usuario: "Usuário local (sem autenticação)",
        ...detalhes
    };

    // Acrescenta o registro sem apagar os anteriores
    contrato.historico.push(registro);
}


// Compara os dados antigos com os novos
function registrarAlteracoesContrato(contrato, dadosNovos) {

    const camposMonitorados = [
        { campo: "numero", nome: "Número do contrato" },
        { campo: "clienteId", nome: "Cliente" },
        { campo: "obraId", nome: "Obra" },
        { campo: "descricao", nome: "Descrição" },
        { campo: "dataAssinatura", nome: "Data de assinatura" },
        { campo: "inicioVigencia", nome: "Início da vigência" },
        { campo: "fimVigencia", nome: "Fim da vigência" },
        { campo: "valor", nome: "Valor do contrato" },
        { campo: "status", nome: "Status" },
        { campo: "observacoes", nome: "Observações" }
    ];

    const alteracoes = [];

    camposMonitorados.forEach((item) => {

        const valorAnterior = contrato[item.campo];
        const valorNovo = dadosNovos[item.campo];

        if (valorAnterior !== valorNovo) {

            alteracoes.push({
                campo: item.nome,
                valorAnterior: valorAnterior ?? "",
                valorNovo: valorNovo ?? ""
            });
        }
    });

    if (alteracoes.length > 0) {

        registrarHistoricoContrato(
            contrato,
            "Contrato atualizado",
            { alteracoes: alteracoes }
        );
    }
}

function calcularSituacaoVigencia(contrato) {
    const status = (contrato.status || "").trim().toLowerCase();

    // Situações administrativas que não devem ser recalculadas.
    if (status === "cancelado") {
        return "Não aplicável — contrato cancelado";
    }

    if (status === "encerrado") {
        return "Não aplicável — contrato encerrado";
    }

    if (!contrato.inicioVigencia || !contrato.fimVigencia) {
        return "Datas não informadas";
    }

    const [anoInicio, mesInicio, diaInicio] =
        contrato.inicioVigencia.split("-").map(Number);

    const [anoFim, mesFim, diaFim] =
        contrato.fimVigencia.split("-").map(Number);

    const inicio = new Date(anoInicio, mesInicio - 1, diaInicio);
    const fim = new Date(anoFim, mesFim - 1, diaFim);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Validação das datas.
    if (
        Number.isNaN(inicio.getTime()) ||
        Number.isNaN(fim.getTime()) ||
        inicio > fim
    ) {
        return "Datas inválidas";
    }

    if (hoje > fim) {
        return "Vencido";
    }

    if (hoje < inicio) {
        return "Aguardando início";
    }

    const diasRestantes = Math.ceil(
        (fim - hoje) / (1000 * 60 * 60 * 24)
    );

    if (diasRestantes <= 30) {
        return `Próximo do vencimento (${diasRestantes} dias)`;
    }

    return "Vigente";
}


function obterClasseVigencia(situacao) {

    if (situacao === "Vigente") {
        return "vigencia-ok";
    }

    if (situacao.startsWith("Próximo do vencimento")) {
        return "vigencia-alerta";
    }

    if (situacao === "Vencido") {
        return "vigencia-vencida";
    }

    if (situacao === "Aguardando início") {
        return "vigencia-futura";
    }

    if (situacao.includes("cancelado") || situacao.includes("encerrado")) {
        return "vigencia-inativa";
    }

    return "vigencia-indefinida";
}


function renderizarResumoContratos() {

    const resumo = document.getElementById("resumo-contratos");

    const indicadores = [
        { titulo: "Total", classe: "resumo-total" },
        { titulo: "Vigentes", classe: "resumo-vigente" },
        { titulo: "Próximos do vencimento", classe: "resumo-alerta" },
        { titulo: "Vencidos", classe: "resumo-vencido" },
        { titulo: "Aguardando início", classe: "resumo-futuro" },
        { titulo: "Encerrados / Cancelados", classe: "resumo-inativo" }
    ];

    const quantidades = {
        "Total": contratos.length,
        "Vigentes": 0,
        "Próximos do vencimento": 0,
        "Vencidos": 0,
        "Aguardando início": 0,
        "Encerrados / Cancelados": 0
    };

    contratos.forEach((contrato) => {

        const situacao = calcularSituacaoVigencia(contrato);

        if (situacao === "Vigente") {
            quantidades["Vigentes"]++;
        } else if (situacao.startsWith("Próximo do vencimento")) {
            quantidades["Próximos do vencimento"]++;
        } else if (situacao === "Vencido") {
            quantidades["Vencidos"]++;
        } else if (situacao === "Aguardando início") {
            quantidades["Aguardando início"]++;
        } else if (
            situacao.includes("cancelado") ||
            situacao.includes("encerrado")
        ) {
            quantidades["Encerrados / Cancelados"]++;
        }
    });

    resumo.innerHTML = "";

    indicadores.forEach((indicador) => {

        const cartao = document.createElement("div");
        cartao.classList.add("resumo-card", indicador.classe);

        const titulo = document.createElement("p");
        titulo.textContent = indicador.titulo;

        const quantidade = document.createElement("strong");
        quantidade.textContent = quantidades[indicador.titulo];

        cartao.append(titulo, quantidade);
        resumo.appendChild(cartao);
    });
}


function renderizarContratos() {
    const listaContratos = document.getElementById("lista-contratos");

    listaContratos.innerHTML = "";

    if (contratos.length === 0) {
        listaContratos.textContent = "Nenhum contrato cadastrado.";
        return;
    }

    contratos.forEach((contrato) => {

        const cliente = buscarClientePorId(contrato.clienteId);
        const obra = obras.find((item) => item.id === contrato.obraId);

        const cartao = document.createElement("div");
        cartao.classList.add("cliente-card");

        const botaoEditar = document.createElement("button");

        // Botão para cancelar contrato
        const botaoCancelarContrato = document.createElement("button");

        botaoCancelarContrato.addEventListener("click", () => {

    // Verifica se o contrato já foi cancelado ou encerrado
    const statusAtual = (contrato.status || "").trim().toLowerCase();

    if (statusAtual === "cancelado" || statusAtual === "encerrado") {
        alert("Este contrato já está cancelado ou encerrado.");
        return;
    }

    // Solicita o motivo do cancelamento
    const motivo = prompt("Informe o motivo do cancelamento do contrato:");

    if (motivo === null) {
        return;
    }

    if (motivo.trim() === "") {
        alert("O motivo do cancelamento é obrigatório.");
        return;
    }

    // Solicita confirmação
    const confirmar = confirm(
        `Confirma o cancelamento do contrato ${contrato.numero}?`
    );

    if (!confirmar) {
        return;
    }

    // Registra a data e hora
    const dataCancelamento = new Date().toISOString();

    // Atualiza os dados do contrato
contrato.status = "Cancelado";
contrato.motivoCancelamento = motivo.trim();
contrato.dataCancelamento = dataCancelamento;

// Registra o cancelamento no histórico
registrarHistoricoContrato(
    contrato,
    "Contrato cancelado",
    {
        motivo: motivo.trim()
    }
);
  

    // Salva e atualiza a tela
    salvarContratos();
    renderizarResumoContratos();
    renderizarContratos();

    alert("Contrato cancelado com sucesso!");

});

        botaoCancelarContrato.textContent = "Cancelar contrato";
        botaoCancelarContrato.classList.add("botao-cancelar-edicao");

        botaoEditar.textContent = "Editar contrato";
        botaoEditar.classList.add("botao-editar");

        const numero = document.createElement("h3");
        numero.textContent = `Contrato: ${contrato.numero}`;

        const nomeCliente = document.createElement("p");
        nomeCliente.textContent = `Cliente: ${cliente ? cliente.nome : "Não identificado"}`;

        const nomeObra = document.createElement("p");
        nomeObra.textContent = `Obra: ${obra ? obra.nome : "Não identificada"}`;

        const descricao = document.createElement("p");
        descricao.textContent = `Objeto: ${contrato.descricao || "Não informado"}`;

        const valor = document.createElement("p");
        valor.textContent = `Valor: ${Number(contrato.valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}`;

        botaoEditar.addEventListener("click", () => {

    // Guarda o ID do contrato selecionado
    contratoEmEdicaoId = contrato.id;

    // Preenche os campos do formulário
    document.getElementById("contrato-numero").value = contrato.numero;

    document.getElementById("contrato-cliente").value = contrato.clienteId;

    // Atualiza as obras disponíveis para o cliente selecionado
    filtrarObrasDoContrato();

    document.getElementById("contrato-obra").value = contrato.obraId;

    document.getElementById("contrato-descricao").value = contrato.descricao || "";

    document.getElementById("contrato-assinatura").value = contrato.dataAssinatura || "";

    document.getElementById("contrato-inicio").value = contrato.inicioVigencia || "";

    document.getElementById("contrato-fim").value = contrato.fimVigencia || "";

    document.getElementById("contrato-valor").value = contrato.valor;

    document.getElementById("contrato-status").value = contrato.status;

    document.getElementById("contrato-observacoes").value = contrato.observacoes || "";

    // Altera o título do formulário
    formContrato.querySelector("h3").textContent = "Editar contrato";

    // Altera o texto do botão de envio
    formContrato.querySelector('button[type="submit"]').textContent = "Atualizar contrato";

    botaoCancelarEdicao.hidden = false;
    
    // Leva o usuário até o formulário
    formContrato.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

        const assinatura = document.createElement("p");
        assinatura.textContent = `Assinatura: ${formatarData(contrato.dataAssinatura)}`;

        const inicio = document.createElement("p");
        inicio.textContent = `Início da vigência: ${formatarData(contrato.inicioVigencia)}`;

        const fim = document.createElement("p");
        fim.textContent = `Fim da vigência: ${formatarData(contrato.fimVigencia)}`;

        
        const statusCadastrado = document.createElement("p");
        statusCadastrado.textContent =
        `Status cadastrado: ${contrato.status || "Não informado"}`;

        
        const situacaoVigencia = document.createElement("p");

        const situacao = calcularSituacaoVigencia(contrato);

        situacaoVigencia.textContent = `Situação da vigência: ${situacao}`;

        situacaoVigencia.classList.add(
        "indicador-vigencia",
        obterClasseVigencia(situacao)
        );

        const observacoes = document.createElement("p");
        observacoes.textContent = `Observações: ${contrato.observacoes || "Nenhuma"}`;
        
// Área de histórico do contrato
const areaHistorico = document.createElement("div");
areaHistorico.classList.add("historico-contrato");

const tituloHistorico = document.createElement("h4");
tituloHistorico.textContent = "Histórico de auditoria";

const listaHistorico = document.createElement("ul");

// Recupera os registros existentes
const historico = Array.isArray(contrato.historico)
    ? contrato.historico
    : [];

if (historico.length === 0) {

    const item = document.createElement("li");
    item.textContent = "Nenhum acontecimento registrado.";

    listaHistorico.appendChild(item);

} else {

    historico.forEach((registro) => {

    const item = document.createElement("li");

    const dataEvento = registro.data
        ? new Date(registro.data).toLocaleString("pt-BR")
        : "Data não informada";

    let descricao = `${registro.acao} - ${dataEvento}`;

    if (registro.motivo) {
        descricao += ` | Motivo: ${registro.motivo}`;
    }

    if (registro.usuario) {
        descricao += ` | Responsável: ${registro.usuario}`;
    }

    item.textContent = descricao;

    // Exibe os detalhes das alterações realizadas
    if (Array.isArray(registro.alteracoes) &&
        registro.alteracoes.length > 0) {

        const listaAlteracoes = document.createElement("ul");

        registro.alteracoes.forEach((alteracao) => {

            const detalhe = document.createElement("li");

            const valorAnterior =
                alteracao.valorAnterior === ""
                    ? "Não informado"
                    : alteracao.valorAnterior;

            const valorNovo =
                alteracao.valorNovo === ""
                    ? "Não informado"
                    : alteracao.valorNovo;

            detalhe.textContent =
                `${alteracao.campo}: de "${valorAnterior}" para "${valorNovo}"`;

            listaAlteracoes.appendChild(detalhe);
        });

        item.appendChild(listaAlteracoes);
    }

    listaHistorico.appendChild(item);
});
}

areaHistorico.append(tituloHistorico, listaHistorico);

        cartao.append(
            numero,
            nomeCliente,
            nomeObra,
            descricao,
            valor,
            assinatura,
            inicio,
            fim,
            statusCadastrado,
            situacaoVigencia,
            observacoes,
            areaHistorico
        );

// Verifica a situação atual do contrato
const statusContrato = (contrato.status || "").trim().toLowerCase();

const contratoFinalizado =
    statusContrato === "cancelado" ||
    statusContrato === "encerrado";

// Só exibe os botões para contratos que ainda podem ser administrados
if (!contratoFinalizado) {
    cartao.append(botaoEditar, botaoCancelarContrato);
}

        listaContratos.appendChild(cartao);

        

    });
}


const selectClienteContrato = document.getElementById("contrato-cliente");

selectClienteContrato.addEventListener("change", filtrarObrasDoContrato);

// Atualiza as obras quando o cliente de Movimentações for alterado
const selectClienteMovimentacao = document.getElementById("movimentacao-cliente");

selectClienteMovimentacao.addEventListener("change", filtrarObrasDaMovimentacao);

// Captura o formulário de contratos
const formContrato = document.getElementById("form-contrato");

const campoNumeroContrato = document.getElementById("contrato-numero");

// Gera o próximo número de contrato
function gerarProximoNumeroContrato() {

    const anoAtual = new Date().getFullYear();

    const prefixo = `CT-${anoAtual}-`;

    const numerosExistentes = contratos.map((contrato) => {

        const numero = String(contrato.numero);

        if (!numero.startsWith(prefixo)) {
            return 0;
        }

        return Number(numero.replace(prefixo, ""));

    });

    const maiorNumero = Math.max(0, ...numerosExistentes);

    const proximoNumero = maiorNumero + 1;

    return `${prefixo}${String(proximoNumero).padStart(3, "0")}`;
}


// Preenche e protege o campo do número
function preencherProximoNumeroContrato() {

    campoNumeroContrato.value = gerarProximoNumeroContrato();

    campoNumeroContrato.readOnly = true;

}

// Guarda o ID do contrato que está sendo editado
let contratoEmEdicaoId = null;

// Cria o botão para cancelar a edição
const botaoCancelarEdicao = document.createElement("button");

botaoCancelarEdicao.type = "button";
botaoCancelarEdicao.textContent = "Cancelar edição";
botaoCancelarEdicao.classList.add("botao-cancelar-edicao");

// Inicialmente, o botão fica oculto
botaoCancelarEdicao.hidden = true;

// Insere o botão depois do botão de cadastro
formContrato.querySelector('button[type="submit"]')
    .insertAdjacentElement("afterend", botaoCancelarEdicao);

    function cancelarEdicaoContrato() {

    // Sai do modo de edição
    contratoEmEdicaoId = null;

    // Limpa os campos do formulário
    formContrato.reset();

    // Restaura o título
    formContrato.querySelector("h3").textContent =
        "Cadastrar Novo Contrato";

    // Restaura o texto do botão principal
    formContrato.querySelector('button[type="submit"]').textContent =
        "Cadastrar contrato";

    // Oculta o botão de cancelar edição
    botaoCancelarEdicao.hidden = true;

    // Gera o próximo número automaticamente
    preencherProximoNumeroContrato();

    // Restaura a seleção de obras
    filtrarObrasDoContrato();

}

botaoCancelarEdicao.addEventListener("click", () => {
    cancelarEdicaoContrato();
});

// Escuta o envio do formulário
formContrato.addEventListener("submit", (evento) => {

    // Impede o recarregamento da página
    evento.preventDefault();

        // Captura os valores digitados no formulário
    const numero = document.getElementById("contrato-numero").value.trim();

    const clienteId = document.getElementById("contrato-cliente").value;

    const obraId = document.getElementById("contrato-obra").value;

    const descricao = document.getElementById("contrato-descricao").value.trim();

    const dataAssinatura = document.getElementById("contrato-assinatura").value;

    const inicioVigencia = document.getElementById("contrato-inicio").value;

    const fimVigencia = document.getElementById("contrato-fim").value;

    const valor = Number(document.getElementById("contrato-valor").value);

    const status = document.getElementById("contrato-status").value;

    const observacoes = document.getElementById("contrato-observacoes").value.trim();

    // Normaliza o número do contrato
const numeroNormalizado = numero.trim().toLowerCase();

// Verifica se já existe outro contrato com esse número
const contratoExistente = contratos.find((contrato) => {

    return (
        String(contrato.numero).trim().toLowerCase() === numeroNormalizado &&
        contrato.id !== contratoEmEdicaoId
    );

});

if (contratoExistente) {
    alert("Já existe um contrato cadastrado com esse número.");
    return;
}

        // Verifica se o cliente existe
    const clienteExistente = buscarClientePorId(clienteId);

    if (!clienteExistente) {
        alert("Selecione um cliente válido.");
        return;
    }

    // Verifica se a obra existe
    const obraExistente = obras.find((obra) => {
        return obra.id === obraId;
    });

    if (!obraExistente) {
        alert("Selecione uma obra válida.");
        return;
    }

    // Verifica se a obra pertence ao cliente selecionado
    if (obraExistente.clienteId !== clienteId) {
        alert("A obra selecionada não pertence ao cliente informado.");
        return;
    }

        // Valida o valor contratado
    if (!Number.isFinite(valor) || valor <= 0) {
        alert("Informe um valor válido para o contrato.");
        return;
    }

    // Valida as datas
    if (!dataAssinatura || !inicioVigencia || !fimVigencia) {
        alert("Preencha todas as datas do contrato.");
        return;
    }

    if (dataAssinatura > fimVigencia) {
        alert("A data de assinatura não pode ser posterior ao fim da vigência.");
        return;
    }

    if (inicioVigencia > fimVigencia) {
        alert("O início da vigência não pode ser posterior ao fim.");
        return;
    }

    

if (contratoEmEdicaoId) {

    // Localiza o contrato que está sendo editado
    const contratoOriginal = contratos.find((contrato) => {
        return contrato.id === contratoEmEdicaoId;
    });

    if (!contratoOriginal) {
        alert("Contrato não encontrado!");
        return;
    }

    // Reúne os novos dados informados no formulário
    const dadosNovos = {
        numero,
        clienteId,
        obraId,
        descricao,
        dataAssinatura,
        inicioVigencia,
        fimVigencia,
        valor,
        status,
        observacoes
    };

    // Compara os dados antigos com os novos
    registrarAlteracoesContrato(contratoOriginal, dadosNovos);

    // Atualiza o contrato sem alterar seu ID ou histórico
    Object.assign(contratoOriginal, dadosNovos);

    alert("Contrato atualizado com sucesso!");

} else {

    // Cria um novo contrato
    const novoContrato = {
        id: crypto.randomUUID(),
        numero,
        clienteId,
        obraId,
        descricao,
        dataAssinatura,
        inicioVigencia,
        fimVigencia,
        valor,
        status,
        observacoes
    };

    contratos.push(novoContrato);

    // Registra a criação no histórico
registrarHistoricoContrato(
    novoContrato,
    "Contrato cadastrado");

    alert("Contrato cadastrado com sucesso!");
}

// Salva os dados
salvarContratos();

// Atualiza os indicadores e a listagem
renderizarResumoContratos();
renderizarContratos();

// Restaura o formulário ao modo de cadastro
cancelarEdicaoContrato();

});


function renderizarObras() {
    const listaObras = document.getElementById("lista-obras");

    listaObras.innerHTML = "";

    if (obras.length === 0) {
        listaObras.textContent = "Nenhuma obra cadastrada.";
        return;
    }

    obras.forEach((obra) => {

        const cartao = document.createElement("div");
        cartao.classList.add("cliente-card");

        const nome = document.createElement("h3");
        nome.textContent = obra.nome;

        const cliente = clientes.find((item) => {
            return item.id === obra.clienteId;
        });

        const nomeCliente = document.createElement("p");
        nomeCliente.textContent = `Cliente: ${cliente ? cliente.nome : "Não identificado"}`;

        const status = document.createElement("p");
        status.textContent = `Status: ${obra.status}`;

        // Variável disponível em todo o bloco
        let botaoCancelar = null;

        // Só permite cancelar obras não concluídas ou canceladas
        if (obra.status !== "Concluída" && obra.status !== "Cancelada") {

            botaoCancelar = document.createElement("button");

            botaoCancelar.textContent = "Cancelar obra";
            botaoCancelar.classList.add("botao-excluir");

            botaoCancelar.addEventListener("click", () => {

                const motivo = prompt("Informe o motivo do cancelamento:");

                if (motivo === null) {
                    return;
                }

                if (motivo.trim() === "") {
                    alert("Informe o motivo do cancelamento.");
                    return;
                }

                const confirmar = confirm(
                    `Confirma o cancelamento da obra ${obra.nome}?`
                );

                if (!confirmar) {
                    return;
                }

                obra.status = "Cancelada";
                obra.motivoCancelamento = motivo.trim();
                obra.dataCancelamento = new Date().toISOString();
                salvarObras();

                renderizarObras();
                renderizarClientes();

                alert("Obra cancelada com sucesso!");
            });
        }

        // Monta o cartão na ordem correta
        cartao.append(nome, nomeCliente, status);

        if (botaoCancelar) {
            cartao.appendChild(botaoCancelar);
        }

        listaObras.appendChild(cartao);
    });
}


const formObra = document.getElementById("form-obra");

formObra.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const nome = document.getElementById("obra-nome").value.trim();
    const clienteId = document.getElementById("obra-cliente").value;
    const status = document.getElementById("obra-status").value;

    // Verifica se o cliente realmente existe
    const clienteExistente = clientes.find((cliente) => {
        return cliente.id === clienteId;
    });

    if (!clienteExistente) {
        alert("Selecione um cliente válido.");
        return;
    }

    // Evita cadastrar a mesma obra para o mesmo cliente
    const obraExistente = obras.find((obra) => {
        return obra.nome.toLowerCase() === nome.toLowerCase()
            && obra.clienteId === clienteId;
    });

    if (obraExistente) {
        alert("Essa obra já está cadastrada para esse cliente.");
        return;
    }

    const novaObra = {
        id: crypto.randomUUID(),
        nome: nome,
        clienteId: clienteId,
        status: status
    };

    obras.push(novaObra);
    salvarObras();

    // Atualiza as duas listagens
    renderizarObras();
    renderizarClientes();

    formObra.reset();

    alert("Obra cadastrada com sucesso!");
});

import { inicializarNavegacao } from "./navegacao.js";

console.log("Caixa de Obra iniciado!");

console.log("Clientes:", clientes);
console.log("Obras:", obras);

console.log("Nomes das obras:", nomesDasObras);

console.log("Obras em andamento:", obrasEmAndamento);

console.log("Obras da Prefeitura:",
    buscarObrasPorCliente("cliente-001")
);

console.log("Obras da Construtora:",
    buscarObrasPorCliente("cliente-002")
);

console.log("Lista de clientes:");

clientes.forEach((cliente) => {
    console.log(cliente.nome);
});

console.log(
    "Consulta da Prefeitura:",
    consultarObrasDoCliente("cliente-001")
);

console.log(
    "Consulta da Construtora:",
    consultarObrasDoCliente("cliente-002")
);

console.log(
    "Cliente inexistente:",
    consultarObrasDoCliente("cliente-999")
);

// BOTÃO PARA GERAR RELATÓRIO
document.getElementById("btn-gerar-relatorio")
    .addEventListener("click", gerarRelatorioFinanceiro);

// Imprimir ou salvar relatório em PDF
document.getElementById("btn-imprimir-relatorio")
    .addEventListener("click", () => {
        window.print();
    });

renderizarClientes();

renderizarObras();

carregarClientesNoSelect();

carregarDiaristasNoSelect();

carregarClientesNoSelectDiarias();

carregarClientesNoSelectContratos();

carregarClientesNoSelectMovimentacoes();

carregarClientesNoSelectMaquinario();

carregarLocacoesNoSelectPagamentoMaquinario();

renderizarMaquinario();

carregarLocacoesNoSelectPagamentoMaquinario();

renderizarDiaristas();

renderizarDiarias();

renderizarResumoContratos();

renderizarContratos();

preencherProximoNumeroContrato();

renderizarMovimentacoes();

renderizarResumoFinanceiro();

inicializarNavegacao();

