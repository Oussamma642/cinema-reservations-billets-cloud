import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "./Navbar";

export default function DefaultLayout() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Check if user is not admin and trying to access admin routes
        if (parsedUser.role !== 'admin' && window.location.pathname === '/admin') {
          navigate('/films');
        }
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear user data and token
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/films');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="py-4">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="py-6 bg-white dark:bg-slate-800 shadow-inner mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} CinéCloud. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
