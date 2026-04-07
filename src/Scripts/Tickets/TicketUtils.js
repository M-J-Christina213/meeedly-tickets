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
  if (existing.length > 0) return;

  const demoTickets = [
    {
      id: "TKT-DEMO-001",
      title: "Cannot login to my account after password reset",
      description: "I reset my password yesterday using the forgot password link. I received the email and set a new password successfully, but when I try to login with the new password it says invalid credentials. I have tried clearing my browser cache and using incognito mode but the issue persists.",
      category: "Technical",
      priority: "High",
      status: "In Progress",
      createdBy: "john.doe@techcorp.com",
      assignedTo: "agent-1",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 40000000).toISOString(),
      responses: [
        {
          id: "RES-DEMO-001",
          author: "Alice Johnson",
          message: "Hi John, thanks for reaching out. I can see your account in our system. Can you confirm which browser and device you are using? Also, could you try logging in at app.meeedly.com directly rather than through any saved links?",
          isStaff: true,
          createdAt: new Date(Date.now() - 80000000).toISOString(),
        },
        {
          id: "RES-DEMO-002",
          author: "john.doe@techcorp.com",
          message: "I am using Chrome on Windows 11. I tried the direct link and still getting the same error. The error message says Account temporarily locked.",
          isStaff: false,
          createdAt: new Date(Date.now() - 70000000).toISOString(),
        },
        {
          id: "RES-DEMO-003",
          author: "Alice Johnson",
          message: "I can see your account was locked due to multiple failed attempts before your reset. I have manually unlocked it now. Please try logging in again and let me know if it works.",
          isStaff: true,
          createdAt: new Date(Date.now() - 40000000).toISOString(),
        },
      ],
    },
    {
      id: "TKT-DEMO-002",
      title: "Incorrect billing charge — charged $299 instead of $99",
      description: "My invoice for March 2026 shows a charge of $299 however I am subscribed to the Starter plan which is $99 per month. I have not upgraded my plan and did not authorize this charge. Please refund the difference immediately as this is affecting our company budget.",
      category: "Billing",
      priority: "Critical",
      status: "Open",
      createdBy: "finance@startupxyz.io",
      assignedTo: "agent-2",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 170000000).toISOString(),
      responses: [],
    },
    {
      id: "TKT-DEMO-003",
      title: "Feature request: Export tickets to CSV",
      description: "Our support manager needs to generate weekly reports of all tickets. Currently we have to manually copy data. It would be extremely helpful if we could export the ticket dashboard to a CSV file with filters applied. This would save our team several hours every week.",
      category: "Feature Request",
      priority: "Medium",
      status: "Open",
      createdBy: "ops.manager@enterprise.com",
      assignedTo: null,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
      responses: [
        {
          id: "RES-DEMO-004",
          author: "Carol White",
          message: "Thank you for this suggestion! I have logged this as a feature request with our product team. We will update you once this is on our roadmap.",
          isStaff: true,
          createdAt: new Date(Date.now() - 250000000).toISOString(),
        },
      ],
    },
    {
      id: "TKT-DEMO-004",
      title: "Dashboard loading very slowly for large teams",
      description: "Since our team grew to over 200 members the dashboard takes more than 15 seconds to load. Before we had around 50 members it was instant. We are on the Enterprise plan and this is affecting our daily operations significantly.",
      category: "Technical",
      priority: "Critical",
      status: "In Progress",
      createdBy: "it.admin@globalcorp.com",
      assignedTo: "agent-3",
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      updatedAt: new Date(Date.now() - 100000000).toISOString(),
      responses: [
        {
          id: "RES-DEMO-005",
          author: "Carol White",
          message: "Hi, I have escalated this to our engineering team. We have identified a query performance issue affecting large teams. A fix is currently being tested and we expect to deploy within 48 hours.",
          isStaff: true,
          createdAt: new Date(Date.now() - 100000000).toISOString(),
        },
      ],
    },
    {
      id: "TKT-DEMO-005",
      title: "Cannot invite new team members — invite emails not arriving",
      description: "We are trying to onboard 5 new team members but none of them are receiving the invitation emails. We have checked spam folders and confirmed the email addresses are correct. This is blocking our project kickoff scheduled for tomorrow.",
      category: "Technical",
      priority: "High",
      status: "Resolved",
      createdBy: "sarah.k@designstudio.com",
      assignedTo: "agent-1",
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      updatedAt: new Date(Date.now() - 200000000).toISOString(),
      responses: [
        {
          id: "RES-DEMO-006",
          author: "Alice Johnson",
          message: "We identified an issue with our email delivery provider affecting invitations sent between 9am and 2pm UTC today. The issue has been resolved. I have resent all 5 invitations manually. Could you ask your team members to check their inbox now?",
          isStaff: true,
          createdAt: new Date(Date.now() - 300000000).toISOString(),
        },
        {
          id: "RES-DEMO-007",
          author: "sarah.k@designstudio.com",
          message: "All 5 team members have now received their invitations and successfully joined. Thank you for the quick resolution!",
          isStaff: false,
          createdAt: new Date(Date.now() - 200000000).toISOString(),
        },
      ],
    },
    {
      id: "TKT-DEMO-006",
      title: "API rate limit too restrictive for our integration",
      description: "We are building an integration with Meeedly API and hitting the rate limit of 100 requests per minute. Our use case requires at least 500 requests per minute during peak hours. We are on the Enterprise plan and would like to discuss a custom rate limit.",
      category: "General",
      priority: "Medium",
      status: "Open",
      createdBy: "dev.lead@integrations.co",
      assignedTo: "agent-4",
      createdAt: new Date(Date.now() - 518400000).toISOString(),
      updatedAt: new Date(Date.now() - 518400000).toISOString(),
      responses: [],
    },
    {
      id: "TKT-DEMO-007",
      title: "Two-factor authentication not working with Authenticator app",
      description: "After enabling 2FA on my account using Google Authenticator the codes are being rejected every time I try to login. I have verified that my phone time is synced correctly. I am now locked out of my account completely.",
      category: "Technical",
      priority: "High",
      status: "Closed",
      createdBy: "michael.chen@ventures.com",
      assignedTo: "agent-2",
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      updatedAt: new Date(Date.now() - 500000000).toISOString(),
      responses: [
        {
          id: "RES-DEMO-008",
          author: "Bob Smith",
          message: "I have temporarily disabled 2FA on your account so you can log back in. Once logged in please go to Security Settings and re-enable 2FA. Make sure to scan the QR code fresh rather than using any previously saved codes.",
          isStaff: true,
          createdAt: new Date(Date.now() - 590000000).toISOString(),
        },
        {
          id: "RES-DEMO-009",
          author: "michael.chen@ventures.com",
          message: "That worked perfectly. Re-enabled 2FA and it is working correctly now. Thank you!",
          isStaff: false,
          createdAt: new Date(Date.now() - 500000000).toISOString(),
        },
      ],
    },
    {
      id: "TKT-DEMO-008",
      title: "Need to change the primary email on our organization account",
      description: "Our company recently rebranded and we have new email addresses. I need to update the primary admin email from old@company.com to admin@newbrand.com. I have access to both email addresses currently.",
      category: "General",
      priority: "Low",
      status: "Resolved",
      createdBy: "admin@newbrand.com",
      assignedTo: "agent-3",
      createdAt: new Date(Date.now() - 691200000).toISOString(),
      updatedAt: new Date(Date.now() - 600000000).toISOString(),
      responses: [
        {
          id: "RES-DEMO-010",
          author: "Carol White",
          message: "I have updated the primary email address on your organization account. A confirmation has been sent to both your old and new email addresses. Please verify the new email by clicking the link sent to admin@newbrand.com.",
          isStaff: true,
          createdAt: new Date(Date.now() - 600000000).toISOString(),
        },
      ],
    },
  ];

  saveAllTickets(demoTickets);
};