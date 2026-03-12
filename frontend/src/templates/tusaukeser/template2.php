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

        .section { padding: 45px 22px; }

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
        .info-blocks { padding: 40px 20px; display: grid; gap: 15px; }
        .info-block {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 25px;
            box-shadow: var(--shadow);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: center;
        }
        .info-block:hover {
            transform: scale(1.02) translateY(-5px);
            background: var(--bg);
            border-color: var(--accent);
            box-shadow: 0 15px 35px rgba(var(--accent-rgb), 0.2);
        }

        .info-dual {
            display: grid;
            grid-template-columns: 1fr 1fr;
            padding: 0;
            overflow: hidden;
        }
        .info-dual > div {
            padding: 25px 15px;
            position: relative;
        }
        .info-dual > div:first-child::after {
            content: ''; position: absolute; right: 0; top: 20%; bottom: 20%;
            width: 1px; background: linear-gradient(to bottom, transparent, var(--border), transparent);
        }

        .detail-label {
            font-family: var(--font-head); font-size: 8px; font-weight: 300;
            letter-spacing: 3px; text-transform: uppercase; color: var(--muted);
            margin-bottom: 10px;
        }
        .detail-value {
            font-family: var(--font-body); font-size: 18px; color: var(--text);
            font-weight: 600; line-height: 1.4;
        }

        /* Map Button inside info-block */
        .map-btn {
            display: inline-flex; align-items: center; justify-content: center; gap: 8px;
            margin-top: 15px; padding: 12px 30px; background: var(--accent);
            color: white; text-decoration: none; border-radius: 12px;
            font-family: var(--font-head); font-size: 9px; font-weight: 500;
            letter-spacing: 1px; text-transform: uppercase;
            transition: all 0.3s; box-shadow: 0 5px 15px rgba(var(--accent-rgb), 0.3);
            width: auto;
        }
        .map-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(var(--accent-rgb), 0.4);
            filter: brightness(1.1);
        }

        .info-block#ownersBlock {
            background: var(--accent-soft);
            border-color: transparent;
        }

        /* Time & calendar */
        .time-grid { padding: 28px 14px 8px; display: grid; gap: 18px; }
        .time-grid .section { margin: 0; }

        .heading {
            font-family: var(--font-head); font-size: 22px; color: var(--accent);
            letter-spacing: 2px; text-transform: uppercase; text-align: center;
            margin-bottom: 28px; position: relative; padding-bottom: 10px;
        }
        .heading::after {
            content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
            width: 44px; height: 2px; background: var(--accent); border-radius: 2px;
            opacity: 0.5;
        }
        /* Countdown & calendar styles now shared in common/base.css */

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

            <div class="time-grid">
                <?php include $partials . '/countdown.php'; ?>
                <?php include $partials . '/calendar.php'; ?>
            </div>

            <div class="info-blocks reveal">
                <?php include $partials . '/info-datetime.php'; ?>
                <?php include $partials . '/info-location.php'; ?>
                <?php include $partials . '/info-owners.php'; ?>
            </div>

            <div class="decor-oiu">
                <img src="https://shaqyrtu.kz/template12/decor.png" style="width: 100px;" alt="">
            </div>

            <?php include $partials . '/gallery.php'; ?>

            <div class="decor-oiu">
                <img src="https://shaqyrtu.kz/template4/3.svg" style="width: 180px;" alt="">
            </div>

            <?php include $partials . '/rsvp.php'; ?>

            <?php include $partials . '/footer.php'; ?>
        </div>
    </div>

<?php include $partials . '/scripts.php'; ?>
