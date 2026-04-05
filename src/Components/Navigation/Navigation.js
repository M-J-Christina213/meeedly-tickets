import { Link, useLocation } from 'react-router-dom';
import "../../Style/Components/Navigation/Navigation.css";

const Navigation = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <i className="bi bi-headset me-2"></i>
                Meeedly Support
            </Link>
            <div className="navbar-links">
                <Link 
                    to="/" 
                    className={`nav-link ${isActive("/") ? "active" : ""}`}
                >
                    <i className="bi bi-grid me-1"></i>
                    Dashboard
                </Link>
                <Link 
                    to="/create" 
                    className={`nav-link ${isActive("/create") ? "active" : ""}`}
                >
                    <i className="bi bi-plus-circle me-1"></i>
                    New Ticket
                </Link>
            </div>
        </nav>
    );
};

export default Navigation;