import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import { getTicketById, addResponse, updateTicket, TICKET_STATUSES, AGENTS } from '../../Scripts/Tickets/TicketUtils';
import { formatDateTime, timeAgo } from '../../Utilities/DateFormat';
import "../../Style/View/TicketView/TicketView.css";

function TicketView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState('');
    const [replyAuthor, setReplyAuthor] = useState('');
    const [isStaff, setIsStaff] = useState(false);
    const [replyError, setReplyError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const found = getTicketById(id);
        if (!found) {
            navigate('/');
            return;
        }
        setTicket(found);
        setLoading(false);
    }, [id, navigate]);

    const handleStatusChange = (e) => {
        const updated = updateTicket(ticket.id, { status: e.target.value });
        setTicket(updated);
    };

    const handleAssignChange = (e) => {
        const updated = updateTicket(ticket.id, { assignedTo: e.target.value || null });
        setTicket(updated);
    };

    const handleReply = () => {
        if (!replyMessage.trim()) {
            setReplyError("Message cannot be empty.");
            return;
        }
        if (!replyAuthor.trim()) {
            setReplyError("Please enter your name.");
            return;
        }

        setSubmitting(true);
        setReplyError('');

        try {
            const updated = addResponse(ticket.id, {
                author: replyAuthor,
                message: replyMessage,
                isStaff,
            });
            setTicket(updated);
            setReplyMessage('');
        } catch (err) {
            setReplyError("Failed to send reply. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const getPriorityClass = (priority) =>
        `badge badge-${priority?.toLowerCase()}`;

    const getStatusClass = (status) =>
        `badge badge-${status?.toLowerCase().replace(" ", "-")}`;

    const getAssignedName = (assignedTo) => {
        const agent = AGENTS.find((a) => a.id === assignedTo);
        return agent ? agent.name : "Unassigned";
    };

    if (loading) {
        return (
            <div className="page-wrapper">
                <Navigation />
                <main className="main-content">
                    <div className="loading-state">
                        <i className="bi bi-hourglass-split"></i>
                        <p>Loading ticket...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Navigation />
            <main className="main-content">
                <div className="ticket-view-container">

                    {/* Back Button */}
                    <button className="btn-back" onClick={() => navigate('/')}>
                        <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
                    </button>

                    {/* Ticket Header */}
                    <div className="ticket-header-card">
                        <div className="ticket-header-top">
                            <div>
                                <span className="ticket-id">{ticket.id}</span>
                                <h1 className="ticket-title">{ticket.title}</h1>
                            </div>
                            <div className="ticket-badges">
                                <span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span>
                                <span className={getStatusClass(ticket.status)}>{ticket.status}</span>
                            </div>
                        </div>

                        <div className="ticket-meta">
                            <span><i className="bi bi-person me-1"></i>{ticket.createdBy}</span>
                            <span><i className="bi bi-tag me-1"></i>{ticket.category}</span>
                            <span><i className="bi bi-clock me-1"></i>{formatDateTime(ticket.createdAt)}</span>
                        </div>

                        <div className="ticket-description">
                            <h3>Description</h3>
                            <p>{ticket.description}</p>
                        </div>
                    </div>

                    {/* Management Panel */}
                    <div className="management-panel">
                        <div className="management-group">
                            <label><i className="bi bi-arrow-repeat me-1"></i>Status</label>
                            <select value={ticket.status} onChange={handleStatusChange}>
                                {TICKET_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="management-group">
                            <label><i className="bi bi-person-check me-1"></i>Assigned To</label>
                            <select value={ticket.assignedTo || ''} onChange={handleAssignChange}>
                                <option value="">Unassigned</option>
                                {AGENTS.map((agent) => (
                                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="management-group">
                            <label><i className="bi bi-person-badge me-1"></i>Assigned Agent</label>
                            <span className="assigned-name">{getAssignedName(ticket.assignedTo)}</span>
                        </div>
                    </div>

                    {/* Conversation Thread */}
                    <div className="conversation-section">
                        <h2><i className="bi bi-chat-dots me-2"></i>Conversation ({ticket.responses.length})</h2>

                        {ticket.responses.length === 0 ? (
                            <div className="empty-responses">
                                <i className="bi bi-chat-square-dots"></i>
                                <p>No replies yet. Be the first to respond.</p>
                            </div>
                        ) : (
                            <div className="responses-list">
                                {ticket.responses.map((res) => (
                                    <div
                                        key={res.id}
                                        className={`response-card ${res.isStaff ? 'staff' : 'user'}`}
                                    >
                                        <div className="response-header">
                                            <div className="response-author">
                                                <i className={`bi ${res.isStaff ? 'bi-headset' : 'bi-person-circle'} me-2`}></i>
                                                <strong>{res.author}</strong>
                                                {res.isStaff && <span className="staff-badge">Support</span>}
                                            </div>
                                            <span className="response-time">{timeAgo(res.createdAt)}</span>
                                        </div>
                                        <p className="response-message">{res.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reply Box */}
                    <div className="reply-section">
                        <h2><i className="bi bi-reply me-2"></i>Add Reply</h2>

                        <div className="reply-form">
                            <div className="reply-top-row">
                                <input
                                    type="text"
                                    placeholder="Your name or email"
                                    value={replyAuthor}
                                    onChange={(e) => {
                                        setReplyAuthor(e.target.value);
                                        setReplyError('');
                                    }}
                                />
                                <label className="staff-toggle">
                                    <input
                                        type="checkbox"
                                        checked={isStaff}
                                        onChange={(e) => setIsStaff(e.target.checked)}
                                    />
                                    <span>Replying as Support Staff</span>
                                </label>
                            </div>

                            <textarea
                                placeholder="Write your reply here..."
                                rows={4}
                                value={replyMessage}
                                onChange={(e) => {
                                    setReplyMessage(e.target.value);
                                    setReplyError('');
                                }}
                            />

                            {replyError && <span className="error-msg">{replyError}</span>}

                            <div className="reply-actions">
                                <button
                                    className="btn-primary"
                                    onClick={handleReply}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <><i className="bi bi-hourglass-split me-2"></i>Sending...</>
                                    ) : (
                                        <><i className="bi bi-send me-2"></i>Send Reply</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}

export default TicketView;