<?php
$config = [
        'title'      => 'Той · Түнгі Жұлдыз',
        'ceremony'   => 'Тұсаукесер',
        'template'   => 'tusaukeser/template7',
        'fonts'      => 'family=Unbounded:wght@300;400;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Herr+Von+Muellerhoff',
        'autoplay'   => false,
        'musicUrl'   => '',
        'toiOwners'  => '',
        'day'        => '01-01-2027',
        'hour'       => '18:00',
        'location'   => 'Алматы, Grand Hall',
        'locationUrl'=> '',
        'gallery'    => [],
        'description'=> 'Құрметті ағайын-туыс, дос-жарандар! Сіздерді тойымызға шақырамыз.',
];
$partials = dirname(__DIR__) . '/common/partials';
include $partials . '/head.php';
?>

    <style>
        /* ══════════════════════════════════════════
           ТҮНГІ ЖҰЛДЫЗ v2 — открытый тёмный стиль
           Меняй только :root
           ══════════════════════════════════════════ */
        :root {
            --bg-page:    #12141f;
            --bg:         #181b2e;
            --card:       rgba(255,255,255,0.05);
            --accent:     #e8c46a;
            --accent-soft:rgba(232,196,106,0.13);
            --accent-rgb: 232,196,106;
            --text:       #ede5d0;
            --muted:      #8a8070;
            --border:     rgba(232,196,106,0.22);
            --shadow:     0 12px 48px rgba(0,0,0,0.4);
            --radius:     16px;
            --font-head:  'Unbounded', sans-serif;
            --font-body:  'Libre Baskerville', serif;
            --font-script:'Herr Von Muellerhoff', cursive;
            --bg-pattern: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360' viewBox='0 0 360 360'><g opacity='0.18' fill='none' stroke='%23e8c46a' stroke-width='0.6'><polygon points='180,20 196,68 246,68 206,98 220,146 180,116 140,146 154,98 114,68 164,68'/><circle cx='180' cy='180' r='155'/><circle cx='180' cy='180' r='110'/></g></svg>");
        }

        /* ── звёзды ── */
        .app::after {
            content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
            background-image:
                    radial-gradient(1.5px 1.5px at 12% 9%,  rgba(232,196,106,0.7) 0%, transparent 100%),
                    radial-gradient(1px   1px   at 70% 6%,  rgba(255,255,255,0.5) 0%, transparent 100%),
                    radial-gradient(1.5px 1.5px at 38% 18%, rgba(232,196,106,0.5) 0%, transparent 100%),
                    radial-gradient(1px   1px   at 85% 25%, rgba(255,255,255,0.35) 0%, transparent 100%),
                    radial-gradient(1px   1px   at 53% 4%,  rgba(255,255,255,0.5) 0%, transparent 100%),
                    radial-gradient(1px   1px   at 26% 32%, rgba(232,196,106,0.45) 0%, transparent 100%),
                    radial-gradient(1px   1px   at 90% 14%, rgba(255,255,255,0.3) 0%, transparent 100%),
                    radial-gradient(1px   1px   at 60% 16%, rgba(255,255,255,0.4) 0%, transparent 100%),
                    radial-gradient(1px   1px   at 45% 28%, rgba(232,196,106,0.3) 0%, transparent 100%),
                    radial-gradient(1px   1px   at 8%  40%, rgba(255,255,255,0.25) 0%, transparent 100%);
        }

        /* ── HERO ── */
        .hero { text-align:center; padding:40px 20px 16px; position:relative; }

        .hero-top-decor { text-align:center; padding-top:18px; margin-bottom:-6px; }
        .hero-top-decor img { width:130px; opacity:0.5; }

        .hero .hero-photo-box {
            width:192px; height:192px; border:none;
            box-shadow:
                    0 0 0 2px var(--accent),
                    0 0 0 9px rgba(var(--accent-rgb),0.09),
                    0 0 70px rgba(var(--accent-rgb),0.18);
            background:rgba(var(--accent-rgb),0.05);
            position:relative;
        }
        .hero .hero-photo-box::before {
            content:''; position:absolute; inset:-16px; border-radius:50%;
            border:1px dashed rgba(var(--accent-rgb),0.28);
            animation:orbit 22s linear infinite; pointer-events:none;
        }
        @keyframes orbit { to { transform:rotate(360deg); } }

        .badge {
            font-family:var(--font-head); font-size:7px; letter-spacing:4px;
            background:transparent; color:var(--accent);
            border:1px solid rgba(var(--accent-rgb),0.32);
            padding:5px 18px; border-radius:999px; margin-bottom:12px;
        }
        .hero-name, #heroNames {
            font-family:var(--font-script) !important;
            font-size:70px !important; font-weight:400 !important;
            color:var(--accent) !important; line-height:1.05;
            text-shadow:0 0 50px rgba(var(--accent-rgb),0.35);
            margin:6px 0 2px;
        }
        .hero .date-line {
            font-family:var(--font-head); font-size:8px; letter-spacing:5px;
            text-transform:uppercase; color:var(--muted); margin-top:8px;
        }

        /* ── ОЮ орнамент ── */
        .decor-oiu { text-align:center; margin:8px 0 2px; }
        .decor-oiu img { width:170px; opacity:0.38; }

        /* ── SVG/PNG разделители ── */
        .decor-svg { text-align:center; margin:6px 0; line-height:0; }
        .decor-svg img { width:200px; opacity:0.50; display:inline-block; }
        .decor-svg.sm img { width:110px; opacity:0.40; }

        /* ── CSS орнамент ── */
        .ornament { display:flex; align-items:center; gap:10px; padding:8px 20px; margin:2px 0; }
        .ornament-line { flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.4),transparent); }
        .ornament-sym { color:var(--accent); font-size:11px; letter-spacing:4px; opacity:0.65; flex-shrink:0; }

        /* ── ПРИВЕТСТВИЕ ── */
        .greeting {
            margin:4px 16px 6px; padding:26px 22px;
            border:1px solid rgba(var(--accent-rgb),0.16);
            border-radius:var(--radius);
            background:rgba(var(--accent-rgb),0.04);
            text-align:center; position:relative;
        }
        .greeting::before,.greeting::after { content:'✦'; position:absolute; color:rgba(var(--accent-rgb),0.3); font-size:9px; }
        .greeting::before { top:10px; left:14px; }
        .greeting::after  { bottom:10px; right:14px; }
        .greeting-eyebrow { font-family:var(--font-head); font-size:7px; letter-spacing:4px; text-transform:uppercase; color:var(--accent); opacity:0.65; margin-bottom:14px; }
        .greeting-body { font-family:var(--font-body); font-style:italic; font-size:18px; line-height:1.9; color:var(--text); opacity:0.88; }
        .greeting-script { font-family:var(--font-script); font-size:38px; color:var(--accent); margin-top:12px; display:block; opacity:0.78; }

        /* ══════════════════════════
           INFO — отдельные блоки
           ══════════════════════════ */
        .info-blocks { display:grid; gap:10px; padding:0 16px; }

        .info-block {
            display:flex; align-items:center; gap:14px;
            padding:16px 18px;
            background:rgba(255,255,255,0.04);
            border:1px solid rgba(var(--accent-rgb),0.16);
            border-radius:14px;
            position:relative;
            overflow:hidden;
        }
        /* золотая полоска слева */
        .info-block::before {
            content:''; position:absolute;
            left:0; top:10%; bottom:10%;
            width:2px; border-radius:2px;
            background:linear-gradient(180deg, transparent, var(--accent), transparent);
            opacity:0.7;
        }

        .info-block-icon {
            width:38px; height:38px; flex-shrink:0;
            border-radius:10px;
            background:rgba(var(--accent-rgb),0.1);
            border:1px solid rgba(var(--accent-rgb),0.2);
            display:grid; place-items:center;
            font-size:16px;
        }
        .info-block-label {
            font-family:var(--font-head); font-size:6px;
            letter-spacing:3px; text-transform:uppercase;
            color:var(--accent); opacity:0.65; margin-bottom:4px;
        }
        .info-block-value {
            font-family:var(--font-body); font-size:16px;
            color:var(--text); line-height:1.3;
        }

        /* кнопка 2GIS отдельно */
        .map-block {
            margin:0 16px;
            display:flex; align-items:center; justify-content:center; gap:10px;
            padding:14px 20px;
            background:rgba(var(--accent-rgb),0.07);
            border:1px solid rgba(var(--accent-rgb),0.25);
            border-radius:14px;
            text-decoration:none;
            transition:all 0.25s;
        }
        .map-block:hover { background:rgba(var(--accent-rgb),0.14); box-shadow:0 0 24px rgba(var(--accent-rgb),0.15); }
        .map-block img { width:22px; }
        .map-block span {
            font-family:var(--font-head); font-size:8px;
            letter-spacing:3px; text-transform:uppercase;
            color:var(--accent);
        }

        /* ── ОБЩИЕ КАРТОЧКИ ── */
        .card { background:rgba(255,255,255,0.04); border:1px solid rgba(var(--accent-rgb),0.15); border-radius:var(--radius); }

        /* ── ЗАГОЛОВКИ ── */
        .heading { font-family:var(--font-head); font-size:8px; letter-spacing:4px; text-transform:uppercase; color:var(--accent); text-align:center; margin-bottom:14px; opacity:0.75; }

        /* ── COUNTDOWN ── */
        .counter-box { background:rgba(var(--accent-rgb),0.05); border:1px solid rgba(var(--accent-rgb),0.15); border-radius:12px; padding:16px 6px; position:relative; overflow:hidden; }
        .counter-box::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--accent),transparent); opacity:0.4; }
        .counter-box .num { font-family:var(--font-head); font-size:22px; font-weight:600; color:var(--accent); letter-spacing:-1px; }
        .counter-box .label { font-family:var(--font-head); font-size:6px; letter-spacing:2px; color:var(--muted); margin-top:6px; }

        /* ── CALENDAR ── */
        .cal-head { font-family:var(--font-head); font-size:9px; letter-spacing:3px; color:var(--accent); text-transform:uppercase; justify-content:center; opacity:0.8; }
        .cal-day { font-family:var(--font-body); font-size:13px; color:var(--muted); background:rgba(255,255,255,0.02); border-color:rgba(255,255,255,0.06); }
        .cal-day.today { background:var(--accent); color:#12141f; border-color:var(--accent); font-weight:700; box-shadow:0 0 18px rgba(var(--accent-rgb),0.4); }

        /* ── RSVP ── */
        .rsvp-form input,.rsvp-form textarea { background:rgba(255,255,255,0.05); border-color:rgba(var(--accent-rgb),0.2); color:var(--text); font-family:var(--font-body); font-size:15px; }
        .rsvp-form input::placeholder,.rsvp-form textarea::placeholder { color:var(--muted); font-style:italic; }
        .rsvp-form input:focus,.rsvp-form textarea:focus { border-color:rgba(var(--accent-rgb),0.5); outline:none; background:rgba(var(--accent-rgb),0.06); }
        .gc-btn { background:rgba(var(--accent-rgb),0.08); border-color:rgba(var(--accent-rgb),0.25); color:var(--accent); }
        .submit-btn { background:var(--accent); color:#12141f; font-family:var(--font-head); font-size:8px; letter-spacing:3px; border-color:var(--accent); font-weight:600; }
        .submit-btn:hover { background:#f0d07a; }
        .success-msg { background:rgba(var(--accent-rgb),0.08); color:var(--accent); border:1px solid rgba(var(--accent-rgb),0.25); font-family:var(--font-head); font-size:9px; letter-spacing:2px; }

        /* ── FOOTER ── */
        .footer { font-family:var(--font-head); font-size:8px; letter-spacing:3px; text-transform:uppercase; color:var(--muted); }

        /* ── MUSIC ── */
        .music-btn { background:rgba(18,20,31,0.95); border-color:rgba(var(--accent-rgb),0.3); color:var(--accent); font-family:var(--font-head); font-size:8px; letter-spacing:2px; backdrop-filter:blur(10px); }

        /* ── GALLERY ── */
        .gallery-grid img { border-color:rgba(var(--accent-rgb),0.15); filter:brightness(0.88); border-radius:10px; }
    </style>

    </head>
    <body>
<div class="app">
    <div class="border-strip left"  style="background-image:url('https://shaqyrtu.kz/template4/border.png')"></div>
    <div class="border-strip right" style="background-image:url('https://shaqyrtu.kz/template4/border.png')"></div>

    <div class="inner">

        <!-- цветок сверху -->
        <div class="hero-top-decor">
            <img src="https://shaqyrtu.kz/template12/gul.png" alt="">
        </div>

        <?php include $partials . '/hero.php'; ?>

        <!-- казахский орнамент -->
        <div class="decor-oiu">
            <img src="https://shaqyrtu.kz/template9/oiu.png" alt="">
        </div>

        <!-- SVG декор -->
        <div class="decor-svg">
            <img src="https://shaqyrtu.kz/template4/3.svg" alt="">
        </div>

        <!-- приветствие -->
        <div class="greeting reveal">
            <div class="greeting-eyebrow">Хабарлама</div>
            <div class="greeting-body" id="eventText">
                Құрметті ағайын-туыс,<br>
                дос-жарандар!<br><br>
                Сіздерді тойымызға<br>шақырамыз.
            </div>
            <span class="greeting-script">Тойға шақырамыз</span>
        </div>

        <!-- цветы по бокам -->
        <div style="display:flex;justify-content:space-between;padding:4px 8px;line-height:0">
            <img src="https://shaqyrtu.kz/template12/gul.png" style="width:56px;opacity:0.45" alt="">
            <img src="https://shaqyrtu.kz/template12/gul.png" style="width:56px;opacity:0.45;transform:scaleX(-1)" alt="">
        </div>

        <!-- ══ INFO — отдельные блоки ══ -->
        <?php include $partials . '/info.php'; ?>


        <!-- PNG декор -->
        <div class="decor-svg sm">
            <img src="https://shaqyrtu.kz/template12/decor.png" alt="">
        </div>

        <?php include $partials . '/gallery.php'; ?>

        <!-- SVG декор -->
        <div class="decor-svg">
            <img src="https://shaqyrtu.kz/template4/3.svg" alt="">
        </div>

        <?php include $partials . '/countdown.php'; ?>

        <div class="ornament">
            <div class="ornament-line"></div>
            <div class="ornament-sym">✦ ◆ ✦</div>
            <div class="ornament-line"></div>
        </div>

        <?php include $partials . '/calendar.php'; ?>

        <!-- цветок -->
        <div style="text-align:center;line-height:0;margin:4px 0">
            <img src="https://shaqyrtu.kz/template12/gul.png" style="width:80px;opacity:0.45" alt="">
        </div>

        <?php include $partials . '/rsvp.php'; ?>

        <!-- финальный декор -->
        <div class="decor-svg sm" style="margin-top:8px">
            <img src="https://shaqyrtu.kz/template12/decor.png" alt="">
        </div>

        <?php include $partials . '/footer.php'; ?>

    </div>
</div>

<?php include $partials . '/scripts.php'; ?>