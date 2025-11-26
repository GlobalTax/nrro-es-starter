-- Create landing_versions table
CREATE TABLE landing_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_id UUID NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot_json JSONB NOT NULL,
  change_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index para búsquedas rápidas
CREATE INDEX idx_landing_versions_landing_id ON landing_versions(landing_id);
CREATE INDEX idx_landing_versions_version ON landing_versions(landing_id, version_number DESC);

-- Añadir health_score a landing_pages
ALTER TABLE landing_pages ADD COLUMN health_score INTEGER DEFAULT 0;

-- RLS Policies
ALTER TABLE landing_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins y editores pueden ver versiones"
  ON landing_versions FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'marketing'));

CREATE POLICY "Admins y editores pueden crear versiones"
  ON landing_versions FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'marketing'));