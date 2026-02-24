const TOKEN_KEY = "toi_token";

const titleEl = document.getElementById("invite-title");
const messageEl = document.getElementById("dash-message");
const logoutBtn = document.getElementById("logout-btn");
const copyLinkBtn = document.getElementById("copy-link-btn");
const newInviteBtn = document.getElementById("new-invite-btn");
const editBtn = document.getElementById("edit-btn");
const viewBtn = document.getElementById("view-btn");

let currentParams = new URLSearchParams();

function setMessage(text) {
    messageEl.textContent = text || "";
}

function parseParams() {
    const params = new URLSearchParams(window.location.search);
    currentParams = params;
    const category = params.get("category");
    const name = params.get("name");

    if (name && category) {
        titleEl.textContent = `${name} • ${category}`;
        return;
    }

    if (name) {
        titleEl.textContent = name;
        return;
    }

    if (category) {
        titleEl.textContent = category;
    }
}

function withCurrentParams(path) {
    const query = currentParams.toString();
    return query ? `${path}?${query}` : path;
}

async function copyInviteLink() {
    const link = `${window.location.origin}/invite/demo`;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(link);
            setMessage("Шақырту сілтемесі көшірілді");
            return;
        }

        const textarea = document.createElement("textarea");
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        setMessage("Шақырту сілтемесі көшірілді");
    } catch {
        setMessage("Сілтемені көшіру мүмкін болмады");
    }
}

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "index.html";
});

copyLinkBtn.addEventListener("click", () => {
    copyInviteLink();
});

newInviteBtn.addEventListener("click", () => {
    window.location.href = "editor.html";
});

editBtn.addEventListener("click", () => {
    window.location.href = withCurrentParams("editor.html");
});

viewBtn.addEventListener("click", () => {
    const link = `${window.location.origin}/invite/demo`;
    window.open(link, "_blank", "noopener,noreferrer");
});

parseParams();
