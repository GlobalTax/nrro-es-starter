-- Nullify author_ids that don't exist in team_members
UPDATE blog_posts SET author_id = NULL 
WHERE author_id IS NOT NULL 
  AND author_id NOT IN (SELECT id FROM team_members);

-- Now safely re-create the FK
ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES team_members(id) ON DELETE SET NULL;