<?php
$config = [
    'title'      => 'Тұсаукесер · Алтын Гүл',
    'ceremony'   => 'Тұсаукесер',
    'template'   => 'tusaukeser/template1',
    'fonts'      => 'family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600&family=Meie+Script',
    'autoplay'   => false,
    'musicUrl'   => '',
    'toiOwners'  => '',
    'day'        => '01-01-2027',
    'hour'       => '18:00',
    'location'   => 'Алматы, Grand Hall',
    'locationUrl'=> '',
    'gallery'    => [],
    'description'=> 'Құрметті ағайын-туыс, дос-жарандар! Кішкентай бөбегіміздің тұсаукесер тойына шақырамыз.',
];
$partials = dirname(__DIR__) . '/common/partials';
include $partials . '/head.php';
?>

    <style>
        :root {
            --bg-page:    #fdfbf7;
            --bg:         #ffffff;
            --card:       #fffaf0;
            --accent:     #c5a059;
            --accent-rgb: 197,160,89;
            --accent-soft: rgba(197,160,89,0.1);
            --text:       #3e352a;
            --muted:      #8c7e6a;
            --border:     rgba(197,160,89,0.25);
            --shadow:     0 10px 35px rgba(197,160,89,0.12);
            --radius:     24px;
            --font-head:  'Playfair Display', serif;
            --font-body:  'Montserrat', sans-serif;
            --font-script:'Meie Script', cursive;
        }

        .app { position: relative; overflow-x: hidden; background: var(--bg-page); min-height: 100vh; }

        /* Borders */
        .border-strip {
            position: absolute; top: 0; bottom: 0; width: 18px; z-index: 100;
            background-repeat: repeat-y; background-size: contain;
            pointer-events: none;
        }
        .border-strip.left { left: 0; }
        .border-strip.right { right: 0; transform: scaleX(-1); }

        /* Floating Flower Animations */
        .float-gul {
            position: absolute; width: 120px; opacity: 0.15; z-index: 0; pointer-events: none;
            animation: floating 8s ease-in-out infinite;
        }
        @keyframes floating {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }

        /* Hero Section */
        .hero { position: relative; padding: 60px 20px 40px; text-align: center; }
        .hero-top-decor { margin-bottom: 20px; }
        .hero-top-decor img { width: 140px; animation: pulse 4s infinite ease-in-out; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

        .hero-photo-box {
            width: 220px; height: 220px; border-radius: 50%; margin: 0 auto 30px;
            border: 2px solid var(--accent); position: relative; padding: 10px;
            box-shadow: 0 0 50px rgba(var(--accent-rgb), 0.2);
        }
        .hero-photo-box::after {
            content: ''; position: absolute; inset: -15px; border: 1px dashed var(--accent);
            border-radius: 50%; opacity: 0.4; animation: spin 30s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .hero-name {
            font-family: var(--font-script); font-size: 64px; color: var(--accent);
            margin: 10px 0; line-height: 1;
        }
        .ceremony-type {
            font-family: var(--font-head); font-size: 14px; text-transform: uppercase;
            letter-spacing: 5px; color: var(--muted); margin-bottom: 5px;
        }

        /* Dividers */
        .decor-oiu { text-align: center; margin: 30px 0; }
        .decor-oiu img { width: 180px; opacity: 0.6; }

        .decor-svg { text-align: center; margin: 20px 0; }
        .decor-svg img { width: 220px; opacity: 0.5; }

        /* Greeting */
        .greeting { padding: 40px 25px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); margin: 0 20px; text-align: center; }
        .greeting-body { font-family: var(--font-body); font-size: 17px; line-height: 1.8; color: var(--text); }
        .greeting-script { font-family: var(--font-script); font-size: 42px; color: var(--accent); margin-top: 15px; display: block; }

        /* Info Blocks - Luxury Redesign */
        .info-blocks { padding: 80px 25px; display: grid; gap: 50px; position: relative; }
        .info-block {
            background: transparent; border: none; border-radius: 0;
            padding: 30px 0; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
            position: relative; overflow: visible; display: block; text-align: center;
        }
        /* Elegant Divider between blocks */
        .info-block::after {
            content: ''; position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%);
            width: 80px; height: 1px; background: linear-gradient(to right, transparent, var(--accent), transparent);
            opacity: 0.5;
        }
        .info-block:last-child::after { display: none; }

        .info-dual { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 0; position: relative; }
        .info-dual > div { padding: 15px 15px; position: relative; }
        .info-dual > div:first-child::after {
            content: ''; position: absolute; right: 0; top: 15%; bottom: 15%;
            width: 1px; background: linear-gradient(to bottom, transparent, var(--border), transparent);
        }
        
        .detail-label { 
            font-family: var(--font-body); font-size: 11px; text-transform: uppercase; 
            letter-spacing: 5px; color: var(--accent); margin-bottom: 20px; font-weight: 600;
            opacity: 0.9;
        }
        .detail-value { 
            font-family: var(--font-head); font-size: 26px; color: var(--text); 
            line-height: 1.2; font-weight: 400; letter-spacing: 0.5px;
        }
        
        /* Ornamental Flower for specific blocks */
        .info-block#ownersBlock { 
            background: var(--accent-soft); padding: 45px 25px; border-radius: var(--radius);
        }
        .info-block#ownersBlock::after { display: none; }
        .info-block#ownersBlock .detail-value { font-family: var(--font-script); font-size: 42px; color: var(--accent); }

        /* Map Button - Luxury Style */
        .map-btn {
            display: inline-flex; align-items: center; justify-content: center; gap: 12px;
            margin-top: 30px; padding: 16px 45px; background: var(--text);
            color: white; text-decoration: none; border-radius: 0;
            font-family: var(--font-body); font-size: 10px; font-weight: 700;
            letter-spacing: 4px; text-transform: uppercase;
            transition: all 0.4s; border: 1px solid var(--text); width: auto;
        }
        .map-btn:hover { background: transparent; color: var(--text); transform: translateY(-3px); }

        /* Gallery Carousel */
        .gallery-carousel {
            display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory;
            padding: 20px 0; scrollbar-width: none; -ms-overflow-style: none;
        }
        .gallery-carousel::-webkit-scrollbar { display: none; }
        .gallery-carousel .gallery-tile,
        .gallery-carousel img,
        .gallery-carousel .card {
            flex: 0 0 85%; scroll-snap-align: center; border-radius: var(--radius);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); object-fit: cover; aspect-ratio: 4/5;
        }
        .gallery-carousel .gallery-tile { overflow: hidden; position: relative; }
        .gallery-carousel .gallery-tile img { width: 100%; height: 100%; display: block; object-fit: cover; }

        /* Countdown & Calendar */
        .section { padding: 60px 25px; }
        .heading { 
            font-family: var(--font-head); font-size: 28px; color: var(--accent); 
            text-align: center; margin-bottom: 32px; letter-spacing: 2px;
            position: relative; padding-bottom: 10px; text-transform: uppercase;
        }
        .heading::after {
            content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
            width: 44px; height: 2px; background: var(--accent); border-radius: 2px;
            opacity: 0.5;
        }
        
        /* Countdown & calendar styles now shared in common/base.css */

        /* Motion & mobile tuning */
        @media (max-width: 540px) {
            .hero { padding: 48px 16px 32px; }
            .hero-photo-box { width: 180px; height: 180px; }
            .hero-photo-box::after { animation: none; }
            .hero-name { font-size: 48px; }
            .ceremony-type { font-size: 12px; letter-spacing: 3px; }
            .greeting { margin: 0 12px; padding: 32px 20px; }
            .info-blocks { padding: 60px 18px; gap: 36px; }
            .detail-value { font-size: 22px; }
            .map-btn { padding: 14px 30px; letter-spacing: 2px; }
            .section { padding: 45px 18px; }
            .heading { font-size: 26px; }
            .gallery-carousel img, .gallery-carousel .card { flex-basis: 92%; }
            .float-gul { display: none; }
            .hero-top-decor img { animation: none; }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }

        /* RSVP */
        .rsvp-form input, .rsvp-form textarea {
            background: var(--bg); border: 1px solid var(--border); border-radius: 0;
            padding: 15px 20px; width: 100%; margin-bottom: 15px; font-family: var(--font-body);
        }
        .submit-btn {
            background: var(--text); color: white; border: 1px solid var(--text); padding: 18px;
            border-radius: 0; width: 100%; font-weight: 700; cursor: pointer;
            letter-spacing: 4px; text-transform: uppercase; font-size: 10px; transition: all 0.3s;
        }
        .submit-btn:hover { background: transparent; color: var(--text); }

        /* Music Button */
        .music-btn {
            background: rgba(255,255,255,0.95); backdrop-filter: blur(8px);
            border: 1px solid var(--border); border-radius: 50px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="app">
        <div class="border-strip left" style="background-image:url('https://shaqyrtu.kz/template4/border.png')"></div>
        <div class="border-strip right" style="background-image:url('https://shaqyrtu.kz/template4/border.png')"></div>

        <img src="https://shaqyrtu.kz/template12/gul.png" class="float-gul" style="top: 15%; left: -30px;">
        <img src="https://shaqyrtu.kz/template12/gul.png" class="float-gul" style="top: 45%; right: -40px; animation-delay: -2s;">
        <img src="https://shaqyrtu.kz/template12/gul.png" class="float-gul" style="top: 75%; left: -20px; animation-delay: -4s;">

        <div class="inner">
            <header class="hero">
                <div class="hero-top-decor">
                    <img src="https://shaqyrtu.kz/template12/gul.png" alt="">
                </div>
                <div class="ceremony-type">Тұсаукесер тойы</div>
                <?php include $partials . '/hero.php'; ?>
            </header>

            <div class="decor-oiu">
                <img src="https://shaqyrtu.kz/template9/oiu.png" alt="">
            </div>

            <section class="greeting reveal">
                <div class="greeting-body" id="eventText">
                    <?= nl2br(htmlspecialchars($config['description'])) ?>
                </div>
                <span class="greeting-script">Тойға шақырамыз!</span>
            </section>

            <?php include $partials . '/countdown.php'; ?>

            <?php include $partials . '/calendar.php'; ?>

            <div class="decor-svg">
                <img src="https://shaqyrtu.kz/template4/3.svg" alt="">
            </div>

            <div class="info-blocks reveal">
                <?php include $partials . '/info-datetime.php'; ?>
                <?php include $partials . '/info-location.php'; ?>
                <?php include $partials . '/info-owners.php'; ?>
            </div>

            <div class="decor-oiu">
                <img src="https://shaqyrtu.kz/template12/decor.png" style="width: 120px;" alt="">
            </div>

            <?php include $partials . '/gallery.php'; ?>

            <div class="decor-svg">
                <img src="https://shaqyrtu.kz/template4/3.svg" alt="">
            </div>

            <?php include $partials . '/rsvp.php'; ?>

            <?php include $partials . '/footer.php'; ?>
        </div>
    </div>

<?php include $partials . '/scripts.php'; ?>
