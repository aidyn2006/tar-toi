const API_BASE = "/api/v1";

const titleEl = document.getElementById("invite-title");
const descriptionEl = document.getElementById("invite-description");
const dateLongEl = document.getElementById("invite-date-long");
const timeEl = document.getElementById("invite-time");
const placeEl = document.getElementById("invite-place");
const hostsEl = document.getElementById("invite-hosts");
const mapLinkEl = document.getElementById("map-link");
const imageEl = document.getElementById("invite-image");
const photoBlockEl = document.getElementById("photo-block");

const calendarTitleEl = document.getElementById("calendar-title");
const calendarGridEl = document.getElementById("calendar-grid");
const countDaysEl = document.getElementById("count-days");
const countHoursEl = document.getElementById("count-hours");
const countMinutesEl = document.getElementById("count-minutes");
const countSecondsEl = document.getElementById("count-seconds");

const rsvpForm = document.getElementById("rsvp-form");
const messageEl = document.getElementById("invite-message");
const guestsInput = document.getElementById("guest-count");
const guestMinusBtn = document.getElementById("guest-minus");
const guestPlusBtn = document.getElementById("guest-plus");

let inviteId = null;
let invite = null;
let maxGuestsLimit = 20;
let countdownTimer = null;

const MONTHS_KK_GENITIVE = [
    "Қаңтар",
    "Ақпан",
    "Наурыз",
    "Сәуір",
    "Мамыр",
    "Маусым",
    "Шілде",
    "Тамыз",
    "Қыркүйек",
    "Қазан",
    "Қараша",
    "Желтоқсан"
];

function setMessage(text) {
    messageEl.textContent = text || "";
}

function request(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    return fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    }).then(async (response) => {
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
    });
}

function pad2(value) {
    return String(Math.max(0, value)).padStart(2, "0");
}

function parseEventDateTime(dateValue, timeValue) {
    if (!dateValue) {
        return null;
    }

    const time = (timeValue || "19:00").slice(0, 5);
    const iso = `${dateValue}T${time}:00`;
    const parsed = new Date(iso);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
}

function formatLongDate(dateValue) {
    if (!dateValue) {
        return "Күні нақты көрсетілмеген";
    }

    const [yearStr, monthStr, dayStr] = dateValue.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    if (!year || !month || !day) {
        return dateValue;
    }

    const monthName = MONTHS_KK_GENITIVE[month - 1] || monthStr;
    return `${year} жылы ${monthName} айының ${day} күні`;
}

function renderCalendar(dateValue) {
    calendarGridEl.innerHTML = "";
    calendarTitleEl.textContent = "Күнтізбе";

    if (!dateValue) {
        for (let i = 0; i < 28; i += 1) {
            const cell = document.createElement("div");
            cell.className = "calendar-day is-empty";
            cell.textContent = "0";
            calendarGridEl.appendChild(cell);
        }
        return;
    }

    const [yearStr, monthStr, dayStr] = dateValue.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    if (!year || !month || !day) {
        return;
    }

    const monthName = MONTHS_KK_GENITIVE[month - 1] || monthStr;
    calendarTitleEl.textContent = `${monthName} ${year}`;

    const firstDate = new Date(year, month - 1, 1);
    const monthDays = new Date(year, month, 0).getDate();
    const mondayFirstOffset = (firstDate.getDay() + 6) % 7;

    for (let i = 0; i < mondayFirstOffset; i += 1) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-day is-empty";
        emptyCell.textContent = "0";
        calendarGridEl.appendChild(emptyCell);
    }

    for (let currentDay = 1; currentDay <= monthDays; currentDay += 1) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        cell.textContent = String(currentDay);

        if (currentDay === day) {
            cell.classList.add("is-event");
        }

        calendarGridEl.appendChild(cell);
    }
}

function setCountdownValues(days, hours, minutes, seconds) {
    countDaysEl.textContent = pad2(days);
    countHoursEl.textContent = pad2(hours);
    countMinutesEl.textContent = pad2(minutes);
    countSecondsEl.textContent = pad2(seconds);
}

function startCountdown(eventDateTime) {
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }

    if (!eventDateTime) {
        setCountdownValues(0, 0, 0, 0);
        return;
    }

    const tick = () => {
        const now = Date.now();
        const diffMs = Math.max(0, eventDateTime.getTime() - now);

        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setCountdownValues(days, hours, minutes, seconds);
    };

    tick();
    countdownTimer = setInterval(tick, 1000);
}

