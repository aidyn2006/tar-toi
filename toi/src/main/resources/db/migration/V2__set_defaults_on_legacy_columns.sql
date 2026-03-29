-- V2: Ставим DEFAULT на старые NOT NULL колонки.
-- Это нужно чтобы новые записи (без старых полей) вставлялись без ошибок.

DO $$
BEGIN
    -- max_guests
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'invites' AND column_name = 'max_guests') THEN
        ALTER TABLE invites ALTER COLUMN max_guests SET DEFAULT 0;
        ALTER TABLE invites ALTER COLUMN max_guests DROP NOT NULL;
    END IF;

    -- title
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'invites' AND column_name = 'title') THEN
        ALTER TABLE invites ALTER COLUMN title DROP NOT NULL;
    END IF;

    -- description
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'invites' AND column_name = 'description') THEN
        ALTER TABLE invites ALTER COLUMN description DROP NOT NULL;
    END IF;

    -- template
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'invites' AND column_name = 'template') THEN
        ALTER TABLE invites ALTER COLUMN template DROP NOT NULL;
    END IF;

    -- toi_owners
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'invites' AND column_name = 'toi_owners') THEN
        ALTER TABLE invites ALTER COLUMN toi_owners DROP NOT NULL;
    END IF;
END $$;
