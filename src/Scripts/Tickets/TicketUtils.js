// TicketUtils.js - Core data layer for ticket management

const STORAGE_KEY = "meeedly_tickets";

// ─── Data Generators 
export const generateTicketId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TKT-${timestamp}-${random}`;
};

// ─── Default Data 
export const PRIORITY_LEVELS = ["Low", "Medium", "High", "Critical"];
export const TICKET_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
export const TICKET_CATEGORIES = ["Technical", "Billing", "General", "Feature Request"];
export const AGENTS = [
  { id: "agent-1", name: "Alice Johnson" },
  { id: "agent-2", name: "Bob Smith" },
  { id: "agent-3", name: "Carol White" },
  { id: "agent-4", name: "David Brown" },
];

// ─── Storage Functions 
export const getAllTickets = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading tickets:", error);
    return [];
  }
};

export const saveAllTickets = (tickets) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    return true;
  } catch (error) {
    console.error("Error saving tickets:", error);
    return false;
  }
};

export const getTicketById = (id) => {
  const tickets = getAllTickets();
  return tickets.find((ticket) => ticket.id === id) || null;
};

// ─── Ticket CRUD Functions
export const createTicket = ({ title, description, category, priority, createdBy }) => {
  const newTicket = {
    id: generateTicketId(),
    title: title.trim(),
    description: description.trim(),
    category,
    priority,
    status: "Open",
    createdBy: createdBy?.trim() || "Anonymous",
    assignedTo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    responses: [],
  };

  const tickets = getAllTickets();
  tickets.unshift(newTicket); // newest first
  saveAllTickets(tickets);
  return newTicket;
};

export const updateTicket = (id, updates) => {
  const tickets = getAllTickets();
  const index = tickets.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tickets[index] = {
    ...tickets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveAllTickets(tickets);
  return tickets[index];
};

export const deleteTicket = (id) => {
  const tickets = getAllTickets();
  const filtered = tickets.filter((t) => t.id !== id);
  saveAllTickets(filtered);
  return true;
};

// ─── Response Functions 
export const addResponse = (ticketId, { author, message, isStaff }) => {
  const tickets = getAllTickets();
  const index = tickets.findIndex((t) => t.id === ticketId);
  if (index === -1) return null;

  const newResponse = {
    id: `RES-${Date.now()}`,
    author: author?.trim() || "Anonymous",
    message: message.trim(),
    isStaff: isStaff || false,
    createdAt: new Date().toISOString(),
  };

  tickets[index].responses.push(newResponse);
  tickets[index].updatedAt = new Date().toISOString();

  saveAllTickets(tickets);
  return tickets[index];
};

// ─── Filter & Sort Functions 
export const filterTickets = (tickets, { status, priority, category, search }) => {
  return tickets.filter((ticket) => {
    const matchesStatus = !status || ticket.status === status;
    const matchesPriority = !priority || ticket.priority === priority;
    const matchesCategory = !category || ticket.category === category;
    const matchesSearch =
      !search ||
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.createdBy.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });
};

export const sortTickets = (tickets, sortBy) => {
  const sorted = [...tickets];
  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "priority":
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    case "updated":
      return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    default:
      return sorted;
  }
};

// ─── Seed Data (for demo purposes) 
export const seedDemoData = () => {
  const existing = getAllTickets();
  if (existing.length > 0) return; // don't overwrite

  const demoTickets = [
    {
      id: "TKT-DEMO-001",
      title: "Cannot login to my account",
      description: "I have been trying to login since yesterday but keep getting an error saying invalid credentials even though I reset my password.",
      category: "Technical",
      priority: "High",
      status: "Open",
      createdBy: "john.doe@example.com",
      assignedTo: "agent-1",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      responses: [
        {
          id: "RES-DEMO-001",
          author: "Alice Johnson",
          message: "Hi John, I am looking into this for you right now. Can you tell me what browser you are using?",
          isStaff: true,
          createdAt: new Date(Date.now() - 80000000).toISOString(),
        },
      ],
    },
    {
      id: "TKT-DEMO-002",
      title: "Wrong charge on my invoice",
      description: "My invoice for this month shows $299 but I am on the $99 plan. Please fix this immediately.",
      category: "Billing",
      priority: "Critical",
      status: "In Progress",
      createdBy: "sarah.k@company.com",
      assignedTo: "agent-2",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 50000000).toISOString(),
      responses: [],
    },
    {
      id: "TKT-DEMO-003",
      title: "Feature request: Dark mode",
      description: "It would be great to have a dark mode option in the dashboard settings.",
      category: "Feature Request",
      priority: "Low",
      status: "Open",
      createdBy: "dev.user@startup.io",
      assignedTo: null,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
      responses: [],
    },
  ];

  saveAllTickets(demoTickets);
};