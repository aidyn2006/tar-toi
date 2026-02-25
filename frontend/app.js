const API_BASE = "/api/v1";
const TOKEN_KEY = "toi_token";

const yearEl = document.getElementById("year");
const modal = document.getElementById("auth-modal");
const modalOverlay = document.getElementById("modal-overlay");
const closeModalBtn = document.getElementById("close-modal");
const openInviteBtn = document.getElementById("open-invite");
const cardButtons = document.querySelectorAll(".card[data-category]");
const langBtn = document.querySelector("[data-lang-toggle]");

const modeRegisterBtn = document.getElementById("mode-register");
const modeLoginBtn = document.getElementById("mode-login");
const submitBtn = document.getElementById("submit-btn");
const modalTitle = document.getElementById("modal-title");
const modalCaption = document.getElementById("modal-caption");
const messageEl = document.getElementById("form-message");

const form = document.getElementById("auth-form");
const registerOnly = document.querySelectorAll(".register-only");
const loginOnly = document.querySelectorAll(".login-only");

const fullNameInput = document.getElementById("full-name");
const phoneInput = document.getElementById("phone");
const registerPasswordInput = document.getElementById("register-password");
const loginPhoneInput = document.getElementById("login-phone");
const loginPasswordInput = document.getElementById("login-password");

let mode = "register";
let currentLang = "kk";
let selectedCategory = null;

