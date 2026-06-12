CREATE TABLE IF NOT EXISTS feedback_users (
  github_id BIGINT PRIMARY KEY,
  github_login TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  html_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_users (
  github_login TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  created_by_login TEXT
);

CREATE TABLE IF NOT EXISTS feedback_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'promoted')),
  author_github_id BIGINT NOT NULL REFERENCES feedback_users(github_id),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback_messages (
  id TEXT PRIMARY KEY,
  feedback_id TEXT NOT NULL REFERENCES feedback_items(id) ON DELETE CASCADE,
  author_github_id BIGINT NOT NULL REFERENCES feedback_users(github_id),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS github_issues (
  feedback_id TEXT PRIMARY KEY REFERENCES feedback_items(id) ON DELETE CASCADE,
  repo TEXT NOT NULL,
  issue_number INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS feedback_items_updated_at_idx
  ON feedback_items(updated_at);

CREATE INDEX IF NOT EXISTS feedback_messages_feedback_id_idx
  ON feedback_messages(feedback_id);
