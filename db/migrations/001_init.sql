-- Schéma initial de la plateforme Cursus

CREATE TABLE users (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email         text NOT NULL UNIQUE,
    name          text NOT NULL,
    password_hash text NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
    id         text PRIMARY KEY,               -- empreinte SHA-256 du jeton envoyé au navigateur
    user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessions_user_id_idx ON sessions(user_id);

CREATE TABLE parcours (
    id            serial PRIMARY KEY,
    slug          text NOT NULL UNIQUE,
    title         text NOT NULL,
    tagline       text NOT NULL,
    description   text NOT NULL,
    level         text NOT NULL,
    color         text NOT NULL,
    icon          text NOT NULL,
    status        text NOT NULL CHECK (status IN ('published', 'coming_soon')),
    position      int  NOT NULL,
    prerequisites jsonb NOT NULL DEFAULT '[]',
    outcomes      jsonb NOT NULL DEFAULT '[]'
);

CREATE TABLE modules (
    id          serial PRIMARY KEY,
    parcours_id int  NOT NULL REFERENCES parcours(id) ON DELETE CASCADE,
    slug        text NOT NULL,
    title       text NOT NULL,
    description text NOT NULL,
    position    int  NOT NULL,
    UNIQUE (parcours_id, slug)
);

CREATE TABLE chapters (
    id               serial PRIMARY KEY,
    module_id        int  NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    slug             text NOT NULL,
    title            text NOT NULL,
    description      text NOT NULL,
    duration_minutes int  NOT NULL,
    objectives       jsonb NOT NULL DEFAULT '[]',
    position         int  NOT NULL,          -- ordre dans le module
    global_position  int  NOT NULL,          -- ordre dans tout le parcours
    UNIQUE (module_id, slug)
);

CREATE TABLE sections (
    id           serial PRIMARY KEY,
    chapter_id   int  NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    slug         text NOT NULL,
    title        text NOT NULL,
    body_md      text NOT NULL,
    position     int  NOT NULL,
    is_exercises boolean NOT NULL DEFAULT false,
    UNIQUE (chapter_id, slug)
);

CREATE TABLE questions (
    id          serial PRIMARY KEY,
    chapter_id  int  NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    position    int  NOT NULL,
    prompt      text NOT NULL,
    code        text,
    options     jsonb NOT NULL,
    correct     jsonb NOT NULL,
    multiple    boolean NOT NULL DEFAULT false,
    explanation text NOT NULL,
    UNIQUE (chapter_id, position)
);

CREATE TABLE section_progress (
    user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section_id   int  NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    completed_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, section_id)
);

CREATE TABLE quiz_attempts (
    id            serial PRIMARY KEY,
    user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chapter_id    int  NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    score         int  NOT NULL CHECK (score BETWEEN 0 AND 100),
    correct_count int  NOT NULL,
    total         int  NOT NULL,
    passed        boolean NOT NULL,
    answers       jsonb NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX quiz_attempts_user_chapter_idx ON quiz_attempts(user_id, chapter_id, created_at DESC);
