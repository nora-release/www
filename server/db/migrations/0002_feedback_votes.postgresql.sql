ALTER TABLE feedback_items
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'feature' CHECK (category IN ('feature', 'bug'));

CREATE INDEX IF NOT EXISTS feedback_items_category_idx
  ON feedback_items(category);

CREATE TABLE IF NOT EXISTS feedback_votes (
  feedback_id TEXT NOT NULL REFERENCES feedback_items(id) ON DELETE CASCADE,
  github_id BIGINT NOT NULL REFERENCES feedback_users(github_id) ON DELETE CASCADE,
  value INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (feedback_id, github_id)
);

CREATE INDEX IF NOT EXISTS feedback_votes_feedback_id_idx
  ON feedback_votes(feedback_id);
