import { useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router';

/* Shared building blocks for the dashboard + report pages.
   Needs hd-dashboard-v2.css (and report-extras.css for the Report page). */

const Icon = ({ children }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);
export const IconTicket = () => (
  <Icon>
    <path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z" />
    <path d="M13 6v12" strokeDasharray="2 2" />
  </Icon>
);
export const IconCheck = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </Icon>
);
export const IconInbox = () => (
  <Icon>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z" />
  </Icon>
);
export const IconLock = () => (
  <Icon>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Icon>
);

export const statusClass = (s = '') => `badge-pill st-${s.toLowerCase().replace(/\s+/g, '-')}`;
export const levelClass = (l = '') => `badge-pill lv-${l.toLowerCase()}`;
export const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export function PaginationBar({ current, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div className="d-flex justify-content-center mt-3">
      <Pagination className="hd-pagination mb-0">
        <Pagination.First onClick={() => onChange(1)} disabled={current === 1} />
        <Pagination.Prev onClick={() => onChange(Math.max(current - 1, 1))} disabled={current === 1} />
        {Array.from({ length: total }, (_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === current} onClick={() => onChange(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => onChange(Math.min(current + 1, total))} disabled={current === total} />
        <Pagination.Last onClick={() => onChange(total)} disabled={current === total} />
      </Pagination>
    </div>
  );
}

export function StatCard({ label, value, accent, icon, onClick }) {
  return (
    <div className="stat-card" style={{ '--accent': accent }} onClick={onClick}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value === '' || value == null ? 0 : value}</div>
        <div className="stat-hint">Click to view list</div>
      </div>
    </div>
  );
}

export function TicketsTable({ tickets }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(tickets.length / perPage);
  const rows = tickets.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="hd-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Problem / Issue</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>For</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((t) => (
              <tr key={t.ticket_id} onClick={() => navigate(`/view-hd-ticket?id=${t.ticket_id}`)}>
                <td className="hd-id">#{t.ticket_id}</td>
                <td>{t.ticket_subject}</td>
                <td>
                  <span className={statusClass(t.ticket_status)}>{t.ticket_status}</span>
                </td>
                <td>{t.assigned_to}</td>
                <td>{t.ticket_for}</td>
                <td>{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty">
                No Tickets Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PaginationBar current={page} total={totalPages} onChange={setPage} />
    </div>
  );
}