function normalizePreviewSource(rawValue) {
    const value = (rawValue || "").toString().trim();
    if (!value) {
        return "";
    }

    if (value.startsWith("data:image/")) {
        return value;
    }

    if (value.startsWith("assets/")) {
        return value;
    }

    const marker = "/assets/";
    if (value.includes(marker)) {
        return `assets/${value.split(marker)[1]}`;
    }

    return value;
}

function updateGuestCount(nextValue) {
    const safeValue = Math.min(maxGuestsLimit, Math.max(1, Number(nextValue) || 1));
    guestsInput.value = String(safeValue);
}

function applyInvite(data) {
    invite = data;

    titleEl.textContent = invite.title || "Адлет";
    descriptionEl.textContent = invite.description || "Тойға қадірлі қонақ болуға шақырамыз!";
    dateLongEl.textContent = formatLongDate(invite.date);
    timeEl.textContent = invite.time || "19:00";
    placeEl.textContent = invite.place || "Орын көрсетілмеген";
    hostsEl.textContent = invite.hosts || "Әулет атауы";

    const eventDate = parseEventDateTime(invite.date, invite.time);
    renderCalendar(invite.date);
    startCountdown(eventDate);

    if (invite.mapLink) {
        mapLinkEl.href = invite.mapLink;
        mapLinkEl.style.opacity = "1";
        mapLinkEl.style.pointerEvents = "auto";
        mapLinkEl.textContent = "КАРТА АРҚЫЛЫ АШУ";
    } else {
        mapLinkEl.removeAttribute("href");
        mapLinkEl.style.opacity = "0.58";
        mapLinkEl.style.pointerEvents = "none";
        mapLinkEl.textContent = "Карта сілтемесі жоқ";
    }

    const previewPhoto = normalizePreviewSource(invite.previewPhoto);
    const isPhotoTemplate = previewPhoto.startsWith("data:image/") || previewPhoto.startsWith("assets/photos/");

    if (previewPhoto) {
        imageEl.src = previewPhoto;
    }

    photoBlockEl.classList.toggle("is-hidden", !isPhotoTemplate);

    maxGuestsLimit = Number(invite.maxGuests || 20);
    maxGuestsLimit = Math.max(1, Math.min(20, maxGuestsLimit));
    guestsInput.max = String(maxGuestsLimit);
    updateGuestCount(1);
}

async function loadInvite() {
    const params = new URLSearchParams(window.location.search);
    inviteId = params.get("id");

    if (!inviteId) {
        setMessage("Сілтеме қате: шақырту id жоқ");
        rsvpForm.querySelector("button[type='submit']").disabled = true;
        return;
    }

    try {
        const data = await request(`/public/invites/${encodeURIComponent(inviteId)}`);
        applyInvite(data);
    } catch (error) {
        setMessage(error.message || "Шақырту жүктелмеді");
        rsvpForm.querySelector("button[type='submit']").disabled = true;
    }
}

guestMinusBtn.addEventListener("click", () => {
    updateGuestCount(Number(guestsInput.value || 1) - 1);
});

guestPlusBtn.addEventListener("click", () => {
    updateGuestCount(Number(guestsInput.value || 1) + 1);
});

rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!inviteId || !invite) {
        setMessage("Шақырту деректері жүктелмеді");
        return;
    }

    const formData = new FormData(rsvpForm);
    const name = (formData.get("name") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const guests = Math.max(1, Number(formData.get("guests") || 1));
    const status = (formData.get("status") || "yes").toString();
    const note = (formData.get("note") || "").toString().trim();

    if (!name || !phone) {
        setMessage("Есіміңіз бен телефонды толтырыңыз");
        return;
    }

    if (guests > maxGuestsLimit) {
        setMessage(`Бұл шақыртуда максимум ${maxGuestsLimit} қонақ рұқсат`);
        return;
    }

    try {
        const result = await request(`/public/invites/${encodeURIComponent(inviteId)}/responses`, {
            method: "POST",
            body: JSON.stringify({
                name,
                phone,
                guests,
                status,
                note
            })
        });

        rsvpForm.reset();
        updateGuestCount(1);
        setMessage(result.message || "Рақмет! Жауабыңыз қабылданды");
    } catch (error) {
        setMessage(error.message || "Жауапты жіберу мүмкін болмады");
    }
});

loadInvite();
