-- Limpiar elementos atascados en la cola de generación
-- Resetear items que llevan más de 30 minutos en "generating" a "pending" para reintento
UPDATE blog_generation_queue 
SET 
  status = 'pending',
  error_message = 'Timeout detectado - reintentando automáticamente',
  updated_at = NOW()
WHERE status = 'generating' 
AND updated_at < NOW() - INTERVAL '30 minutes';