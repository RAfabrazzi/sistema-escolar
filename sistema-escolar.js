const DISCIPLINAS = [
    "Matemática",
    "Português",
    "Geografia",
    "História",
    "Ciências",
    "Inglês"
];

document.addEventListener("DOMContentLoaded", carregarAlunos);

function cadastrarAluno() {
    const nome = document.getElementById("nomeAluno").value;
    const serie = document.getElementById("serieAluno").value;

    if (!nome || !serie) {
        alert("Preencha todos os campos!");
        return;
    }

    let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

    const novoAluno = {
        id: Date.now(),
        nome,
        serie,
        notas: {}
    };

    DISCIPLINAS.forEach(d => {
        novoAluno.notas[d] = { t1: 0, t2: 0, t3: 0, media: 0 };
    });

    alunos.push(novoAluno);
    localStorage.setItem("alunos", JSON.stringify(alunos));

    carregarAlunos();
}

function carregarAlunos() {
    const lista = document.getElementById("listaAlunos");
    lista.innerHTML = "";

    let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

    alunos.forEach(aluno => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${aluno.nome}</strong> - ${aluno.serie}
            <button onclick="abrirBoletim(${aluno.id})">Boletim</button>
        `;
        lista.appendChild(li);
    });
}

function abrirBoletim(id) {
    let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    const aluno = alunos.find(a => a.id === id);

    const container = document.getElementById("boletim");
    container.innerHTML = `<h2>Boletim - ${aluno.nome}</h2>`;

    DISCIPLINAS.forEach(d => {
        const n = aluno.notas[d];

        container.innerHTML += `
            <div>
                <h4>${d}</h4>
                1º: <input type="number" value="${n.t1}" onchange="salvarNota(${id}, '${d}', 't1', this.value)">
                2º: <input type="number" value="${n.t2}" onchange="salvarNota(${id}, '${d}', 't2', this.value)">
                3º: <input type="number" value="${n.t3}" onchange="salvarNota(${id}, '${d}', 't3', this.value)">
                Média: <strong>${n.media.toFixed(2)}</strong>
            </div><hr>
        `;
    });

    calcularMediaGeral(id);
}

function salvarNota(id, disciplina, trimestre, valor) {
    let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    const aluno = alunos.find(a => a.id === id);

    aluno.notas[disciplina][trimestre] = parseFloat(valor) || 0;

    const n = aluno.notas[disciplina];
    n.media = (n.t1 + n.t2 + n.t3) / 3;

    localStorage.setItem("alunos", JSON.stringify(alunos));

    abrirBoletim(id);
}

function calcularMediaGeral(id) {
    let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    const aluno = alunos.find(a => a.id === id);

    let soma = 0;
    DISCIPLINAS.forEach(d => {
        soma += aluno.notas[d].media;
    });

    const media = soma / DISCIPLINAS.length;
    const situacao = media >= 6 ? "Aprovado" : "Reprovado";

    const container = document.getElementById("boletim");

    container.innerHTML += `
        <h3>Média Geral: ${media.toFixed(2)}</h3>
        <h3>Situação: ${situacao}</h3>
    `;
}
