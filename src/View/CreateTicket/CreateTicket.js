import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import { createTicket, PRIORITY_LEVELS, TICKET_CATEGORIES } from '../../Scripts/Tickets/TicketUtils';
import "../../Style/View/CreateTicket/CreateTicket.css";

function CreateTicket() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'General',
        priority: 'Medium',
        createdBy: '',
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = "Title is required.";
        if (form.title.trim().length > 100) newErrors.title = "Title must be under 100 characters.";
        if (!form.description.trim()) newErrors.description = "Description is required.";
        if (form.description.trim().length < 10) newErrors.description = "Description must be at least 10 characters.";
        if (!form.createdBy.trim()) newErrors.createdBy = "Your name or email is required.";
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        try {
            const ticket = createTicket(form);
            navigate(`/ticket/${ticket.id}`);
        } catch (err) {
            console.error("Failed to create ticket:", err);
            setSubmitting(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Navigation />
            <main className="main-content">
                <div className="create-ticket-container">
                    <div className="create-ticket-header">
                        <h1>
                            <i className="bi bi-plus-circle me-2"></i>
                            Submit a Support Ticket
                        </h1>
                        <p>Fill in the details below and our team will get back to you shortly.</p>
                    </div>

                    <form className="ticket-form" onSubmit={handleSubmit}>

                        {/* Name / Email */}
                        <div className="form-group">
                            <label>Your Name or Email <span className="required">*</span></label>
                            <input
                                type="text"
                                name="createdBy"
                                value={form.createdBy}
                                onChange={handleChange}
                                placeholder="e.g. john.doe@company.com"
                                className={errors.createdBy ? "input-error" : ""}
                            />
                            {errors.createdBy && <span className="error-msg">{errors.createdBy}</span>}
                        </div>

                        {/* Title */}
                        <div className="form-group">
                            <label>Ticket Title <span className="required">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Cannot login to my account"
                                className={errors.title ? "input-error" : ""}
                            />
                            <span className="char-count">{form.title.length}/100</span>
                            {errors.title && <span className="error-msg">{errors.title}</span>}
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label>Description <span className="required">*</span></label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your issue in detail..."
                                rows={5}
                                className={errors.description ? "input-error" : ""}
                            />
                            {errors.description && <span className="error-msg">{errors.description}</span>}
                        </div>

                        {/* Category & Priority Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select name="category" value={form.category} onChange={handleChange}>
                                    {TICKET_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Priority</label>
                                <select name="priority" value={form.priority} onChange={handleChange}>
                                    {PRIORITY_LEVELS.map((level) => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate("/")}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <><i className="bi bi-hourglass-split me-2"></i>Submitting...</>
                                ) : (
                                    <><i className="bi bi-send me-2"></i>Submit Ticket</>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CreateTicket;