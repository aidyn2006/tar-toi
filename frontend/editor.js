const DRAFT_KEY = "toi_editor_draft";

const params = new URLSearchParams(window.location.search);
const categoryFromUrl = params.get("category");
const nameFromUrl = params.get("name");

const backLink = document.getElementById("back-link");
const templateButtons = document.querySelectorAll(".template-item");
const photoInput = document.getElementById("photo-input");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const placeInput = document.getElementById("place");
const songInput = document.getElementById("song");
const mapLinkInput = document.getElementById("map-link");
const hostsInput = document.getElementById("hosts");
const maxGuestsInput = document.getElementById("max-guests");

const previewPhoto = document.getElementById("preview-photo");
const previewTitle = document.getElementById("preview-title");
const previewDescription = document.getElementById("preview-description");
const previewDatetime = document.getElementById("preview-datetime");
const previewPlace = document.getElementById("preview-place");

const saveBtn = document.getElementById("save-btn");
const shareBtn = document.getElementById("share-btn");
const payBtn = document.getElementById("pay-btn");
const messageEl = document.getElementById("editor-message");

function setMessage(text) {
    messageEl.textContent = text || "";
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "";
    }
    const [year, month, day] = dateValue.split("-");
    if (!year || !month || !day) {
        return dateValue;
    }
    return `${day}.${month}.${year}`;
}

function refreshPreview() {
    previewTitle.textContent = titleInput.value.trim() || "Тақырып 1";
    previewDescription.textContent = descriptionInput.value.trim() || "Құрметті қонақ, сізді тойға шақырамыз!";

    const dateText = formatDate(dateInput.value);
    const timeText = timeInput.value || "";
    previewDatetime.textContent = [dateText, timeText].filter(Boolean).join(" • ") || "Күні мен уақыты көрсетілмеген";

    previewPlace.textContent = placeInput.value.trim() || "Орын көрсетілмеген";
}

function collectDraft() {
    return {
        title: titleInput.value,
        description: descriptionInput.value,
        date: dateInput.value,
        time: timeInput.value,
        place: placeInput.value,
        song: songInput.value,
        mapLink: mapLinkInput.value,
        hosts: hostsInput.value,
        maxGuests: maxGuestsInput.value,
        previewPhoto: previewPhoto.src,
        selectedTemplate: document.querySelector(".template-item.is-active")?.dataset.image || ""
    };
}

function applyDraft(draft) {
    if (!draft) {
        return;
    }

    if (draft.title) titleInput.value = draft.title;
    if (draft.description) descriptionInput.value = draft.description;
    if (draft.date) dateInput.value = draft.date;
    if (draft.time) timeInput.value = draft.time;
    if (draft.place) placeInput.value = draft.place;
    if (draft.song) songInput.value = draft.song;
    if (draft.mapLink) mapLinkInput.value = draft.mapLink;
    if (draft.hosts) hostsInput.value = draft.hosts;
    if (draft.maxGuests) maxGuestsInput.value = draft.maxGuests;

    if (draft.previewPhoto) {
        previewPhoto.src = draft.previewPhoto;
    }

    if (draft.selectedTemplate) {
        templateButtons.forEach((button) => {
            const isActive = button.dataset.image === draft.selectedTemplate;
            button.classList.toggle("is-active", isActive);
        });
    }
}

function withParams(path) {
    const query = params.toString();
    return query ? `${path}?${query}` : path;
}

function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
        try {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

backLink.href = withParams("dashboard.html");

if (categoryFromUrl && !titleInput.value.trim()) {
    titleInput.value = categoryFromUrl;
}
if (nameFromUrl && !hostsInput.value.trim()) {
    hostsInput.value = `${nameFromUrl} әулеті`;
}

try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
        applyDraft(JSON.parse(raw));
    }
} catch {
    // Ignore invalid draft JSON.
}

refreshPreview();

[titleInput, descriptionInput, dateInput, timeInput, placeInput].forEach((input) => {
    input.addEventListener("input", refreshPreview);
});

templateButtons.forEach((button) => {
    button.addEventListener("click", () => {
        templateButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        const image = button.dataset.image;
        if (image) {
            previewPhoto.src = image;
        }
    });
});

photoInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        previewPhoto.src = reader.result;
    };
    reader.readAsDataURL(file);
});

saveBtn.addEventListener("click", () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(collectDraft()));
    setMessage("Өзгерістер сақталды");
});

shareBtn.addEventListener("click", async () => {
    const link = `${window.location.origin}/invite/demo`;
    try {
        await copyText(link);
        setMessage("Сілтеме көшірілді");
    } catch {
        setMessage("Сілтемені көшіру мүмкін болмады");
    }
});

payBtn.addEventListener("click", () => {
    setMessage("Төлем модулі кейін қосылады");
});
