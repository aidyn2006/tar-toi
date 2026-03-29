-- V1: Add payload jsonb to invites, migrate old columns, keep them intact
-- Safe on both existing DB and fresh install

DO $$
DECLARE
    table_exists  BOOLEAN;
    column_exists BOOLEAN;
    old_cols_exist BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'invites'
    ) INTO table_exists;

    -- На чистой установке таблицы нет — Hibernate создаст её сам с нужными колонками
    IF NOT table_exists THEN
        RETURN;
    END IF;

    -- Добавляем payload если ещё нет
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'invites' AND column_name = 'payload'
    ) INTO column_exists;

    IF NOT column_exists THEN
        ALTER TABLE invites ADD COLUMN payload jsonb DEFAULT '{}' NOT NULL;
    END IF;

    -- Проверяем наличие старых колонок (достаточно проверить одну)
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'invites' AND column_name = 'title'
    ) INTO old_cols_exist;

    -- Мигрируем данные из старых колонок в payload (только пустые записи)
    IF old_cols_exist THEN
        UPDATE invites
        SET payload = jsonb_strip_nulls(jsonb_build_object(
            'title',           title,
            'description',     description,
            'eventDate',       TO_CHAR(event_date, 'YYYY-MM-DD"T"HH24:MI:SS'),
            'locationName',    location_name,
            'locationUrl',     location_url,
            'maxGuests',       NULLIF(max_guests, 0),
            'musicKey',        music_key,
            'musicSource',     music_source,
            'musicTitle',      music_title,
            'musicUrl',        music_url,
            'previewPhotoUrl', preview_photo_url,
            'template',        template,
            'toiOwners',       toi_owners,
            'topic1',          topic1,
            'topic2',          topic2
        ))
        WHERE payload::text = '{}' OR payload IS NULL;
    END IF;

END $$;
