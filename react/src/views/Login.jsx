import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { AuthService } from "../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    
    const from = location.state?.returnUrl || "/films";

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setError("");
        
        try {
            // Use AuthService to login
            const response = await AuthService.login({ email, password });
            
            // Save token and user data to localStorage is now handled in AuthService
            
            console.log("Login successful for:", email);
            
            // Redirect to the original page or /films
            navigate(from);
        } catch (err) {
            console.error("Login error:", err);
            
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to login. Please check your credentials.");
            }
            
            // Fallback is now handled in AuthService
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-signup-form">
            <div className="form">
                <h2 className="title">{t('login')}</h2>
                
                {error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md mb-4">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('email')}
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('password')}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn"
                        >
                            {loading ? "..." : t('connect')}
                        </button>
                    </div>
                </form>

                <p className="message">
                    {t('no_account')} {' '}
                    <Link to="/signup">
                        {t('create_account')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
