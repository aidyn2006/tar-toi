<?php
$config = [
        'title'    => 'Той · Theme Name',
        'ceremony' => 'Тұсаукесер',        // badge text
        'template' => 'tusaukeser/template6',
        'fonts'    => 'family=Cinzel:wght@400;600&family=Great+Vibes',
];
$partials = dirname(__DIR__) . '/common/partials';
include $partials . '/head.php';
?>

<style>
    /* ── ONLY CHANGE THIS BLOCK FOR NEW THEMES ── */
    :root {
        --bg-page:     #ffffff;   /* page background */
        --bg:          #ffffff;   /* app background  */
        --card:        #f9f9f9;   /* card background */
        --accent:      #c28a3a;   /* primary color   */
        --accent-soft: #f0e1cb;   /* accent light    */
        --text:        #2f241b;   /* main text       */
        --muted:       #6f6156;   /* secondary text  */
        --border:      #e6d9c7;   /* borders         */
        --font-head:   'Cinzel', serif;
        --font-body:   'Cormorant Garamond', serif;
        --bg-pattern:  none;      /* optional SVG pattern */
    }
    /* Optional: unique per-theme overrides below */
    .hero-name { font-family: 'Great Vibes', cursive; font-size: 60px; }
</style>

</head>
<body>
<div class="app">
    <!-- optional: border strips -->
    <!-- <div class="border-strip left" style="background-image:url('...')"></div> -->
    <!-- <div class="border-strip right" style="background-image:url('...')"></div> -->
    <div class="inner">
        <?php include $partials . '/hero.php'; ?>
        <div class="divider">❧ ✦ ❧</div>
        <?php include $partials . '/info.php'; ?>
        <?php include $partials . '/gallery.php'; ?>
        <?php include $partials . '/countdown.php'; ?>
        <?php include $partials . '/calendar.php'; ?>
        <?php include $partials . '/rsvp.php'; ?>
        <?php include $partials . '/footer.php'; ?>
    </div>
</div>
<?php include $partials . '/scripts.php'; ?>
