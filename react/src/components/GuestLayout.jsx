import { Outlet, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import DarkModeToggle from "./DarkModeToggle";
import LanguageSelector from "./LanguageSelector";

export default function GuestLayout() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center">
            <Link to="/films" className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
              <span className="text-red-600 dark:text-red-500">Ciné</span>Cloud
            </Link>
            <div className="absolute right-4 top-4 flex items-center space-x-2">
              <DarkModeToggle />
              <LanguageSelector />
            </div>
          </div>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
}


