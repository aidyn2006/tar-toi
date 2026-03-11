<?php
$config = [
    'title'      => 'Тұсаукесер · Жұмсақ Мұра',
    'ceremony'   => 'Тұсаукесер',
    'template'   => 'tusaukeser/template2',
    'fonts'      => 'family=Unbounded:wght@300;400;600&family=Montserrat:wght@300;400;500&family=Birthstone+Bounce',
    'autoplay'   => false,
    'musicUrl'   => '',
    'toiOwners'  => '',
    'day'        => '01-01-2027',
    'hour'       => '18:00',
    'location'   => 'Алматы, Grand Hall',
    'locationUrl'=> '',
    'gallery'    => [],
    'description'=> 'Құрметті қауым! Кішкентай бөбегіміздің үлкен өмірге жасаған алғашқы қадамына куә болуға шақырамыз.',
];
$partials = dirname(__DIR__) . '/common/partials';
include $partials . '/head.php';
?>

    <style>
        :root {
            --bg-page:    #f9f7ff;
            --bg:         #ffffff;
            --card:       #f3f0ff;
            --accent:     #a38ad4;
            --accent-soft: rgba(163,138,212,0.1);
            --accent-rgb: 163,138,212;
            --text:       #4a4458;
            --muted:      #8e8a9a;
            --border:     rgba(163,138,212,0.2);
            --shadow:     0 12px 40px rgba(163,138,212,0.1);
            --radius:     24px;
            --font-head:  'Unbounded', sans-serif;
            --font-body:  'Montserrat', sans-serif;
            --font-script:'Birthstone Bounce', cursive;
            --bg-glow: radial-gradient(circle at 50% -20%, rgba(var(--accent-rgb), 0.1), transparent 70%);
        }

        .app { 
            position: relative; overflow-x: hidden; background: var(--bg-page); color: var(--text);
            background-image: var(--bg-glow); min-height: 100vh;
        }

        /* Border */
        .border-strip {
            position: absolute; top: 0; bottom: 0; width: 20px; z-index: 100;
            background-repeat: repeat-y; background-size: contain; opacity: 0.6;
            pointer-events: none;
        }
        .border-strip.left { left: 0; }
        .border-strip.right { right: 0; transform: scaleX(-1); }

        /* Hero */
        .hero { padding: 70px 20px 40px; text-align: center; position: relative; }
        .hero-top-decor img { width: 90px; filter: drop-shadow(0 4px 8px var(--accent-soft)); margin-bottom: 20px; }

        .hero-photo-box {
            width: 180px; height: 180px; border: 2px solid var(--accent);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            margin: 0 auto 30px; position: relative; overflow: hidden;
            animation: morph 12s ease-in-out infinite; box-shadow: 0 10px 30px rgba(var(--accent-rgb), 0.15);
        }
        @keyframes morph {
            0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
            50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
        }

        .hero-name {
            font-family: var(--font-head); font-size: 32px; font-weight: 500;
            color: var(--accent); margin: 15px 0; letter-spacing: -1px;
        }
        .ceremony-type { 
            font-family: var(--font-head); font-size: 8px; font-weight: 300; 
            letter-spacing: 5px; text-transform: uppercase; color: var(--muted);
        }

        /* Dividers */
        .decor-oiu { text-align: center; margin: 35px 0; }
        .decor-oiu img { width: 120px; opacity: 0.5; }

        /* Greeting */
        .greeting { 
            padding: 40px 25px; background: var(--bg); border: 1px solid var(--border);
            border-radius: var(--radius); margin: 0 20px; text-align: center;
            box-shadow: var(--shadow);
        }
        .greeting-body { font-family: var(--font-body); font-size: 16px; line-height: 1.9; color: var(--text); }
        .greeting-script { font-family: var(--font-script); font-size: 44px; color: var(--accent); margin-top: 15px; display: block; }

        /* Info Blocks */
        .info-blocks { padding: 25px 20px; display: grid; gap: 12px; }
        .info-block {
            background: var(--bg); border: 1px solid var(--border); border-radius: 18px;
            padding: 18px; display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }
        .info-block-icon {
            width: 40px; height: 40px; background: var(--accent-soft); border-radius: 12px;
            display: grid; place-items: center; color: var(--accent); font-size: 18px;
        }
        .info-block-label { font-family: var(--font-head); font-size: 7px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
        .info-block-value { font-family: var(--font-body); font-size: 16px; color: var(--text); font-weight: 500; }

        /* Map Button */
        .map-block {
            margin: 0 20px 40px; background: var(--accent); color: white;
            text-decoration: none; border-radius: 14px; padding: 15px;
            display: flex; align-items: center; justify-content: center; gap: 10px;
            transition: all 0.3s; font-family: var(--font-head); font-size: 9px; letter-spacing: 2px;
            text-transform: uppercase; box-shadow: 0 8px 20px rgba(var(--accent-rgb), 0.3);
        }
        .map-block:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(var(--accent-rgb), 0.4); }
        .map-block img { width: 22px; filter: brightness(0) invert(1); }

        /* Calendar */
        .heading { font-family: var(--font-head); font-size: 10px; color: var(--accent); letter-spacing: 4px; text-transform: uppercase; text-align: center; margin-bottom: 25px; }
        .counter-box { background: var(--card); border: 1px solid var(--border); border-radius: 15px; }
        .num { font-family: var(--font-head); font-size: 24px; color: var(--accent); }
        
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 10px; }
        .cal-day { 
            aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center;
            font-size: 11px; color: var(--muted); border-radius: 50%;
            transition: all 0.3s;
        }
        .cal-day.today { 
            background: var(--accent); color: white; font-weight: 700;
            box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
            position: relative;
        }
        .cal-day.today::before {
            content: ''; position: absolute; inset: -4px; border: 1px solid var(--accent);
            border-radius: 50%; opacity: 0.4; animation: ping 2.5s infinite;
        }
        .cal-day.today::after {
            content: '❤'; position: absolute; top: -6px; right: -6px;
            font-size: 9px; color: var(--accent); text-shadow: 0 0 3px white;
        }
        @keyframes ping { 75%, 100% { transform: scale(1.5); opacity: 0; } }

        /* RSVP */
        .rsvp-form input, .rsvp-form textarea {
            background: var(--bg); border: 1px solid var(--border); border-radius: 12px;
            padding: 14px; color: var(--text); font-family: var(--font-body); margin-bottom: 12px;
        }
        .submit-btn {
            background: var(--accent); color: white; border: none; padding: 18px;
            border-radius: 12px; width: 100%; font-family: var(--font-head); font-size: 10px;
            font-weight: 700; cursor: pointer; text-transform: uppercase;
        }

        .footer { color: var(--muted); opacity: 0.7; font-size: 8px; letter-spacing: 2px; }
    </style>
</head>
<body>
    <div class="app">
        <div class="border-strip left" style="background-image:url('https://shaqyrtu.kz/template4/border.png')"></div>
        <div class="border-strip right" style="background-image:url('https://shaqyrtu.kz/template4/border.png')"></div>

        <div class="inner">
            <header class="hero">
                <div class="hero-top-decor">
                    <img src="https://shaqyrtu.kz/template4/3.svg" alt="">
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

            <?php include $partials . '/info.php'; ?>

            <div class="decor-oiu">
                <img src="https://shaqyrtu.kz/template12/decor.png" style="width: 100px;" alt="">
            </div>

            <?php include $partials . '/gallery.php'; ?>

            <?php include $partials . '/countdown.php'; ?>

            <?php include $partials . '/calendar.php'; ?>

            <div class="decor-oiu">
                <img src="https://shaqyrtu.kz/template4/3.svg" style="width: 180px;" alt="">
            </div>

            <?php include $partials . '/rsvp.php'; ?>

            <?php include $partials . '/footer.php'; ?>
        </div>
    </div>

<?php include $partials . '/scripts.php'; ?>
