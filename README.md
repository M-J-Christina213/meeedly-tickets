# Meeedly Support Ticket System

A scalable support ticket management system built for Meeedly's internal support operations. Designed to handle high ticket volumes across multiple teams with efficient communication between users and support staff.

---

## Live Features

- Submit support tickets with title, description, category and priority
- View individual tickets with full conversation history
- Reply as a user or support staff member
- Assign tickets to agents and update ticket status
- Dashboard with real-time stats, filtering, sorting and search
- Data persists across sessions using localStorage
- Fully responsive across desktop, tablet and mobile

---

## Tech Stack

- React (with Hooks — useState, useEffect)
- React Router DOM (client-side routing)
- Bootstrap & Bootstrap Icons (UI utilities)
- localStorage (data persistence)
- Noplin UI conventions (Meeedly's component standards)

---

## Project Structure
```
src/
├── Assets/              # Logos and images
├── Components/          # Reusable UI components
│   ├── Navigation/      # Top navigation bar
│   └── Footer/          # Page footer
├── Routes/              # App routing (MainRouter.js)
├── Scripts/             # Business logic
│   └── Tickets/         # TicketUtils.js — core data layer
├── Style/               # All CSS files
│   ├── Components/      # Component-level styles
│   ├── View/            # Page-level styles
│   └── Main.css         # Global styles
├── Utilities/           # Helper functions (DateFormat.js)
└── View/                # Page components
    ├── Dashboard/        # Ticket management dashboard
    ├── CreateTicket/     # Ticket submission form
    ├── TicketView/       # Ticket detail and conversation
    └── Error404/         # 404 page
```

---

## Getting Started

### Prerequisites
- Node.js v16 or above
- npm v8 or above

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/meeedly-tickets.git

# Navigate into the project
cd meeedly-tickets

# Install dependencies
npm install

# Start the development server
npm start
```

The app will run at `http://localhost:3000`

---

## Key Engineering Decisions

### Data Layer (TicketUtils.js)
All ticket logic is isolated in a single module. This makes it easy to swap localStorage for a real API in the future without touching any UI components.

### Component Architecture
Components are small, focused and reusable. Navigation and Footer are shared across all pages. Each view page handles its own state independently.

### Scalability Considerations
- Filter and sort logic runs on the data layer, not inside components
- Ticket IDs are generated with timestamps to avoid collisions at scale
- Data structures are designed to map directly to a future REST API schema
- Seed data is only loaded once — system checks before writing

### Performance
- No unnecessary re-renders — state updates are scoped to the component that owns them
- Filtering and sorting are computed from derived state on each render, avoiding stale data

---

## Pages Overview

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | View all tickets with filters and stats |
| Create Ticket | `/create` | Submit a new support ticket |
| Ticket View | `/ticket/:id` | View ticket details and conversation |
| 404 | `*` | Handles unknown routes |

---

## Author

**Christina Wanigasekara**
University: APIIT (Asia Pacific Institute of Information Technology)
Built for Meeedly Software Engineering Internship Assignment