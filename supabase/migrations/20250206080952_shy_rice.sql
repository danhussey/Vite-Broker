-- Drop deployment-related objects
DROP TABLE IF EXISTS deployments CASCADE;
DROP FUNCTION IF EXISTS apply_migrations();

-- Remove any related indexes
DROP INDEX IF EXISTS idx_deployments_status;
DROP INDEX IF EXISTS idx_deployments_created_at;
