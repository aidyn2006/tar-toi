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
const langToggle = document.querySelector("[data-lang-toggle]");

let currentParams = new URLSearchParams();
let isApproved = false;
let currentLang = localStorage.getItem("toi_lang") || "kk";

const translations = {
    kk: {
        dash_admin: "Admin",
        dash_logout: "Шығу",
        dash_home: "Басты бет",
        dash_subtitle: "Редактор мен шақырту сілтемесін басқару",
        dash_edit: "Шақыртуды өзгерту",
        dash_edit_hint: "Мәтін, фото, музыка, қонақ саны",
        dash_view: "Шақыртуды көру",
        dash_view_hint: "Қонақтарға қалай көрінетінін тексеру",
        dash_guests: "Қонақтар тізімі",
        dash_guests_hint: "Кім жауап берді — осы жерден",
        dash_copy: "Шақырту сілтемесін көшіру",
        dash_copy_hint: "Сілтемені WhatsApp/Telegram-ға жіберу",
        dash_soon: "Жақында",
        dash_new_title: "Жаңа шақырту сайтын жасау",
        dash_access_title: "Редакторға қолжетімділік",
        dash_access_text: "Толық редакторға кіру үшін Telegram арқылы @nur_kun немесе WhatsApp нөміріне 87056842747 жазыңыз. Қолжетімділік тегін беріледі.",
        dash_wa: "WhatsApp-қа жазу",
        dash_tg: "Telegram-ға жазу",
        msg_copy_ok: "Шақырту сілтемесі көшірілді",
        msg_copy_fail: "Сілтемені көшіру мүмкін болмады"
    },
    ru: {
        dash_admin: "Admin",
        dash_logout: "Выйти",
        dash_home: "Главная",
        dash_subtitle: "Управляйте редактором и ссылкой приглашения",
        dash_edit: "Редактировать приглашение",
        dash_edit_hint: "Текст, фото, музыка, число гостей",
        dash_view: "Посмотреть приглашение",
        dash_view_hint: "Проверить, как видят гости",
        dash_guests: "Список гостей",
        dash_guests_hint: "Кто ответил — будет здесь",
        dash_copy: "Скопировать ссылку",
        dash_copy_hint: "Отправьте ссылку в WhatsApp/Telegram",
        dash_soon: "Скоро",
        dash_new_title: "Создать новый сайт‑приглашение",
        dash_access_title: "Доступ к редактору",
        dash_access_text: "Чтобы открыть полный редактор, напишите в Telegram @nur_kun или в WhatsApp на номер 87056842747. Доступ предоставляется бесплатно.",
        dash_wa: "Написать в WhatsApp",
        dash_tg: "Написать в Telegram",
        msg_copy_ok: "Ссылка на приглашение скопирована",
        msg_copy_fail: "Не удалось скопировать ссылку"
    }
};

function t(key) {
    const langPack = translations[currentLang] || translations.kk;
    return langPack[key] || translations.kk[key] || key;
}

function applyTranslations() {
    document.documentElement.lang = currentLang === "ru" ? "ru" : "kk";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        const value = t(key);
        if (value) {
            el.textContent = value;
        }
    });
    if (langToggle) {
        langToggle.textContent = currentLang === "ru" ? "ҚАЗ" : "РУС";
    }
}

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
            setMessage(t("msg_copy_ok"));
            return;
        }

        const textarea = document.createElement("textarea");
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        setMessage(t("msg_copy_ok"));
    } catch {
        setMessage(t("msg_copy_fail"));
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
applyTranslations();

if (langToggle) {
    langToggle.addEventListener("click", () => {
        currentLang = currentLang === "ru" ? "kk" : "ru";
        localStorage.setItem("toi_lang", currentLang);
        applyTranslations();
    });
}

if (accessModal) {
    ensureApproved();

    if (accessModalClose) {
        accessModalClose.addEventListener("click", closeAccessModal);
    }
    accessModal.addEventListener("click", (event) => {
        if (event.target.classList.contains("dash-modal__overlay")) {
            closeAccessModal();
        }
    });
}
