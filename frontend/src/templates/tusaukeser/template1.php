<?php
$config = [
        'title'    => 'Той · Golden Bloom',
        'ceremony' => 'Тұсаукесер',
        'template' => 'tusaukeser/template6',
        'fonts'    => 'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Great+Vibes&family=Cinzel:wght@400;600;700',
];
$partials = dirname(__DIR__) . '/common/partials';
include $partials . '/head.php';
?>

    <style>
        :root {
            --bg-page:    #f5ede0;
            --bg:         #fffcf7;
            --card:       #ffffff;
            --accent:     #b8862a;
            --accent-soft:#f5e6c8;
            --text:       #2c1f0e;
            --muted:      #8a6f4a;
            --border:     rgba(184,134,42,0.20);
            --shadow:     0 10px 40px rgba(184,134,42,0.10);
            --radius:     18px;
            --font-head:  'Cinzel', serif;
            --font-body:  'Cormorant Garamond', serif;
            --font-script:'Great Vibes', cursive;
            --bg-pattern: none;
        }

        .decor-divider { text-align:center; margin:4px 0; line-height:0; }
        .decor-divider img { width:220px; opacity:0.55; display:inline-block; }
        .decor-divider.sm img { width:130px; opacity:0.45; }

        .decor-flower { text-align:center; margin:2px 0; line-height:0; }
        .decor-flower img { width:100px; opacity:0.60; display:inline-block; }
        .decor-flower.side { display:flex; justify-content:space-between; padding:0 10px; }
        .decor-flower.side img { width:64px; opacity:0.45; }
        .decor-flower.side img:last-child { transform:scaleX(-1); }

        .hero { text-align:center; padding-top:0; }
        .hero-top-flower { text-align:center; padding-top:20px; margin-bottom:-8px; }
        .hero-top-flower img { width:150px; opacity:0.55; }
        .hero .hero-photo-box { border:2.5px solid var(--accent); box-shadow:0 0 0 6px rgba(184,134,42,0.07),0 0 0 8px rgba(184,134,42,0.03),0 8px 36px rgba(184,134,42,0.14); width:200px; height:200px; }
        .hero-name, #heroNames { font-family:var(--font-script) !important; font-size:66px !important; font-weight:400 !important; color:var(--accent) !important; line-height:1.1; text-shadow:0 2px 20px rgba(184,134,42,0.15); margin:8px 0 2px; }
        .badge { font-family:var(--font-head); letter-spacing:3px; font-size:9px; background:var(--accent-soft); color:var(--accent); border:1px solid rgba(184,134,42,0.25); }
        .hero .date-line { font-family:var(--font-head); font-size:11px; letter-spacing:3px; color:var(--muted); text-transform:uppercase; margin-top:4px; }
        .hero-oiu { text-align:center; margin:10px 0 2px; }
        .hero-oiu img { width:180px; opacity:0.45; }

        .greeting-section { margin:6px 18px; text-align:center; padding:26px 22px; border:1px solid var(--border); border-radius:var(--radius); background:linear-gradient(160deg,rgba(245,230,200,0.4),rgba(255,252,247,0.9)); position:relative; }
        .greeting-section::before, .greeting-section::after { content:''; position:absolute; width:18px; height:18px; border-color:rgba(184,134,42,0.4); border-style:solid; }
        .greeting-section::before { top:8px; left:8px; border-width:1.5px 0 0 1.5px; border-radius:3px 0 0 0; }
        .greeting-section::after  { bottom:8px; right:8px; border-width:0 1.5px 1.5px 0; border-radius:0 0 3px 0; }
        .greeting-label { font-family:var(--font-head); font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--muted); margin-bottom:14px; }
        .greeting-text { font-family:var(--font-body); font-style:italic; font-size:20px; line-height:1.8; color:var(--text); }
        .greeting-sign { font-family:var(--font-script); font-size:36px; color:var(--accent); margin-top:12px; opacity:0.85; }

        .card { background:#fff; border-color:rgba(184,134,42,0.15); position:relative; }
        .card::before, .card::after { content:''; position:absolute; width:14px; height:14px; border-color:rgba(184,134,42,0.4); border-style:solid; }
        .card::before { top:7px; left:7px; border-width:1.5px 0 0 1.5px; border-radius:2px 0 0 0; }
        .card::after  { bottom:7px; right:7px; border-width:0 1.5px 1.5px 0; border-radius:0 0 2px 0; }
        .detail-label { font-family:var(--font-head); font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); }
        .detail-value { font-family:var(--font-body); font-size:17px; color:var(--text); }

        .btn { font-family:var(--font-head); font-size:10px; letter-spacing:2.5px; text-transform:uppercase; background:linear-gradient(135deg,#c9952f,#b8862a); border-color:var(--accent); color:#fff; }
        .btn:hover { background:linear-gradient(135deg,#d4a03a,#c9952f); box-shadow:0 6px 20px rgba(184,134,42,0.28); }
        .map-btn img { width:20px; filter:brightness(10); }

        .heading { font-family:var(--font-head); font-size:10px; letter-spacing:3.5px; text-transform:uppercase; color:var(--accent); text-align:center; margin-bottom:14px; }

        .counter-box { background:linear-gradient(160deg,var(--accent-soft),#fff); border-color:rgba(184,134,42,0.18); position:relative; overflow:hidden; }
        .counter-box::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--accent),transparent); opacity:0.5; }
        .counter-box .num { font-family:var(--font-head); font-size:26px; font-weight:700; color:var(--accent); }
        .counter-box .label { font-family:var(--font-head); font-size:7px; letter-spacing:1.5px; color:var(--muted); }

        .cal-head { font-family:var(--font-head); font-size:11px; letter-spacing:2.5px; color:var(--accent); justify-content:center; }
        .cal-day { font-family:var(--font-body); font-size:14px; }
        .cal-day.today { background:var(--accent); color:#fff; border-color:var(--accent); box-shadow:0 2px 12px rgba(184,134,42,0.28); }

        .rsvp-form input, .rsvp-form textarea { font-family:var(--font-body); font-size:17px; border-color:rgba(184,134,42,0.2); background:#fffdf8; color:var(--text); }
        .rsvp-form input::placeholder, .rsvp-form textarea::placeholder { color:var(--muted); font-style:italic; }
        .rsvp-form input:focus, .rsvp-form textarea:focus { border-color:rgba(184,134,42,0.5); outline:none; box-shadow:0 0 0 3px rgba(184,134,42,0.07); }
        .success-msg { background:var(--accent-soft); color:var(--accent); border:1px solid rgba(184,134,42,0.25); font-family:var(--font-head); letter-spacing:2px; font-size:11px; }

        .footer { font-family:var(--font-head); font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--muted); }
    </style>

    </head>
    <body>
<div class="app">

    <div class="border-strip left"  style="background-image:url('https://shaqyrtu.kz/template4/border.png')"></div>
    <div class="border-strip right" style="background-image:url('https://shaqyrtu.kz/template4/border.png')"></div>

    <div class="inner">

        <div class="hero-top-flower">
            <img src="https://shaqyrtu.kz/template12/gul.png" alt="">
        </div>

        <?php include $partials . '/hero.php'; ?>

        <div class="hero-oiu">
            <img src="https://shaqyrtu.kz/template9/oiu.png" alt="">
        </div>

        <div class="decor-divider">
            <img src="https://shaqyrtu.kz/template4/3.svg" alt="">
        </div>

        <div class="greeting-section reveal">
            <div class="greeting-label">Хабарлама</div>
            <div class="greeting-text" id="eventText">
                Құрметті ағайын-туыс,<br>
                дос-жарандар!<br><br>
                Сіздерді тойымызға<br>шақырамыз.
            </div>
            <div class="greeting-sign">Тойға шақырамыз</div>
        </div>

        <div class="decor-flower side">
            <img src="https://shaqyrtu.kz/template12/gul.png" alt="">
            <img src="https://shaqyrtu.kz/template12/gul.png" alt="">
        </div>

        <?php include $partials . '/info.php'; ?>

        <div class="decor-divider sm">
            <img src="https://shaqyrtu.kz/template12/decor.png" alt="">
        </div>

        <?php include $partials . '/gallery.php'; ?>

        <div class="decor-divider">
            <img src="https://shaqyrtu.kz/template4/3.svg" alt="">
        </div>

        <?php include $partials . '/countdown.php'; ?>
        <?php include $partials . '/calendar.php'; ?>

        <div class="decor-flower">
            <img src="https://shaqyrtu.kz/template12/gul.png" alt="">
        </div>

        <?php include $partials . '/rsvp.php'; ?>

        <div class="decor-divider sm">
            <img src="https://shaqyrtu.kz/template12/decor.png" alt="">
        </div>

        <?php include $partials . '/footer.php'; ?>

    </div>
</div>

<?php include $partials . '/scripts.php'; ?>