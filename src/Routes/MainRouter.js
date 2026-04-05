import { Routes, Route } from 'react-router-dom';
import Dashboard from '../View/Dashboard/Dashboard';
import CreateTicket from '../View/CreateTicket/CreateTicket.js';
import TicketView from '../View/TicketView/TicketView';
import Error404 from '../View/Error404/Error404';

export default function MainRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create" element={<CreateTicket />} />
      <Route path="/ticket/:id" element={<TicketView />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}