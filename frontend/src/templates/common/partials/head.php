<!doctype html>
<html lang="kk">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars(isset($config['title']) ? $config['title'] : 'Той', ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <?php if (!empty($config['fonts'])): ?>
    <link href="https://fonts.googleapis.com/css2?<?= htmlspecialchars($config['fonts'], ENT_QUOTES, 'UTF-8') ?>&display=swap" rel="stylesheet">
    <?php endif; ?>
    <link rel="stylesheet" href="../common/utility.css">
    <link rel="stylesheet" href="../common/base.css">