const translations = {
    kk: {
        hero_title: "Онлайн шақырту жасаңыз – тойға дайындықты жеңілдетіңіз.",
        hero_lead: "Тіркеліп, шаблонды таңдаңыз, мәтінді қосып, шақыртуды WhatsApp арқылы жіберіңіз.",
        hero_cta: "Шақырту жасау",
        hero_price: "Тегін",
        hero_benefit_1: "3 минутта тіркеліп, шаблон таңдаңыз",
        hero_benefit_2: "Мәтін, фото және музыка қосыңыз",
        hero_benefit_3: "Сілтемені WhatsApp арқылы қонақтарға жіберіңіз",
        hero_benefit_4: "Жауаптарды телефоннан бақылаңыз",

        modal_title_register: "Шақырту жасау",
        modal_title_login: "Басқару тақтасына кіру",
        modal_caption_register: "Атыңызды және телефоныңызды толтырыңыз.",
        modal_caption_login: "Телефон мен құпиясөз арқылы кіріңіз.",
        submit_register: "Тіркелу",
        submit_login: "Кіру",

        error_full_name: "Сіздің атыңызды енгізіңіз",
        error_phone_empty: "Телефон нөмірін енгізіңіз",
        error_phone_invalid: "Телефон нөмірі дұрыс емес",
        error_password_short: "Құпиясөз кемінде 6 таңба болуы керек",
        error_login_fields: "Телефон мен құпиясөзді толтырыңыз",
        error_generic: "Қате шықты"
    },
    ru: {
        hero_title: "Создайте онлайн‑приглашение и упростите подготовку к тоию.",
        hero_lead: "Зарегистрируйтесь, выберите шаблон, добавьте текст и отправьте ссылку в WhatsApp.",
        hero_cta: "Создать приглашение",
        hero_price: "Бесплатно",
        hero_benefit_1: "Зарегистрируйтесь и выберите шаблон за 3 минуты",
        hero_benefit_2: "Добавьте текст, фото и музыку",
        hero_benefit_3: "Отправьте ссылку гостям в WhatsApp",
        hero_benefit_4: "Следите за ответами с телефона",

        modal_title_register: "Создать приглашение",
        modal_title_login: "Войти в панель управления",
        modal_caption_register: "Укажите имя и телефон.",
        modal_caption_login: "Войдите по телефону и паролю.",
        submit_register: "Регистрация",
        submit_login: "Войти",

        error_full_name: "Введите ваше имя",
        error_phone_empty: "Введите номер телефона",
        error_phone_invalid: "Неверный номер телефона",
        error_password_short: "Пароль должен быть не менее 6 символов",
        error_login_fields: "Введите телефон и пароль",
        error_generic: "Произошла ошибка"
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

    if (langBtn) {
        langBtn.textContent = currentLang === "ru" ? "РУС" : "ҚАЗ";
    }
}

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

function enforceDigits(input, maxLen = 11) {
    if (!input) return;
    input.addEventListener("input", () => {
        const digits = input.value.replace(/\D+/g, "").slice(0, maxLen);
        input.value = digits;
    });
}

function setMessage(text) {
    messageEl.textContent = text || "";
}

function openModal(categoryName) {
    selectedCategory = categoryName || selectedCategory;
    modal.classList.remove("is-hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeModal() {
    modal.classList.add("is-hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

function setMode(nextMode) {
    mode = nextMode;
    const isRegister = mode === "register";

    modeRegisterBtn.classList.toggle("is-active", isRegister);
    modeLoginBtn.classList.toggle("is-active", !isRegister);

    registerOnly.forEach((el) => el.classList.toggle("is-hidden", !isRegister));
    loginOnly.forEach((el) => el.classList.toggle("is-hidden", isRegister));

    fullNameInput.required = isRegister;
    phoneInput.required = isRegister;
    registerPasswordInput.required = isRegister;

    loginPhoneInput.required = !isRegister;
    loginPasswordInput.required = !isRegister;

    modalTitle.textContent = isRegister ? t("modal_title_register") : t("modal_title_login");
    modalCaption.textContent = isRegister ? t("modal_caption_register") : t("modal_caption_login");
    submitBtn.textContent = isRegister ? t("submit_register") : t("submit_login");

    setMessage("");
}

function sanitizePhone(phone) {
    return (phone || "").trim();
}

function buildDashboardUrl({ name, category }) {
    const params = new URLSearchParams();
    if (name) {
        params.set("name", name);
    }
    if (category) {
        params.set("category", category);
    }
    const query = params.toString();
    return query ? `dashboard.html?${query}` : "dashboard.html";
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

async function handleOpenInvite(categoryName) {
    const token = localStorage.getItem(TOKEN_KEY);
    selectedCategory = categoryName || selectedCategory;

    // Если уже есть токен – пробуем сразу отправить на дашборд
    if (token) {
        try {
            const me = await request("/auth/me");
            const fullName = me && me.user && me.user.fullName ? me.user.fullName : "";
            window.location.href = buildDashboardUrl({
                name: fullName,
                category: selectedCategory
            });
            return;
        } catch {
            // токен битый – очищаем и показываем регистрацию
            localStorage.removeItem(TOKEN_KEY);
        }
    }

    setMode("register");
    openModal(selectedCategory);
}

openInviteBtn.addEventListener("click", () => {
    handleOpenInvite(null);
});

cardButtons.forEach((card) => {
    card.addEventListener("click", () => {
        const categoryName = card.getAttribute("data-category");
        handleOpenInvite(categoryName);
    });
});

closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

modeRegisterBtn.addEventListener("click", () => setMode("register"));
modeLoginBtn.addEventListener("click", () => setMode("login"));

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("is-hidden")) {
        closeModal();
    }
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        if (mode === "register") {
            const fullName = (fullNameInput.value || "").trim();
            const phone = sanitizePhone(phoneInput.value || "");
            const password = (registerPasswordInput.value || "").trim();

            if (!fullName) {
                throw new Error(t("error_full_name"));
            }
            if (!phone) {
                throw new Error(t("error_phone_empty"));
            }
            if (!password || password.length < 6) {
                throw new Error(t("error_password_short"));
            }

            const registerPayload = {
                fullName,
                phone,
                password,
                confirmPassword: password
            };

            const result = await request("/auth/register", {
                method: "POST",
                body: JSON.stringify(registerPayload)
            });

            const loginAfterRegister = await request("/auth/login", {
                method: "POST",
                body: JSON.stringify({ phone, password })
            });

            if (loginAfterRegister.accessToken) {
                localStorage.setItem(TOKEN_KEY, loginAfterRegister.accessToken);
            }

            window.location.href = buildDashboardUrl({
                name: fullName,
                category: selectedCategory
            });
            return;
        }

        const phone = sanitizePhone(loginPhoneInput.value || "");
        const password = (loginPasswordInput.value || "").trim();

        if (!phone || !password) {
            throw new Error(t("error_login_fields"));
        }

        const loginResult = await request("/auth/login", {
            method: "POST",
            body: JSON.stringify({ phone, password })
        });

        if (loginResult.accessToken) {
            localStorage.setItem(TOKEN_KEY, loginResult.accessToken);
        }

        window.location.href = buildDashboardUrl({
            name: phone,
            category: selectedCategory
        });
    } catch (error) {
        setMessage(error.message || t("error_generic"));
    }
});

if (langBtn) {
    langBtn.addEventListener("click", () => {
        currentLang = currentLang === "kk" ? "ru" : "kk";
        applyTranslations();
        setMode(mode);
    });
}

applyTranslations();
setMode("register");
