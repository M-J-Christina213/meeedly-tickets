import "../../Style/Components/Footer/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <p>
                <i className="bi bi-headset me-2"></i>
                &copy; {new Date().getFullYear()} Meeedly Support System. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;