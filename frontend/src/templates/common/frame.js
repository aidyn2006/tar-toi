/**
 * Shared frame logic for invitation templates. Expects window.CONFIG to be set by the page.
 */
(function() {
  const byId = (id) => document.getElementById(id);
  const CONFIG = window.CONFIG || {};

  function applyReveal() {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  }

  function updateCalendar(cfg) {
    const dateStr = cfg.day || '';
    const parts = dateStr.split('-');
    const calMo = byId('calMo');
    const grid = byId('calGrid');
    if (!calMo || !grid || parts.length < 3) return;
    const [dd, mm, yy] = parts.map(Number);
    const months = ['Қаңтар','Ақпан','Наурыз','Сәуір','Мамыр','Маусым','Шілде','Тамыз','Қыркүйек','Қазан','Қараша','Желтоқсан'];
    calMo.textContent = `${months[mm - 1] || ''} ${yy || ''}`;
    const first = new Date(yy, mm - 1, 1).getDay();
    const offset = first === 0 ? 6 : first - 1;
    const total = new Date(yy, mm, 0).getDate();
    grid.innerHTML = '';
    for (let i = 0; i < offset; i++) grid.innerHTML += '<div class="cal-day other"></div>';
    for (let d = 1; d <= total; d++) {
      const cls = d === dd ? 'cal-day today' : 'cal-day';
      grid.innerHTML += `<div class="${cls}">${d}</div>`;
    }
  }

  function updateCountdown(cfg) {
    const dateStr = cfg.day || '';
    const timeStr = cfg.hour || '00:00';
    const parts = dateStr.split('-');
    if (parts.length < 3) return;
    const [dd, mm, yy] = parts.map(Number);
    const target = new Date(`${yy}-${String(mm).padStart(2,'0')}-${String(dd).padStart(2,'0')}T${timeStr}:00`);
    const dateLine = `${String(dd).padStart(2,'0')}.${String(mm).padStart(2,'0')}.${yy}`;
    const hDateLine = byId('heroDateLine');
    if (hDateLine) hDateLine.textContent = cfg.hour ? `${dateLine} · ${cfg.hour}` : dateLine;
    const evDate = byId('evDate');
    if (evDate) evDate.textContent = dateLine;
    const evTime = byId('evTime');
    if (evTime) evTime.textContent = cfg.hour || '';
    const cdD = byId('cdD'), cdH = byId('cdH'), cdM = byId('cdM'), cdS = byId('cdS');
    if (!cdD || !cdH || !cdM || !cdS) return;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      cdD.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
      cdH.textContent = String(Math.floor(diff / 3600000) % 24).padStart(2, '0');
      cdM.textContent = String(Math.floor(diff / 60000) % 60).padStart(2, '0');
      cdS.textContent = String(Math.floor(diff / 1000) % 60).padStart(2, '0');
    };
    tick();
    if (window.__cdInterval) clearInterval(window.__cdInterval);
    window.__cdInterval = setInterval(tick, 1000);
    updateCalendar(cfg);
  }

  window.changeGuests = function(delta) {
    const inp = byId('rGuests');
    if (!inp) return;
    const next = Math.max(1, (parseInt(inp.value || '1', 10) || 1) + delta);
    inp.value = String(next);
  };

  window.submitRSVP = function() {
    const form = byId('rsvpForm');
    const ok = form && form.checkValidity();
    if (ok) {
      const success = byId('successMsg');
      if (success) success.style.display = 'block';
      if (form) form.style.display = 'none';
    }
  };

  let musicBtn = null;
  let musicAudio = null;
  function ensureMusicBtn() {
    if (musicBtn) return musicBtn;
    musicBtn = document.createElement('button');
    musicBtn.className = 'music-btn';
    musicBtn.textContent = '▶ Музыка';
    musicBtn.addEventListener('click', () => {
      if (!musicAudio) return;
      if (musicAudio.paused) {
        musicAudio.play().catch(() => {});
        musicBtn.textContent = '⏸ Музыка';
      } else {
        musicAudio.pause();
        musicBtn.textContent = '▶ Музыка';
      }
    });
    document.body.appendChild(musicBtn);
    return musicBtn;
  }

  function updateMusic(cfg) {
    const url = cfg?.music?.url || '';
    if (!url) {
      if (musicBtn) musicBtn.style.display = 'none';
      if (musicAudio) { musicAudio.pause(); musicAudio.src = ''; }
      return;
    }
    ensureMusicBtn();
    if (!musicAudio) {
      musicAudio = new Audio();
      musicAudio.loop = true;
      musicAudio.crossOrigin = 'anonymous';
      musicAudio.volume = 0.5;
    }
    if (musicAudio.src !== url) {
      musicAudio.pause();
      musicAudio.src = url;
    }
    musicBtn.style.display = 'flex';
    musicBtn.textContent = musicAudio.paused ? '▶ Музыка' : '⏸ Музыка';
  }

  applyReveal();
  updateCountdown(CONFIG);
  updateMusic(CONFIG);

  window.addEventListener('message', (e) => {
    if (e?.data?.type === 'UPDATE_CONFIG' && e.data.config) {
      updateCountdown(e.data.config);
      updateMusic(e.data.config);
    }
  });
})();
