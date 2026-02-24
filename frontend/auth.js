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
const loginLabel = document.getElementById("login-label");

const usernameInput = document.getElementById("username");
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

  loginLabel.textContent = "Логин";
  submitBtn.textContent = isLogin ? "Кіру" : "Тіркелу";

  usernameInput.required = isLogin;
  fullNameInput.required = !isLogin;
  phoneInput.required = !isLogin;

  form.reset();
  setMessage("");
}

function readSelectedType() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("type");
  selectedTypeEl.textContent = typeMap[value] || "Шақыру жасау үшін аккаунтқа кіріңіз.";
}

function sanitizePhone(phone) {
  return phone.replace(/\s+/g, "").trim();
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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const username = (formData.get("username") || "").toString().trim();
  const password = (formData.get("password") || "").toString();

  if (mode === "login" && (!username || !password)) {
    setMessage("Логин мен құпиясөзді толтырыңыз");
    return;
  }

  if (mode === "register" && !password) {
    setMessage("Құпиясөзді толтырыңыз");
    return;
  }

  try {
    if (mode === "register") {
      const fullName = (formData.get("fullName") || "").toString().trim();
      const phone = sanitizePhone((formData.get("phone") || "").toString());

      if (!fullName) {
        throw new Error("Аты-жөніңізді енгізіңіз");
      }
      if (!phone) {
        throw new Error("Телефон нөмірін енгізіңіз");
      }
      if (phone.length < 10) {
        throw new Error("Телефон нөмірі дұрыс емес");
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

      setMode("login");
      usernameInput.value = phone;
      setMessage(result.message || "Тіркелу сәтті аяқталды. Енді кіре аласыз.");
      return;
    }

    const loginPayload = {
      username,
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
