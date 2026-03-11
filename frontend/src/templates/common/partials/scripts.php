<?php
$cfg = [
    'names' => [
        'bride' => isset($config['names']['bride']) ? $config['names']['bride'] : 'Бала',
        'groom' => isset($config['names']['groom']) ? $config['names']['groom'] : '',
    ],
    'day' => isset($config['day']) ? $config['day'] : '01-01-2027',
    'hour' => isset($config['hour']) ? $config['hour'] : '18:00',
    'location' => isset($config['location']) ? $config['location'] : 'Алматы, Grand Hall',
    'locationUrl' => isset($config['locationUrl']) ? $config['locationUrl'] : '',
    'gallery' => isset($config['gallery']) ? $config['gallery'] : [],
    'description' => isset($config['description']) ? $config['description'] : 'Құрметті ағайын, тойға шақырамыз!',
    'toiOwners' => isset($config['toiOwners']) ? $config['toiOwners'] : '',
    'template' => isset($config['template']) ? $config['template'] : '',
    'ceremony' => isset($config['ceremony']) ? $config['ceremony'] : 'Той',
    'autoplay' => isset($config['autoplay']) ? (bool)$config['autoplay'] : false,
    'music' => [
        'url' => isset($config['musicUrl']) ? $config['musicUrl'] : '',
    ],
];
?>
<script>
    window.CONFIG = <?= json_encode($cfg, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
</script>
<script src="../common/frame.js"></script>
</body>
</html>
