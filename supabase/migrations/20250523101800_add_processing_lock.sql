-- Add processing_lock column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS processing_lock TIMESTAMPTZ DEFAULT NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_jobs_processing_lock ON jobs (processing_lock);

-- Add comment to explain the purpose of the column
COMMENT ON COLUMN jobs.processing_lock IS 'Timestamp when job processing started, used for locking to prevent duplicate processing';
