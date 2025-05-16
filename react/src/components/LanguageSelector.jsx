import { useState, useEffect } from 'react';

export default function LanguageSelector() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'fr');

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    // In a real app, you would trigger a context update or Redux action here
  }, [language]);

  return (
    <div className="relative inline-block text-left ml-2">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-1 pl-2 pr-6 appearance-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
} 