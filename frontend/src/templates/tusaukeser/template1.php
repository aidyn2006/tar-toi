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
            --accent-soft: rgba(197,160,89,0.1);
            --accent-rgb: 197,160,89;
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

        /* Info Blocks Override */
        .info-blocks { padding: 20px; display: grid; gap: 15px; }
        .info-block {
            background: var(--bg); border: 1px solid var(--border); border-radius: 18px;
            padding: 20px; display: flex; align-items: center; gap: 15px; box-shadow: var(--shadow);
        }
        .info-block-icon {
            width: 45px; height: 45px; background: var(--accent-soft); border-radius: 12px;
            display: grid; place-items: center; color: var(--accent); font-size: 20px;
        }
        .info-block-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
        .info-block-value { font-family: var(--font-head); font-size: 18px; color: var(--text); }

        /* Map Button */
        .map-block {
            margin: 10px 20px 30px; background: var(--accent); color: white;
            text-decoration: none; border-radius: 18px; padding: 15px;
            display: flex; align-items: center; justify-content: center; gap: 12px;
            box-shadow: 0 8px 25px rgba(var(--accent-rgb), 0.3); transition: transform 0.3s;
        }
        .map-block:hover { transform: translateY(-3px); }
        .map-block img { width: 24px; filter: brightness(0) invert(1); }
        .map-block span { font-weight: 600; letter-spacing: 1px; }

        /* Countdown & Calendar */
        .section { padding: 40px 20px; }
        .heading { font-family: var(--font-head); font-size: 24px; color: var(--accent); text-align: center; margin-bottom: 25px; }
        
        .counter-box { background: var(--card); border: 1px solid var(--border); border-radius: 15px; padding: 20px 10px; }
        .num { font-size: 28px; font-weight: 700; color: var(--accent); }
        
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 10px; }
        .cal-day { 
            aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; 
            font-family: var(--font-body); font-size: 13px; color: var(--muted);
            border-radius: 50%; transition: all 0.3s;
        }
        .cal-day.today { 
            background: var(--accent); color: white; border-radius: 50%; 
            box-shadow: 0 5px 15px rgba(var(--accent-rgb), 0.4);
            position: relative; overflow: visible;
        }
        .cal-day.today::after {
            content: '❤'; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
            font-size: 10px; color: var(--accent); text-shadow: 0 0 5px white;
        }

        /* RSVP */
        .rsvp-form input, .rsvp-form textarea {
            background: var(--bg); border: 1px solid var(--border); border-radius: 12px;
            padding: 12px 15px; width: 100%; margin-bottom: 10px;
        }
        .submit-btn {
            background: var(--accent); color: white; border: none; padding: 15px;
            border-radius: 12px; width: 100%; font-weight: 700; cursor: pointer;
        }

        /* Music Button */
        .music-btn {
            background: rgba(255,255,255,0.9); backdrop-filter: blur(5px);
            border: 1px solid var(--border); border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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

            <div class="decor-svg">
                <img src="https://shaqyrtu.kz/template4/3.svg" alt="">
            </div>

            <?php include $partials . '/info.php'; ?>

            <div class="decor-oiu">
                <img src="https://shaqyrtu.kz/template12/decor.png" style="width: 120px;" alt="">
            </div>

            <?php include $partials . '/gallery.php'; ?>

            <?php include $partials . '/countdown.php'; ?>

            <?php include $partials . '/calendar.php'; ?>

            <div class="decor-svg">
                <img src="https://shaqyrtu.kz/template4/3.svg" alt="">
            </div>

            <?php include $partials . '/rsvp.php'; ?>

            <?php include $partials . '/footer.php'; ?>
        </div>
    </div>

<?php include $partials . '/scripts.php'; ?>