/* ========================================
   CALCULADORA MMR DOTA 2 - JAVASCRIPT SIMPLIFICADO
   ======================================== */

// CONFIGURAÇÕES EDITÁVEIS
const TABELA_PRECOS = [
    { min: 0, max: 4000, preco: 0.40 },
    { min: 4001, max: 4500, preco: 0.65 },
    { min: 4501, max: 5000, preco: 0.75 },
    { min: 5001, max: 5500, preco: 1.10 },
    { min: 5501, max: 6000, preco: 2.10 },
    { min: 6001, max: 6500, preco: 3.20 },
    { min: 6501, max: 7000, preco: 3.80 },
    { min: 7001, max: 7500, preco: 4.75 },
    { min: 7501, max: 8000, preco: 7.60 },
    { min: 8001, max: 8500, preco: 8.50 }
];

const TABELA_DESCONTOS = [
    { mmr_minimo: 1500, desconto: 12 },
    { mmr_minimo: 1250, desconto: 10 },
    { mmr_minimo: 1000, desconto: 8 },
    { mmr_minimo: 750, desconto: 6 },
    { mmr_minimo: 500, desconto: 4 }
];

const CONFIG = {
    mmr_minimo: 0,
    mmr_maximo: 8500,
    mmr_minimo_desconto: 4000
};

// FUNÇÃO PRINCIPAL DE CÁLCULO
function calcular() {
    try {
        limparErros();

        const mmrAtual = obterValorMMR('mmrAtual');
        const mmrDesejado = obterValorMMR('mmrDesejado');

        if (!validarEntrada(mmrAtual, mmrDesejado)) {
            return;
        }

        const mmrGanhar = mmrDesejado - mmrAtual;
        const precoBase = calcularPrecoBase(mmrAtual, mmrDesejado);
        const desconto = calcularDesconto(mmrAtual, mmrGanhar);
        const precoFinal = precoBase * (1 - desconto / 100);

        exibirResultados(mmrGanhar, precoBase, precoFinal, desconto);

    } catch (error) {
        console.error('Erro no cálculo:', error);
        alert('Erro no cálculo. Tente novamente.');
    }
}

// FUNÇÕES DE VALIDAÇÃO
function obterValorMMR(elementId) {
    const valor = parseInt(document.getElementById(elementId).value);
    return isNaN(valor) ? 0 : valor;
}

function validarEntrada(mmrAtual, mmrDesejado) {
    let valido = true;

    if (!mmrAtual || mmrAtual < CONFIG.mmr_minimo || mmrAtual > CONFIG.mmr_maximo) {
        mostrarErro('errorAtual', `MMR deve ser entre ${CONFIG.mmr_minimo} e ${CONFIG.mmr_maximo}`);
        valido = false;
    }

    if (!mmrDesejado || mmrDesejado < CONFIG.mmr_minimo || mmrDesejado > CONFIG.mmr_maximo) {
        mostrarErro('errorDesejado', `MMR deve ser entre ${CONFIG.mmr_minimo} e ${CONFIG.mmr_maximo}`);
        valido = false;
    }

    if (mmrDesejado <= mmrAtual) {
        mostrarErro('errorDesejado', 'MMR desejado deve ser maior que o atual');
        valido = false;
    }

    return valido;
}

function limparErros() {
    document.getElementById('errorAtual').textContent = '';
    document.getElementById('errorDesejado').textContent = '';
}

function mostrarErro(elementId, mensagem) {
    document.getElementById(elementId).textContent = mensagem;
}

// FUNÇÕES DE CÁLCULO DE PREÇO
function calcularPrecoBase(mmrAtual, mmrDesejado) {
    let precoTotal = 0;
    let mmrAtualTemp = mmrAtual;

    for (const faixa of TABELA_PRECOS) {
        if (mmrAtualTemp < mmrDesejado && mmrAtualTemp <= faixa.max) {
            const inicioEfetivo = Math.max(mmrAtualTemp, faixa.min);
            const fimEfetivo = Math.min(mmrDesejado, faixa.max);
            const mmrNaFaixa = fimEfetivo - inicioEfetivo;
            
            if (mmrNaFaixa > 0) {
                precoTotal += mmrNaFaixa * faixa.preco;
                mmrAtualTemp = fimEfetivo;
            }
            
            if (mmrAtualTemp >= mmrDesejado) {
                break;
            }
        }
    }

    return precoTotal;
}

function calcularDesconto(mmrAtual, mmrGanhar) {
    // Desconto só se aplica para MMR inicial >= 4000
    if (mmrAtual < CONFIG.mmr_minimo_desconto) {
        return 0;
    }

    for (const item of TABELA_DESCONTOS) {
        if (mmrGanhar >= item.mmr_minimo) {
            return item.desconto;
        }
    }

    return 0;
}

// FUNÇÕES DE EXIBIÇÃO
function exibirResultados(mmrGanhar, precoBase, precoFinal, desconto) {
    document.getElementById('mmrGanhar').textContent = mmrGanhar.toLocaleString();
    document.getElementById('precoBase').textContent = formatarMoeda(precoBase);
    document.getElementById('precoFinal').textContent = formatarMoeda(precoFinal);

    if (desconto > 0) {
        document.getElementById('descontoTexto').textContent = desconto + '%';
        document.getElementById('descontoInfo').style.display = 'block';
    } else {
        document.getElementById('descontoInfo').style.display = 'none';
    }

    document.getElementById('resultados').style.display = 'block';
}

function formatarMoeda(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// EVENT LISTENERS
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calcular();
    }
});

console.log('Calculadora MMR simplificada carregada!');

function fazerPedido() {
    const offStream = document.querySelector('input[name="offStream"]:checked').value;
    const mmrAtual = obterValorMMR('mmrAtual');
    const mmrDesejado = obterValorMMR('mmrDesejado');
    const mmrGanhar = mmrDesejado - mmrAtual;
    const precoBase = calcularPrecoBase(mmrAtual, mmrDesejado);
    const desconto = calcularDesconto(mmrAtual, mmrGanhar);
    const precoFinal = precoBase * (1 - desconto / 100);

    const mensagem = ` *🖱️ Pedido (SEKAI-DOTA-BOOST) - Dota 2*\n\n` +
        `📊 *MMR Atual:* ${mmrAtual.toLocaleString()}\n` +
        `🎯 *MMR Desejado:* ${mmrDesejado.toLocaleString()}\n` +
        `⚡ *MMR a Ganhar:* ${mmrGanhar.toLocaleString()}\n` +
        `💰 *Preço Base:* ${formatarMoeda(precoBase)}\n` +
        (desconto > 0 ?
            `🎁 *Desconto:* ${desconto}%\n` +
            `💵 *Preço Final:* ${formatarMoeda(precoFinal)}\n` : '') +
        `🎥 *Off-stream:* ${offStream === 'sim' ? 'Sim (taxa extra)' : 'Não'}\n` +

        `Gostaria de prosseguir com este pedido!`;

    const mensagemCodificada = encodeURIComponent(mensagem);
    const numeroWhatsApp = '5521991844917'; // seu número com DDI e DDD
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

    window.open(urlWhatsApp, '_blank');
}

