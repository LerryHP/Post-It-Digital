let idNota = 0;
let posicoesOcupadas = [];

function criarNotaAdesiva() {
    const container = document.getElementById("container");
    const nota = document.createElement("div");
    nota.className = "nota";
    nota.id = "nota_" + idNota;
    nota.innerHTML = `
        <div class="cabecalho">
            <span class="apagar" onclick="apagarNotaAdesiva('${nota.id}')">Apagar</span>
        </div>
        <div class="conteudo" contenteditable="true" onclick="ocultarPlaceholder(this)">Clique e digite aqui!</div>
        <input type="color" class="seletor-cor" onchange="mudarCorNota('${nota.id}', this.value)">
    `;
    salvarNotasNoLocalStorage();

    idNota++;
    nota.addEventListener("mousedown", iniciarArrasto);
    container.appendChild(nota);
    salvarNotasNoLocalStorage();
}

function ocultarPlaceholder(elemento) {
    if (elemento.innerText === "Clique e digite aqui!") {
        elemento.innerText = "";
        salvarNotasNoLocalStorage();
    }
}

function iniciarArrasto(evento) {
    const nota = evento.target;
    const mouseX = evento.clientX;
    const mouseY = evento.clientY;
    const notaX = nota.offsetLeft;
    const notaY = nota.offsetTop;
    const offsetX = mouseX - notaX;
    const offsetY = mouseY - notaY;

    document.addEventListener("mousemove", arrastarNota);
    document.addEventListener("mouseup", pararArrasto);
    salvarNotasNoLocalStorage();

    function arrastarNota(evento) {
        if (
            evento.target.tagName.toLowerCase() === "input" ||
            evento.target.tagName.toLowerCase() === "textarea"
        ) {
            return; // Impede o arrasto se o alvo for um elemento de input
        }
        evento.preventDefault(); // Impede a seleção de texto
        const novaNotaX = evento.clientX - offsetX;
        const novaNotaY = evento.clientY - offsetY;
        nota.style.left = novaNotaX + "px";
        nota.style.top = novaNotaY + "px";
        salvarNotasNoLocalStorage();
    }

    function pararArrasto() {
        document.removeEventListener("mousemove", arrastarNota);
        document.removeEventListener("mouseup", pararArrasto);
        salvarNotasNoLocalStorage();
    }
}

function apagarNotaAdesiva(idNota) {
    const botaoApagar = event.target;
    if (botaoApagar.classList.contains("apagar")) {
        const nota = botaoApagar.parentNode.parentNode;
        nota.remove();
        salvarNotasNoLocalStorage();
    }
}

function resetarNotas() {
    const container = document.getElementById("container");
    container.innerHTML = "";
    idNota = 0;
    posicoesOcupadas = [];
    localStorage.removeItem("notasAdesivas");
    salvarNotasNoLocalStorage();
}

function salvarNotasNoLocalStorage() {
    const notas = document.getElementsByClassName("nota");
    const arrayNotas = Array.from(notas).map(nota => ({
        id: nota.id,
        conteudo: nota.querySelector(".conteudo").innerText,
        topo: nota.style.top,
        esquerda: nota.style.left,
        cor: nota.querySelector(".seletor-cor").value // Obtém o valor da cor do seletor de cor
    }));
    localStorage.setItem("notasAdesivas", JSON.stringify(arrayNotas));
}

function carregarNotasDoLocalStorage() {
    const notasSalvas = localStorage.getItem("notasAdesivas");
    if (notasSalvas) {
        const arrayNotas = JSON.parse(notasSalvas);
        arrayNotas.forEach(nota => {
            const container = document.getElementById("container");
            const novaNota = document.createElement("div");
            novaNota.className = "nota";
            novaNota.id = nota.id;
            novaNota.innerHTML = `
                <div class="cabecalho">
                    <button class="apagar" onclick="apagarNotaAdesiva('${nota.id}')" contenteditable="false">Apagar</button>
                </div>
                <div class="conteudo" contenteditable="true">${nota.conteudo}</div>
                <input type="color" class="seletor-cor" onchange="mudarCorNota('${nota.id}', this.value)" value="${nota.cor}">
            `;
            novaNota.style.top = nota.topo;
            novaNota.style.left = nota.esquerda;
            novaNota.style.backgroundColor = nota.cor; // Define a cor de fundo
            novaNota.addEventListener("mousedown", iniciarArrasto);
            container.appendChild(novaNota);
        });
    }
}

function mudarCorNota(idNota, cor) {
    const nota = document.getElementById(idNota);
    nota.style.backgroundColor = cor;
    salvarNotasNoLocalStorage();
}

window.addEventListener("DOMContentLoaded", carregarNotasDoLocalStorage);

