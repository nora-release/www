ALTER TABLE feedback_attachments
  ALTER COLUMN data_base64 DROP NOT NULL;

ALTER TABLE feedback_attachments
  ADD COLUMN IF NOT EXISTS storage_provider text NOT NULL DEFAULT 'database',
  ADD COLUMN IF NOT EXISTS storage_repo text,
  ADD COLUMN IF NOT EXISTS storage_branch text,
  ADD COLUMN IF NOT EXISTS storage_path text,
  ADD COLUMN IF NOT EXISTS storage_url text;
