const API_BASE = "/api/v1";
const TOKEN_KEY = "toi_token";

const yearEl = document.getElementById("year");
const modal = document.getElementById("auth-modal");
const modalOverlay = document.getElementById("modal-overlay");
const closeModalBtn = document.getElementById("close-modal");
const openInviteBtn = document.getElementById("open-invite");
const cardButtons = document.querySelectorAll(".card[data-category]");

const modeRegisterBtn = document.getElementById("mode-register");
const modeLoginBtn = document.getElementById("mode-login");
const submitBtn = document.getElementById("submit-btn");
const secondaryBtn = document.getElementById("secondary-btn");
const modalTitle = document.getElementById("modal-title");
const modalCaption = document.getElementById("modal-caption");
const messageEl = document.getElementById("form-message");

const form = document.getElementById("auth-form");
const registerOnly = document.querySelectorAll(".register-only");
const loginOnly = document.querySelectorAll(".login-only");

const fullNameInput = document.getElementById("full-name");
const phoneInput = document.getElementById("phone");
const categorySelect = document.getElementById("category");
const registerPasswordInput = document.getElementById("register-password");

const loginUsernameInput = document.getElementById("login-username");
const loginPasswordInput = document.getElementById("login-password");

let mode = "register";

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

function setMessage(text) {
    messageEl.textContent = text || "";
}

function openModal(categoryName) {
    if (categoryName) {
        categorySelect.value = categoryName;
    }
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

    loginUsernameInput.required = !isRegister;
    loginPasswordInput.required = !isRegister;

    modalTitle.textContent = isRegister ? "Шақырту жасау" : "Басқару тақтасына кіру";
    modalCaption.textContent = isRegister
        ? "Атыңызды, телефоныңызды және категорияны толтырыңыз."
        : "Логин мен құпиясөз арқылы кіріңіз.";

    submitBtn.textContent = isRegister ? "Шақырту жасау" : "Кіру";
    secondaryBtn.textContent = isRegister ? "Басқару тақтасы" : "Тіркелу режимі";

    setMessage("");
}

function sanitizePhone(phone) {
    return phone.replace(/\D+/g, "");
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

openInviteBtn.addEventListener("click", () => {
    setMode("register");
    openModal(categorySelect.value);
});

cardButtons.forEach((card) => {
    card.addEventListener("click", () => {
        const categoryName = card.getAttribute("data-category");
        setMode("register");
        openModal(categoryName);
    });
});

closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

modeRegisterBtn.addEventListener("click", () => setMode("register"));
modeLoginBtn.addEventListener("click", () => setMode("login"));

secondaryBtn.addEventListener("click", () => {
    setMode(mode === "register" ? "login" : "register");
});

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
                throw new Error("Сіздің атыңызды енгізіңіз");
            }
            if (!phone) {
                throw new Error("Телефон нөмірін енгізіңіз");
            }
            if (phone.length < 10) {
                throw new Error("Телефон нөмірі дұрыс емес");
            }
            if (!password || password.length < 6) {
                throw new Error("Құпиясөз кемінде 6 таңба болуы керек");
            }

            const registerPayload = {
                fullName,
                username: phone,
                password,
                confirmPassword: password
            };

            const result = await request("/auth/register", {
                method: "POST",
                body: JSON.stringify(registerPayload)
            });

            loginUsernameInput.value = phone;
            loginPasswordInput.value = password;
            const loginAfterRegister = await request("/auth/login", {
                method: "POST",
                body: JSON.stringify({ username: phone, password })
            });

            if (loginAfterRegister.accessToken) {
                localStorage.setItem(TOKEN_KEY, loginAfterRegister.accessToken);
            }

            window.location.href = buildDashboardUrl({
                name: fullName,
                category: categorySelect.value
            });
            return;
        }

        const username = (loginUsernameInput.value || "").trim();
        const password = (loginPasswordInput.value || "").trim();

        if (!username || !password) {
            throw new Error("Логин мен құпиясөзді толтырыңыз");
        }

        const loginResult = await request("/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password })
        });

        if (loginResult.accessToken) {
            localStorage.setItem(TOKEN_KEY, loginResult.accessToken);
        }

        window.location.href = buildDashboardUrl({
            name: loginUsernameInput.value.trim(),
            category: categorySelect.value
        });
    } catch (error) {
        setMessage(error.message || "Қате шықты");
    }
});

setMode("register");
