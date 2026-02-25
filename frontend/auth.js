const API_BASE = "/api/v1";
const TOKEN_KEY = "toi_token";

const form = document.getElementById("auth-form");
const loginTab = document.getElementById("tab-login");
const registerTab = document.getElementById("tab-register");
const submitBtn = document.getElementById("submit-btn");
const messageEl = document.getElementById("form-message");
const selectedTypeEl = document.getElementById("selected-type");
const registerOnly = document.querySelectorAll(".register-only");
const loginOnly = document.querySelectorAll(".login-only");

const fullNameInput = document.getElementById("full-name");
const phoneInput = document.getElementById("phone");

let mode = "login";

const typeMap = {
  uzatu: "Таңдалған түрі: Ұзату",
  wedding: "Таңдалған түрі: Үйлену тойы",
  sundet: "Таңдалған түрі: Сүндет той",
  tusau: "Таңдалған түрі: Тұсаукесер",
  merei: "Таңдалған түрі: Мерейтой",
  besik: "Таңдалған түрі: Бесік той"
};

function setMessage(text) {
  messageEl.textContent = text || "";
}

function setMode(nextMode) {
  mode = nextMode;
  const isLogin = mode === "login";

  loginTab.classList.toggle("is-active", isLogin);
  registerTab.classList.toggle("is-active", !isLogin);
  registerOnly.forEach((el) => el.classList.toggle("is-hidden", isLogin));
  loginOnly.forEach((el) => el.classList.toggle("is-hidden", !isLogin));

  submitBtn.textContent = isLogin ? "Кіру" : "Тіркелу";

  phoneInput.required = true;
  fullNameInput.required = !isLogin;

  form.reset();
  setMessage("");
}

function readSelectedType() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("type");
  selectedTypeEl.textContent = typeMap[value] || "Шақыру жасау үшін аккаунтқа кіріңіз.";
}

function normalizeKzDigits(value) {
  const digitsOnly = (value || "").replace(/\\D+/g, "");
  if (!digitsOnly) {
    return "";
  }
  if (digitsOnly.startsWith("8")) {
    return `7${digitsOnly.slice(1, 11)}`;
  }
  if (digitsOnly.length === 10) {
    return `7${digitsOnly}`;
  }
  if (digitsOnly.startsWith("7")) {
    return digitsOnly.slice(0, 11);
  }
  return digitsOnly.slice(0, 10);
}

function formatKzPhone(digits) {
  const normalized = normalizeKzDigits(digits);
  if (!normalized) {
    return "";
  }
  if (normalized.length === 1 && normalized === "7") {
    return "+7";
  }
  if (!normalized.startsWith("7")) {
    return normalized;
  }
  const rest = normalized.slice(1);
  let formatted = "+7";
  if (rest.length > 0) formatted += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) formatted += `)`;
  if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) formatted += ` ${rest.slice(6, 8)}`;
  if (rest.length > 8) formatted += ` ${rest.slice(8, 10)}`;
  return formatted;
}

function bindKzPhoneInputs(...inputs) {
  inputs.filter(Boolean).forEach((input) => {
    input.addEventListener("input", () => {
      input.value = formatKzPhone(input.value);
    });
  });
}

function sanitizePhone(phone) {
  return normalizeKzDigits(phone);
}

function isKzPhone(phone) {
  return /^7\\d{10}$/.test(normalizeKzDigits(phone));
}

bindKzPhoneInputs(phoneInput);

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const phone = sanitizePhone((formData.get("phone") || "").toString());
  const password = (formData.get("password") || "").toString();

  if (mode === "login" && (!phone || !password)) {
    setMessage("Телефон мен құпиясөзді толтырыңыз");
    return;
  }
  if (mode === "login" && !isKzPhone(phone)) {
    setMessage("Телефон нөмірі дұрыс емес");
    return;
  }

  if (mode === "register" && !password) {
    setMessage("Құпиясөзді толтырыңыз");
    return;
  }

  try {
    if (mode === "register") {
      const fullName = (formData.get("fullName") || "").toString().trim();
      if (!fullName) {
        throw new Error("Аты-жөніңізді енгізіңіз");
      }
      if (!phone) {
        throw new Error("Телефон нөмірін енгізіңіз");
      }
      if (!isKzPhone(phone)) {
        throw new Error("Телефон нөмірі дұрыс емес");
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

      setMode("login");
      phoneInput.value = phone;
      setMessage(result.message || "Тіркелу сәтті аяқталды. Енді кіре аласыз.");
      return;
    }

    const loginPayload = {
      phone,
      password
    };

    const loginResult = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(loginPayload)
    });

    if (loginResult.accessToken) {
      localStorage.setItem(TOKEN_KEY, loginResult.accessToken);
    }

    setMessage("Сәтті кірдіңіз");
  } catch (error) {
    setMessage(error.message || "Қате шықты");
  }
});

loginTab.addEventListener("click", () => setMode("login"));
registerTab.addEventListener("click", () => setMode("register"));

readSelectedType();
setMode("login");
