ALTER TABLE feedback_items
  DROP CONSTRAINT IF EXISTS feedback_items_status_check;

ALTER TABLE feedback_items
  ADD CONSTRAINT feedback_items_status_check
  CHECK (status IN ('open', 'promoted', 'closed'));
