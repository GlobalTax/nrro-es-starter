import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const AdminPlaceholder = () => {
  const location = useLocation();
  const name = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Página';

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Construction className="h-10 w-10 text-gray-300 mb-4" />
      <h2 className="text-lg font-medium text-gray-700 capitalize">{name}</h2>
      <p className="text-sm text-gray-400 mt-1">Esta sección estará disponible próximamente.</p>
    </div>
  );
};

export default AdminPlaceholder;
