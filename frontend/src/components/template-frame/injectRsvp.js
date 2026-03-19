export function injectRsvp(html, { inviteId = null, maxGuests = 0, lang = 'kk' } = {}) {
    if (!inviteId) return html;

    const limitText = lang === 'ru' ? 'Лимит гостей: ' : 'Қонақ саны лимиті: ';
    const sendFailText = lang === 'ru' ? 'Отправка не удалась' : 'Жіберу сәтсіз болды';
    const genericErrorText = lang === 'ru' ? 'Произошла ошибка' : 'Қате орын алды';
    const limit = maxGuests || 0;

    const script = `
<script>
(function () {
    var MAX_GUESTS = ${limit};

    window.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.guest-opt').forEach(function(button) {
            button.style.display = 'none';
        });

        var guestsInput = document.getElementById('rGuests');
        if (guestsInput) {
            guestsInput.removeAttribute('readonly');
            guestsInput.type = 'number';
            guestsInput.min = '1';

            if (MAX_GUESTS > 0) {
                guestsInput.max = String(MAX_GUESTS);
            } else {
                guestsInput.removeAttribute('max');
            }

            guestsInput.value = '1';
            guestsInput.style.width = '80px';
            guestsInput.style.textAlign = 'center';
            guestsInput.style.display = 'block';
            guestsInput.style.margin = '8px auto';

            var clampGuests = function() {
                var value = parseInt(guestsInput.value, 10) || 1;
                value = Math.max(1, value);
                if (MAX_GUESTS > 0) value = Math.min(value, MAX_GUESTS);
                guestsInput.value = String(value);
            };

            guestsInput.addEventListener('input', clampGuests);
            guestsInput.addEventListener('change', clampGuests);
        }
    });

    window.changeGuests = function changeGuests(delta) {
        var input = document.getElementById('rGuests');
        if (!input) return;

        var next = parseInt(input.value || '1', 10) + (delta || 0);
        if (isNaN(next)) next = 1;
        next = Math.max(1, next);
        if (MAX_GUESTS > 0) next = Math.min(next, MAX_GUESTS);
        input.value = String(next);
    };

    window.submitRSVP = async function submitRSVP() {
        var nameEl = document.getElementById('rName');
        var phoneEl = document.getElementById('rPhone');
        var noteEl = document.getElementById('rNote');
        var formEl = document.getElementById('rsvpForm');
        var successEl = document.getElementById('successMsg');

        if (!nameEl || !phoneEl || !formEl || !successEl) return;

        var name = (nameEl.value || '').trim();
        var phone = (phoneEl.value || '').trim();

        if (!name) {
            nameEl.focus();
            return;
        }

        if (!phone) {
            phoneEl.focus();
            return;
        }

        var err = document.getElementById('rsvpError');
        if (!err) {
            err = document.createElement('div');
            err.id = 'rsvpError';
            err.style.color = '#8b1e1e';
            err.style.fontFamily = "'Cinzel', serif";
            err.style.fontSize = '10px';
            err.style.letterSpacing = '1.5px';
            err.style.margin = '8px 0 14px';

            var submitTarget = formEl.querySelector('.submit-btn, .btn-submit, .submit');
            if (submitTarget) {
                formEl.insertBefore(err, submitTarget);
            } else {
                formEl.appendChild(err);
            }
        }

        err.textContent = '';

        var guestsInput = document.getElementById('rGuests');
        var guestsCount = Math.max(1, parseInt(guestsInput ? guestsInput.value : '1', 10) || 1);

        if (MAX_GUESTS > 0 && guestsCount > MAX_GUESTS) {
            err.textContent = '${limitText}' + MAX_GUESTS;
            if (guestsInput) guestsInput.value = String(MAX_GUESTS);
            return;
        }

        try {
            var res = await fetch('/api/v1/invites/${inviteId}/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestName: name,
                    phone: phone || null,
                    guestsCount: guestsCount,
                    attending: true,
                    note: (noteEl ? noteEl.value : '').trim() || null
                })
            });

            if (!res.ok) {
                var data = await res.json().catch(function() { return {}; });
                throw new Error(data.message || '${sendFailText}');
            }

            formEl.style.display = 'none';
            successEl.style.display = 'block';
        } catch (error) {
            err.textContent = error.message || '${genericErrorText}';
        }
    };
})();
</script>`;

    return html.replace('</body>', `${script}\n</body>`);
}

export const injectRsvpApi = injectRsvp;
