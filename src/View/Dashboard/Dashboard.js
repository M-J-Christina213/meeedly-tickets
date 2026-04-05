import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import { getAllTickets, filterTickets, sortTickets, seedDemoData, TICKET_STATUSES, PRIORITY_LEVELS, TICKET_CATEGORIES, AGENTS } from '../../Scripts/Tickets/TicketUtils';
import { timeAgo } from '../../Utilities/DateFormat';
import "../../Style/View/Dashboard/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [filters, setFilters] = useState({ status: '', priority: '', category: '', search: '' });
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        seedDemoData();
        setTickets(getAllTickets());
        setLoading(false);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({ status: '', priority: '', category: '', search: '' });
        setSortBy('newest');
    };

    const getAssignedName = (assignedTo) => {
        const agent = AGENTS.find((a) => a.id === assignedTo);
        return agent ? agent.name : "Unassigned";
    };

    const getPriorityClass = (priority) =>
        `badge badge-${priority?.toLowerCase()}`;

    const getStatusClass = (status) =>
        `badge badge-${status?.toLowerCase().replace(" ", "-")}`;

    const processedTickets = sortTickets(filterTickets(tickets, filters), sortBy);

    // Stats for summary cards
    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === "Open").length,
        inProgress: tickets.filter((t) => t.status === "In Progress").length,
        critical: tickets.filter((t) => t.priority === "Critical").length,
    };

    return (
        <div className="page-wrapper">
            <Navigation />
            <main className="main-content">
                <div className="dashboard-container">

                    {/* Header */}
                    <div className="dashboard-header">
                        <div>
                            <h1><i className="bi bi-grid me-2"></i>Support Dashboard</h1>
                            <p>Manage and track all support tickets across your organization.</p>
                        </div>
                        <button className="btn-primary" onClick={() => navigate('/create')}>
                            <i className="bi bi-plus-circle me-2"></i>New Ticket
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <i className="bi bi-ticket-perforated"></i>
                            <div>
                                <span className="stat-number">{stats.total}</span>
                                <span className="stat-label">Total Tickets</span>
                            </div>
                        </div>
                        <div className="stat-card open">
                            <i className="bi bi-envelope-open"></i>
                            <div>
                                <span className="stat-number">{stats.open}</span>
                                <span className="stat-label">Open</span>
                            </div>
                        </div>
                        <div className="stat-card progress">
                            <i className="bi bi-arrow-repeat"></i>
                            <div>
                                <span className="stat-number">{stats.inProgress}</span>
                                <span className="stat-label">In Progress</span>
                            </div>
                        </div>
                        <div className="stat-card critical">
                            <i className="bi bi-exclamation-triangle"></i>
                            <div>
                                <span className="stat-number">{stats.critical}</span>
                                <span className="stat-label">Critical</span>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="filters-bar">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by title, ID or user..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="search-input"
                        />
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">All Statuses</option>
                            {TICKET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select name="priority" value={filters.priority} onChange={handleFilterChange}>
                            <option value="">All Priorities</option>
                            {PRIORITY_LEVELS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <select name="category" value={filters.category} onChange={handleFilterChange}>
                            <option value="">All Categories</option>
                            {TICKET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="priority">By Priority</option>
                            <option value="updated">Last Updated</option>
                        </select>
                        <button className="btn-clear" onClick={handleClearFilters}>
                            <i className="bi bi-x-circle me-1"></i>Clear
                        </button>
                    </div>

                    {/* Ticket Table */}
                    {loading ? (
                        <div className="loading-state">
                            <i className="bi bi-hourglass-split"></i>
                            <p>Loading tickets...</p>
                        </div>
                    ) : processedTickets.length === 0 ? (
                        <div className="empty-state">
                            <i className="bi bi-inbox"></i>
                            <h3>No tickets found</h3>
                            <p>Try adjusting your filters or create a new ticket.</p>
                            <button className="btn-primary" onClick={() => navigate('/create')}>
                                <i className="bi bi-plus-circle me-2"></i>Create Ticket
                            </button>
                        </div>
                    ) : (
                        <div className="tickets-table-wrapper">
                            <table className="tickets-table">
                                <thead>
                                    <tr>
                                        <th>Ticket ID</th>
                                        <th>Title</th>
                                        <th>Status</th>
                                        <th>Priority</th>
                                        <th>Category</th>
                                        <th>Assigned To</th>
                                        <th>Submitted By</th>
                                        <th>Last Updated</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processedTickets.map((ticket) => (
                                        <tr key={ticket.id} onClick={() => navigate(`/ticket/${ticket.id}`)} className="ticket-row">
                                            <td><span className="ticket-id-cell">{ticket.id}</span></td>
                                            <td className="ticket-title-cell">{ticket.title}</td>
                                            <td><span className={getStatusClass(ticket.status)}>{ticket.status}</span></td>
                                            <td><span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span></td>
                                            <td>{ticket.category}</td>
                                            <td>{getAssignedName(ticket.assignedTo)}</td>
                                            <td>{ticket.createdBy}</td>
                                            <td>{timeAgo(ticket.updatedAt)}</td>
                                            <td>
                                                <button
                                                    className="btn-view"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/ticket/${ticket.id}`);
                                                    }}
                                                >
                                                    <i className="bi bi-eye me-1"></i>View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Dashboard;