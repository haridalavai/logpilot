ALTER TABLE events
    ADD COLUMN IF NOT EXISTS source String DEFAULT '',
    ADD COLUMN IF NOT EXISTS user String DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS extra String DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS device String DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS breadcrumbs String DEFAULT '[]' 