import { Link } from "react-router-dom";

export const OrquestFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-8 items-center">
            <div className="w-32 h-16 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-sm font-semibold">KairosHR</span>
            </div>
            <div className="w-32 h-16 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-sm font-semibold">Navarro</span>
            </div>
          </div>
          
          <div className="flex gap-6 text-sm">
            <Link to="/contacto" className="hover:text-blue-400 transition-colors">
              Contacto
            </Link>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Política de privacidad
            </a>
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-400 text-sm border-t border-gray-800 pt-8">
          © 2025 KairosHR by Navarro Tax Legal. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
