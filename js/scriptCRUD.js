function getPersonagens() {
    return JSON.parse(localStorage.getItem("personagens") || "[]");
}

function savePersonagens(lista) {
    localStorage.setItem("personagens", JSON.stringify(lista));
}


function criarCard(p) {
    const card = document.createElement("div");
    card.classList.add("personagem");
    card.dataset.id = p.identifier;

    card.innerHTML = `
        <span class="personagem-id-badge">#${p.identifier}</span>
        <div class="nome-personagem">${p.nome || "—"}</div>
        <div class="descricao-personagem">${p.descricao || ""}</div>
        <div class="caracteristica-personagem">${p.caracteristica || "Sem característica"}</div>
        <div class="idade-personagem">${p.idade || "Idade desconhecida"}</div>
        <div class="card-actions">
            <button class="btn-edit" data-id="${p.identifier}">✏️ Editar</button>
            <button class="btn-delete" data-id="${p.identifier}">🗑 Excluir</button>
        </div>
    `;

    card.querySelector(".btn-edit").addEventListener("click", () => iniciarEdicao(p.identifier));
    card.querySelector(".btn-delete").addEventListener("click", () => excluirPersonagem(p.identifier, card));

    return card;
}


function renderizarPersonagens(filtro = "") {
    const container = document.getElementById("container-personagens");
    const emptyState = document.getElementById("empty-state");
    const badge = document.getElementById("count-badge");

    const lista = getPersonagens();
    const term = filtro.toLowerCase().trim();

    const filtrados = term
        ? lista.filter(p =>
            (p.nome || "").toLowerCase().includes(term) ||
            (p.descricao || "").toLowerCase().includes(term) ||
            (p.caracteristica || "").toLowerCase().includes(term)
        )
        : lista;

    // Remove cards existentes (mantém empty-state)
    container.querySelectorAll(".personagem").forEach(el => el.remove());

    badge.textContent = lista.length;

    if (filtrados.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
        filtrados.forEach((p, i) => {
            const card = criarCard(p);
            card.style.animationDelay = `${i * 0.06}s`;
            container.appendChild(card);
        });
    }
}


const saveBtn = document.getElementById("salvar");
const formError = document.getElementById("form-error");

saveBtn.addEventListener("click", function () {
    const nomeInput = document.getElementById("nome");
    const descricaoInput = document.getElementById("descricao");
    const caracteristicaInput = document.getElementById("caracteristica");
    const idadeInput = document.getElementById("idade");
    const editandoId = document.getElementById("editando-id");

    const nome = nomeInput.value.trim();

    if (!nome) {
        formError.style.display = "block";
        nomeInput.focus();
        return;
    }
    formError.style.display = "none";

    const lista = getPersonagens();
    const idEmEdicao = editandoId.value;

    if (idEmEdicao !== "") {
        // UPDATE
        const idx = lista.findIndex(p => String(p.identifier) === idEmEdicao);
        if (idx !== -1) {
            lista[idx].nome = nome;
            lista[idx].descricao = descricaoInput.value.trim();
            lista[idx].caracteristica = caracteristicaInput.value.trim();
            lista[idx].idade = idadeInput.value.trim();
            savePersonagens(lista);
        }
        cancelarEdicao();
    } else {
        // CREATE
        const novo = new Personagem(
            nome,
            descricaoInput.value.trim(),
            caracteristicaInput.value.trim(),
            idadeInput.value.trim()
        );
        lista.push(novo);
        savePersonagens(lista);
    }

    // Limpa form
    nomeInput.value = "";
    descricaoInput.value = "";
    caracteristicaInput.value = "";
    idadeInput.value = "";

    // Anima badge
    const badge = document.getElementById("count-badge");
    badge.classList.remove("bump");
    void badge.offsetWidth;
    badge.classList.add("bump");

    renderizarPersonagens(document.getElementById("busca").value);
});


function excluirPersonagem(id, cardEl) {
    if (!confirm("Excluir este personagem? Esta ação não pode ser desfeita.")) return;

    cardEl.style.animation = "removing 0.35s ease forwards";
    setTimeout(() => {
        let lista = getPersonagens();
        lista = lista.filter(p => String(p.identifier) !== String(id));
        savePersonagens(lista);
        renderizarPersonagens(document.getElementById("busca").value);
    }, 360);
}


function iniciarEdicao(id) {
    const lista = getPersonagens();
    const p = lista.find(p => String(p.identifier) === String(id));
    if (!p) return;

    document.getElementById("nome").value = p.nome || "";
    document.getElementById("descricao").value = p.descricao || "";
    document.getElementById("caracteristica").value = p.caracteristica || "";
    document.getElementById("idade").value = p.idade || "";
    document.getElementById("editando-id").value = id;

    document.getElementById("form-title").textContent = "✏️ Editando Personagem";
    document.getElementById("salvar").textContent = "💾 Salvar Alterações";
    document.getElementById("cancelar-edicao").style.display = "inline-flex";

    document.getElementById("form-section").scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("nome").focus();
}

function cancelarEdicao() {
    document.getElementById("editando-id").value = "";
    document.getElementById("form-title").textContent = "Novo Personagem";
    document.getElementById("salvar").textContent = "Registrar Personagem";
    document.getElementById("cancelar-edicao").style.display = "none";
    document.getElementById("nome").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("caracteristica").value = "";
    document.getElementById("idade").value = "";
}

document.getElementById("cancelar-edicao").addEventListener("click", cancelarEdicao);


document.getElementById("busca").addEventListener("input", function () {
    renderizarPersonagens(this.value);
});


window.addEventListener("load", function () {
    renderizarPersonagens();
});