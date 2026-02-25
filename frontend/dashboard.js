const API_BASE = "/api/v1";
const TOKEN_KEY = "toi_token";

const titleEl = document.getElementById("invite-title");
const messageEl = document.getElementById("dash-message");
const logoutBtn = document.getElementById("logout-btn");
const copyLinkBtn = document.getElementById("copy-link-btn");
const newInviteBtn = document.getElementById("new-invite-btn");
const editBtn = document.getElementById("edit-btn");
const viewBtn = document.getElementById("view-btn");
const accessModal = document.getElementById("access-modal");
const accessModalClose = document.getElementById("access-modal-close");

let currentParams = new URLSearchParams();
let isApproved = false;

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

function openAccessModal() {
    if (!accessModal) {
        return;
    }
    accessModal.setAttribute("aria-hidden", "false");
}

function closeAccessModal() {
    if (!accessModal) {
        return;
    }
    if (!isApproved) {
        return;
    }
    accessModal.setAttribute("aria-hidden", "true");
}

async function request(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    const text = await response.text();
    let payload = {};

    if (text) {
        try {
            payload = JSON.parse(text);
        } catch {
            payload = { message: text };
        }
    }

    if (!response.ok) {
        throw new Error(payload.error || payload.message || `HTTP ${response.status}`);
    }

    return payload;
}

async function ensureApproved() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    try {
        const me = await request("/auth/me");
        const user = me && me.user ? me.user : null;
        const roles = Array.isArray(user?.roles) ? user.roles : [];
        const isAdmin = roles.includes("ROLE_ADMIN");
        const approvedFlag = !!user?.approved;

        // Админу модалка никогда не нужна
        isApproved = isAdmin || approvedFlag;

        if (!isApproved) {
            openAccessModal();
        } else {
            closeAccessModal();
        }
    } catch {
        isApproved = false;
        openAccessModal();
    }
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

if (accessModal) {
    ensureApproved();

    accessModalClose.addEventListener("click", closeAccessModal);
    accessModal.addEventListener("click", (event) => {
        if (event.target.classList.contains("dash-modal__overlay")) {
            closeAccessModal();
        }
    });
}
