import { Link } from "react-router-dom";

export const OrquestFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-center items-center gap-8">
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
