import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col justify-center items-center px-6 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400">404</h1>
        <h2 className="text-3xl font-bold mt-4 text-gray-900 dark:text-gray-100">Page Not Found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">The page you are looking for doesn't exist or has been moved.</p>
        
        <div className="mt-8">
          <Link to="/films" className="btn-primary">
            {t('see_all_movies')}
          </Link>
        </div>
      </div>
    </div>
  );
}