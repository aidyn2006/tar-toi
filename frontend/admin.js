const API_BASE = "/api/v1";
const TOKEN_KEY = "toi_token";

const logoutBtn = document.getElementById("logout-btn");
const messageEl = document.getElementById("admin-message");
const usersTableBody = document.querySelector("#users-table tbody");

function setMessage(text) {
    messageEl.textContent = text || "";
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

async function ensureAdmin() {
    try {
        const me = await request("/auth/me");
        const roles = Array.isArray(me?.user?.roles) ? me.user.roles : [];
        if (!roles.includes("ROLE_ADMIN")) {
            window.location.href = "index.html";
            return;
        }
    } catch {
        window.location.href = "index.html";
    }
}

function renderUsers(users) {
    usersTableBody.innerHTML = "";
    users.forEach((user) => {
        const tr = document.createElement("tr");
        const rolesText = Array.isArray(user.roles) ? user.roles.join(", ") : "";
        const approved = !!user.approved;

        tr.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${rolesText}</td>
            <td>${approved ? "YES" : "NO"}</td>
            <td></td>
        `;

        const actionsCell = tr.lastElementChild;
        const approveBtn = document.createElement("button");
        approveBtn.className = "admin-table__approve-btn";
        approveBtn.textContent = approved ? "Approved" : "Approve";
        approveBtn.disabled = approved || rolesText.includes("ROLE_ADMIN");

        approveBtn.addEventListener("click", async () => {
            try {
                const updated = await request(`/admin/users/${encodeURIComponent(user.username)}/approve`, {
                    method: "POST"
                });
                approveBtn.textContent = "Approved";
                approveBtn.disabled = true;
                tr.children[3].textContent = "YES";
                setMessage(`Пользователь ${updated.username} подтверждён`);
            } catch (error) {
                setMessage(error.message || "Қате шықты");
            }
        });

        actionsCell.appendChild(approveBtn);
        usersTableBody.appendChild(tr);
    });
}

async function loadUsers() {
    try {
        const users = await request("/admin/users");
        renderUsers(users);
        if (!users.length) {
            setMessage("Пока нет зарегистрированных пользователей");
        } else {
            setMessage("");
        }
    } catch (error) {
        setMessage(error.message || "Пайдаланушыларды жүктеу мүмкін емес");
    }
}

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "index.html";
});

(async function init() {
    await ensureAdmin();
    await loadUsers();
})();

