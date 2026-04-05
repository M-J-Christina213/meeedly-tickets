import { useNavigate } from 'react-router-dom';
import Navigation from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';

function Error404() {
    const navigate = useNavigate();
    return (
        <div className="page-wrapper">
            <Navigation />
            <main className="main-content" style={{ textAlign: 'center', paddingTop: '5rem' }}>
                <i className="bi bi-exclamation-circle" style={{ fontSize: '4rem', color: '#475569' }}></i>
                <h1 style={{ fontSize: '2rem', color: '#f8fafc', margin: '1rem 0 0.5rem' }}>404 - Page Not Found</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
                <button className="btn-primary" onClick={() => navigate('/')}>
                    <i className="bi bi-house me-2"></i>Back to Dashboard
                </button>
            </main>
            <Footer />
        </div>
    );
}

export default Error404;