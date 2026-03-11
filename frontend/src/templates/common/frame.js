(function(){
  'use strict';

  function byId(id){ return document.getElementById(id); }
  function setText(id, text){ var el = byId(id); if (el) el.textContent = text || ''; }

  function fmtDate(day){
    if (!day) return '01.01.2027';
    var p = day.split('-');
    var dd = p[0] || '01';
    var mm = p[1] || '01';
    var yy = p[2] || '2027';
    return dd + '.' + mm + '.' + yy;
  }

  function getYear(day){
    if (!day) return '2027';
    var p = day.split('-');
    return p[2] || '2027';
  }

  function applyReveal(){
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function(el){ el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target);} });
    }, { threshold: 0.1 });
    els.forEach(function(el){ obs.observe(el); });
  }

  function setPhoto(cfg){
    var url = cfg.heroPhotoUrl || cfg.previewPhotoUrl || (cfg.gallery && cfg.gallery[0]) || '';
    var box = byId('heroPhoto');
    if (!box) return;
    if (!url) return;
    box.innerHTML = '<img src="'+url+'" alt="photo" class="hero-photo-img" style="width:100%;height:100%;object-fit:cover;display:block;">';
  }

  function setGallery(cfg){
    var slides = byId('gallerySlides'); if (!slides) return;
    var g = cfg.gallery || [];
    slides.innerHTML = '';
    if (!g.length) {
      slides.innerHTML = '<div class="card" style="grid-column: 1 / -1; text-align:center; color: var(--muted); font-weight:600;">Фотоларды жүктеңіз — олар осында шығады.</div>';
      return;
    }
    g.forEach(function(url){
      var img = document.createElement('img');
      img.src = url; img.alt = 'photo';
      slides.appendChild(img);
    });
  }

  function setMap(cfg){
    var btn = byId('mapBtn');
    if (!btn) return;
    if (cfg.locationUrl) {
      btn.href = cfg.locationUrl;
      btn.style.display = 'inline-flex';
    } else {
      btn.style.display = 'none';
    }
  }

  function updateCalendar(cfg){
    var dateStr = cfg.day || '';
    var parts = dateStr.split('-');
    var calMo = byId('calMo');
    var grid = byId('calGrid');
    if (!calMo || !grid || parts.length < 3) return;
    var dd = parseInt(parts[0], 10) || 1;
    var mm = parseInt(parts[1], 10) || 1;
    var yy = parseInt(parts[2], 10) || 2027;
    var months = ['Қаңтар','Ақпан','Наурыз','Сәуір','Мамыр','Маусым','Шілде','Тамыз','Қыркүйек','Қазан','Қараша','Желтоқсан'];
    calMo.textContent = (months[mm - 1] || '') + ' ' + yy;
    var first = new Date(yy, mm - 1, 1).getDay();
    var offset = first === 0 ? 6 : first - 1;
    var total = new Date(yy, mm, 0).getDate();
    grid.innerHTML = '';
    for (var i=0; i<offset; i++) grid.innerHTML += '<div class="cal-day other"></div>';
    for (var d=1; d<=total; d++) {
      var cls = d === dd ? 'cal-day today' : 'cal-day';
      grid.innerHTML += '<div class="'+cls+'">'+d+'</div>';
    }
  }

  var countdownTimer = null;
  function updateCountdown(cfg){
    var dateStr = cfg.day || '';
    var timeStr = cfg.hour || '00:00';
    var parts = dateStr.split('-');
    if (parts.length < 3) return;
    var dd = parseInt(parts[0], 10) || 1;
    var mm = parseInt(parts[1], 10) || 1;
    var yy = parseInt(parts[2], 10) || 2027;
    var target = new Date(yy + '-' + ('0'+mm).slice(-2) + '-' + ('0'+dd).slice(-2) + 'T' + timeStr + ':00');
    var cdD = byId('cdD'), cdH = byId('cdH'), cdM = byId('cdM'), cdS = byId('cdS');
    if (!cdD || !cdH || !cdM || !cdS) return;
    var tick = function(){
      var diff = Math.max(0, target - Date.now());
      cdD.textContent = ('0'+Math.floor(diff/86400000)).slice(-2);
      cdH.textContent = ('0'+Math.floor(diff/3600000)%24).slice(-2);
      cdM.textContent = ('0'+Math.floor(diff/60000)%60).slice(-2);
      cdS.textContent = ('0'+Math.floor(diff/1000)%60).slice(-2);
    };
    tick();
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(tick, 1000);
    updateCalendar(cfg);
  }

  function changeGuests(delta){
    var inp = byId('rGuests');
    if (!inp) return;
    var next = Math.max(1, (parseInt(inp.value || '1', 10) || 1) + delta);
    inp.value = String(next);
  }
  window.changeGuests = changeGuests;

  function submitRSVP(){
    var form = byId('rsvpForm');
    if (!form) return;
    if (form.checkValidity && !form.checkValidity()) return;
    var success = byId('successMsg');
    var cfg = (typeof window.CONFIG !== 'undefined') ? window.CONFIG : {};
    var doOk = function(){ if (success) success.style.display = 'block'; form.style.display = 'none'; };
    if (cfg.inviteId) {
      submitRsvpApi(cfg).then(function(ok){ if (ok) doOk(); });
    } else {
      doOk();
    }
  }
  window.submitRSVP = submitRSVP;

  function wireForm(){
    var dec = document.querySelector('.gc-btn:first-of-type');
    var inc = document.querySelector('.gc-btn:last-of-type');
    if (dec) dec.addEventListener('click', function(){ changeGuests(-1); });
    if (inc) inc.addEventListener('click', function(){ changeGuests(1); });
    var form = byId('rsvpForm');
    if (form) form.addEventListener('submit', function(e){ e.preventDefault(); submitRSVP(); });
  }

  var musicBtn = null;
  var musicAudio = null;
  function ensureMusicBtn(){
    if (musicBtn) return musicBtn;
    musicBtn = document.createElement('button');
    musicBtn.className = 'music-btn';
    musicBtn.textContent = '▶ Музыка';
    musicBtn.addEventListener('click', function(){
      if (!musicAudio) return;
      if (musicAudio.paused) { musicAudio.play().catch(function(){}); musicBtn.textContent = '⏸ Музыка'; }
      else { musicAudio.pause(); musicBtn.textContent = '▶ Музыка'; }
    });
    var holder = document.getElementById('musicBar');
    if (holder) holder.appendChild(musicBtn); else document.body.appendChild(musicBtn);
    return musicBtn;
  }

  function updateMusic(cfg){
    var url = (cfg.music && cfg.music.url) ? cfg.music.url : '';
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
    musicBtn.style.display = 'inline-flex';
    musicBtn.innerHTML = musicAudio.paused ? '▶' : '⏸';

    var tryStart = function(){
      musicAudio.play().then(function(){ musicBtn.textContent = '⏸'; cleanup(); }).catch(function(){});
    };
    var cleanup = function(){
      ['click','touchstart','keydown'].forEach(function(ev){ document.removeEventListener(ev, tryStartOnce, true); });
    };
    var tryStartOnce = function(){ tryStart(); };

    // Autoplay attempt if allowed
    if (cfg.autoplay && musicAudio.paused) {
      setTimeout(tryStart, 300);
      ['click','touchstart','keydown'].forEach(function(ev){ document.addEventListener(ev, tryStartOnce, true); });
    }
  }

  function startAutoScroll(cfg){
    if (!cfg.autoplay) return;
    var speed = 1; // px per frame
    var scrolling = true;
    var stop = function(){ scrolling = false; };
    document.addEventListener('wheel', stop, { once: true });
    document.addEventListener('touchstart', stop, { once: true });

    function step(){
      if (!scrolling) return;
      var maxY = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxY) { scrolling = false; return; }
      window.scrollBy({ top: speed, behavior: 'instant' });
      requestAnimationFrame(step);
    }
    setTimeout(function(){ requestAnimationFrame(step); }, 1200);
  }

  function applyConfig(cfg){
    if (!cfg) return;
    var tplKey = (cfg.template || '').toString();
    var isWedding = tplKey.indexOf('wedding/') === 0;
    var bride = cfg.names && cfg.names.bride ? cfg.names.bride : (cfg.title || 'Қонақ');
    var groom = cfg.names && cfg.names.groom ? cfg.names.groom : '';
    var mainName = isWedding && groom ? groom : bride;
    var pairName = isWedding ? bride : '';
    var namesLine = isWedding && pairName ? (groom + ' & ' + pairName) : bride;

    setText('heroName', mainName);
    setText('heroNames', namesLine);
    setText('heroNamesLine', namesLine);
    setText('heroNamesInline', namesLine);
    setText('heroCeremony', cfg.ceremony || (isWedding ? 'Үйлену тойы' : 'Тұсаукесер'));

    var dateLine = fmtDate(cfg.day) + (cfg.hour ? ' · ' + cfg.hour : '');
    setText('heroDateLine', dateLine);
    setText('evDate', fmtDate(cfg.day));
    setText('evTime', cfg.hour || '');
    setText('eventText', cfg.description || '');
    setText('locationName', cfg.location || '');

    var foot = (cfg.ceremony || 'Той') + ' · ' + getYear(cfg.day);
    setText('footLine', foot);
    setText('ownersLine', cfg.toiOwners || '');
    setText('ownersText', cfg.toiOwners || '');
    var ownersBlock = byId('ownersBlock');
    if (ownersBlock) ownersBlock.style.display = cfg.toiOwners ? 'flex' : 'none';

    setPhoto(cfg);
    setGallery(cfg);
    setMap(cfg);
    updateCountdown(cfg);
    updateMusic(cfg);
    startAutoScroll(cfg);
  }

  function submitRsvpApi(cfg){
    var inviteId = cfg.inviteId;
    if (!inviteId) return Promise.resolve(false);
    var base = cfg.apiBase || (window.location ? window.location.origin : '');
    // Avoid cross-origin access to parent: never read window.parent
    var url = base.replace(/\/$/, '') + '/api/v1/invites/' + inviteId + '/respond';
    var name = (byId('rName') && byId('rName').value) || '';
    var phone = (byId('rPhone') && byId('rPhone').value) || '';
    var guests = (byId('rGuests') && byId('rGuests').value) || '1';
    var note = (byId('rNote') && byId('rNote').value) || '';
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestName: name, phone: phone, guestsCount: Number(guests) || 1, note: note, attending: true })
    }).then(function(res){ return res.ok; }).catch(function(){ return false; });
  }

  function onMessage(e){
    if (e && e.data && e.data.type === 'UPDATE_CONFIG') {
      var cfg = e.data.config || {};
      window.CONFIG = cfg;
      applyConfig(cfg);
    }
  }

  function init(){
    applyReveal();
    wireForm();
    if (typeof window.CONFIG !== 'undefined') {
      applyConfig(window.CONFIG);
    }
    window.addEventListener('message', onMessage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, false);
  } else {
    init();
  }
})();
