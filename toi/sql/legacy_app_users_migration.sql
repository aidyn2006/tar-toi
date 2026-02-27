-- Legacy users migration for current app_users schema.
-- This script:
-- 1) maps username to phone in current format (+7XXXXXXXXXX),
-- 2) maps ROLE_* to USER/ADMIN,
-- 3) hashes legacy plain passwords with bcrypt via pgcrypto,
-- 4) upserts by id.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

WITH legacy_users (id, full_name, raw_password, username, username_normalized, approved, role_name) AS (
    VALUES
        (11, 'Aidyn', 'Na260206', '87056842747', '87056842747', true, 'ROLE_ADMIN'),
        (15, 'Акерке', '123456', '77026883519', '77026883519', false, 'ROLE_USER'),
        (16, 'Айзат', 'aizatkasuper', '77019768998', '77019768998', false, 'ROLE_USER'),
        (17, 'Қарақат', '54545454', '77782718098', '77782718098', false, 'ROLE_USER'),
        (18, 'Нұрасыл', 'Nurasyl05', '77055806810', '77055806810', false, 'ROLE_USER'),
        (19, 'Ұлғаным', 'mk_6066', '77476773670', '77476773670', false, 'ROLE_USER'),
        (20, 'Гаухар', 'Мардар', '77475990471', '77475990471', false, 'ROLE_USER'),
        (21, 'Анель', 'Almaty08', '77770332541', '77770332541', false, 'ROLE_USER'),
        (22, 'Zhanbota', 'Zhms1373', '77474526754', '77474526754', false, 'ROLE_USER'),
        (23, 'Молдир', 'motia89', '77756294133', '77756294133', false, 'ROLE_USER'),
        (24, 'Ляйла', 'Aa12345', '77768315478', '77768315478', false, 'ROLE_USER'),
        (25, 'Ахмади Сағадат', 'sagadat2003', '77075034755', '77075034755', false, 'ROLE_USER'),
        (26, 'Молдир', 'monti650447?', '77070650447', '77070650447', false, 'ROLE_USER'),
        (27, 'Ақерке', 'Akerke06', '77002371282', '77002371282', false, 'ROLE_USER'),
        (28, 'Мадина', 'Madina@1998', '77765977474', '77765977474', false, 'ROLE_USER'),
        (29, 'Aidyn', 'Na260206', '77056842747', '77056842747', false, 'ROLE_USER'),
        (30, 'Баян', 'Bayan9898', '77054378767', '77054378767', false, 'ROLE_USER'),
        (31, 'Майра Жумадилова', 'смартнейшн', '77477427227', '77477427227', false, 'ROLE_USER'),
        (32, 'Жеңіс', 'zhenis06', '77789425240', '77789425240', false, 'ROLE_USER'),
        (33, 'Мерей', 'merey.2008', '77762963581', '77762963581', false, 'ROLE_USER'),
        (34, 'Жанар', '7gFnmGiObc', '77064070858', '77064070858', false, 'ROLE_USER'),
        (35, 'Сания', 'Aa123456789$', '77027409276', '77027409276', false, 'ROLE_USER'),
        (36, 'Жандарбек', 'Aizhan91', '77021051003', '77021051003', false, 'ROLE_USER'),
        (37, 'Шах', 'q94hFGTDFnYc4Lz', '77478792622', '77478792622', false, 'ROLE_USER')
),
mapped AS (
    SELECT
        id,
        full_name,
        raw_password,
        username,
        username_normalized,
        CASE
            WHEN username ~ '^8[0-9]{10}$' THEN '+7' || substring(username FROM 2 FOR 10)
            WHEN username ~ '^7[0-9]{10}$' THEN '+' || username
            WHEN username ~ '^[0-9]{10}$' THEN '+7' || username
            WHEN username LIKE '+7%' THEN username
            ELSE username
        END AS phone,
        approved,
        REPLACE(UPPER(role_name), 'ROLE_', '') AS role
    FROM legacy_users
),
deduped AS (
    SELECT id, full_name, raw_password, username, username_normalized, phone, approved, role
    FROM (
        SELECT
            m.*,
            ROW_NUMBER() OVER (
                PARTITION BY m.phone
                ORDER BY
                    m.approved DESC,
                    CASE WHEN m.role = 'ADMIN' THEN 0 ELSE 1 END,
                    m.id ASC
            ) AS rn
        FROM mapped m
    ) ranked
    WHERE rn = 1
)
INSERT INTO app_users (id, full_name, password_hash, username, username_normalized, approved, role, phone, version)
SELECT
    m.id,
    m.full_name,
    crypt(m.raw_password, gen_salt('bf', 10)),
    m.username,
    m.username_normalized,
    m.approved,
    m.role,
    m.phone,
    0
FROM deduped m
ON CONFLICT (id) DO UPDATE
SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    username = EXCLUDED.username,
    username_normalized = EXCLUDED.username_normalized,
    password_hash = CASE
        WHEN app_users.password_hash IS NULL OR app_users.password_hash !~ '^\$2[aby]\$'
            THEN EXCLUDED.password_hash
        ELSE app_users.password_hash
    END,
    approved = EXCLUDED.approved,
    role = EXCLUDED.role;

SELECT setval(
    pg_get_serial_sequence('app_users', 'id'),
    (SELECT COALESCE(MAX(id), 1) FROM app_users),
    true
);
