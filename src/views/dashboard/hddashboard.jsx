import { Container, Row, Col, Form, Modal, Button, Pagination } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from 'config';

import 'views/report/bento-layout-new.css';
import 'views/report/hd-dashboard-v2.css'; // replaces hd-dashboard-polish.css
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import AllTicketSCAT from 'views/report/allticketSCAT';
import GetAllByCategoryOwn from 'views/report/getallbycategoryown';
import AllDataOwn from 'views/report/alldataown';
import AnimatedContent from 'layouts/ReactBits/AnimatedContent';
import { useNavigate } from 'react-router';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* ---------- small helpers / components ---------- */

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
const IconTicket = () => (
  <Icon>
    <path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z" />
    <path d="M13 6v12" strokeDasharray="2 2" />
  </Icon>
);
const IconCheck = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </Icon>
);
const IconInbox = () => (
  <Icon>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z" />
  </Icon>
);

const statusClass = (s = '') => `badge-pill st-${s.toLowerCase().replace(/\s+/g, '-')}`;
const levelClass = (l = '') => `badge-pill lv-${l.toLowerCase()}`;
const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

function PaginationBar({ current, total, onChange }) {
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

function StatCard({ label, value, accent, icon, onClick }) {
  return (
    <div className="stat-card" style={{ '--accent': accent }} onClick={onClick}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value || '0'}</div>
        <div className="stat-hint">Click to view list</div>
      </div>
    </div>
  );
}

// Defined outside HDDashboard so it is not remounted on every render
function TicketsTable({ tickets }) {
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

export default function HDDashboard() {
  const [filterType, setFilterType] = useState('all');
  const [selectUserState, setSelectUserState] = useState(false);
  const navigate = useNavigate();
  const [getAllHD, setGetAllHD] = useState([]);
  const [selectedHD, setSelectedHD] = useState('');

  const [allTickets, setAllTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [ownTicket, setOwnTicket] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const [open, setOpen] = useState('');
  const [notReviewed, setNotReviewed] = useState('');
  const [closed, setClosed] = useState('');

  const [userInfo, setUserInfo] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  const totalPages = Math.ceil(ownTicket.length / itemsPerPage);
  const currentItems = ownTicket.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(true);
  };

  // Filter: select user HD
  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (getAllHD.length > 0 && !selectedHD) {
      setSelectedHD(empInfo.user_name);
    }
    if (empInfo.emp_role === 'admin' && empInfo.emp_tier === 'helpdesk') {
      setSelectUserState(true);
    }
  }, [getAllHD]);

  // Fetch tickets
  useEffect(() => {
    const fetch = async () => {
      const empInfo = JSON.parse(localStorage.getItem('user'));
      setUserInfo(empInfo);
      try {
        const res = await axios.get(`${config.baseApi}/ticket/get-all-ticket`);
        const data = res.data || [];
        setAllTickets(data);

        const resgetall = await axios.get(`${config.baseApi}/authentication/get-all-users`);
        setGetAllHD(resgetall.data.filter((hd) => hd.emp_tier === 'helpdesk'));

        const own = data.filter((e) => e.assigned_to === selectedHD).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOwnTicket(own);
        setCurrentPage(1);
      } catch (err) {
        console.log('Unable to fetch Data: ', err);
      }
    };
    fetch();
  }, [selectedHD]);

  // Filter / counters
  useEffect(() => {
    if (!allTickets.length) return;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfWeek);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let filtered = [...allTickets];

    switch (filterType) {
      case 'today':
        filtered = filtered.filter((t) => new Date(t.created_at) >= startOfToday);
        break;
      case 'thisWeek':
        filtered = filtered.filter((t) => new Date(t.created_at) >= startOfWeek);
        break;
      case 'lastWeek':
        filtered = filtered.filter((t) => {
          const created = new Date(t.created_at);
          return created >= startOfLastWeek && created < endOfLastWeek;
        });
        break;
      case 'thisMonth':
        filtered = filtered.filter((t) => new Date(t.created_at) >= startOfMonth);
        break;
      case 'perMonth':
        filtered = filtered.filter((t) => new Date(t.created_at) >= startOfYear);
        break;
      case 'perYear':
        filtered = filtered.filter((t) => new Date(t.created_at).getFullYear() === now.getFullYear());
        break;
      default:
        break;
    }

    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFilteredTickets(filtered);

    setOpen(
      filtered.filter(
        (t) => ['in-progress', 'assigned', 're-opened'].includes(t.ticket_status) && t.assigned_to === selectedHD && t.is_active === true
      ).length
    );

    setNotReviewed(
      filtered.filter(
        (t) =>
          t.is_reviewed === false &&
          ['closed', 'resolved'].includes(t.ticket_status) &&
          t.assigned_to === selectedHD &&
          t.is_active === true
      ).length
    );

    setClosed(filtered.filter((t) => t.ticket_status === 'open' && t.is_active === true).length);
  }, [filterType, allTickets, selectedHD]);

  const myActive = () =>
    filteredTickets.filter(
      (t) => ['in-progress', 'assigned', 're-opened'].includes(t.ticket_status) && t.assigned_to === selectedHD && t.is_active === true
    );
  const myNotReviewed = () =>
    filteredTickets.filter(
      (t) =>
        t.is_reviewed === false && t.assigned_to === selectedHD && t.is_active === true && ['closed', 'resolved'].includes(t.ticket_status)
    );
  const allOpen = () => filteredTickets.filter((t) => t.ticket_status === 'open' && t.is_active === true);

  return (
    <Container
      fluid
      className="px-3 px-md-5"
      style={{
        background: 'linear-gradient(to bottom, #ffe798ff, #b8860b)',
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '30px'
      }}
    >
      <AnimatedContent
        distance={100}
        direction="vertical"
        reverse={true}
        duration={0.8}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        scale={1.0}
        threshold={0.1}
        delay={0}
      >
        {/* ---------- Header ---------- */}
        <div className="hd-header">
          <div>
            <h2 className="hd-title">Dashboard</h2>
            <p className="hd-subtitle">{selectedHD ? `Showing tickets for ${selectedHD}` : 'Helpdesk overview'}</p>
          </div>
          <div className="hd-filters">
            <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="lastWeek">Last Week</option>
              <option value="thisMonth">This Month</option>
              <option value="perMonth">Per Month</option>
              <option value="perYear">Per Year</option>
            </Form.Select>
            {selectUserState && (
              <Form.Select value={selectedHD} onChange={(e) => setSelectedHD(e.target.value)}>
                {getAllHD.map((hd) => (
                  <option key={hd.user_name} value={hd.user_name}>
                    {hd.user_name}
                  </option>
                ))}
              </Form.Select>
            )}
          </div>
        </div>

        {/* ---------- Stat cards ---------- */}
        <Row className="g-3 mb-4">
          <Col xs={12} md={4}>
            <StatCard
              label="Tickets"
              value={open}
              accent="#0a7a1f"
              icon={<IconTicket />}
              onClick={() => openModal('All Tickets', <TicketsTable tickets={myActive()} />)}
            />
          </Col>
          <Col xs={12} md={4}>
            <StatCard
              label="Not Reviewed"
              value={notReviewed}
              accent="#d97706"
              icon={<IconCheck />}
              onClick={() => openModal('Not Reviewed Tickets', <TicketsTable tickets={myNotReviewed()} />)}
            />
          </Col>
          <Col xs={12} md={4}>
            <StatCard
              label="Open Tickets"
              value={closed}
              accent="#2563eb"
              icon={<IconInbox />}
              onClick={() => openModal('Open Tickets', <TicketsTable tickets={allOpen()} />)}
            />
          </Col>
        </Row>

        {/* ---------- Table + CSAT ---------- */}
        <Row className="g-3 mb-4">
          <Col xs={12} lg={8}>
            <div className="panel">
              <div className="panel-head">
                <h5>My Tickets</h5>
                <small>{ownTicket.length} total</small>
              </div>
              <div className="panel-body">
                <table className="hd-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Problem / Issue</th>
                      <th>Status</th>
                      <th>Level</th>
                      <th>Ticket For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((e) => (
                        <tr key={e.ticket_id} onClick={() => navigate(`/view-hd-ticket?id=${e.ticket_id}`)}>
                          <td className="hd-id">#{e.ticket_id}</td>
                          <td>{e.ticket_subject}</td>
                          <td>
                            <span className={statusClass(e.ticket_status)}>{e.ticket_status}</span>
                          </td>
                          <td>
                            <span className={levelClass(e.ticket_urgencyLevel)}>{e.ticket_urgencyLevel}</span>
                          </td>
                          <td>{capitalize(e.ticket_for)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="empty">
                          No Tickets Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <PaginationBar current={currentPage} total={totalPages} onChange={setCurrentPage} />
              </div>
            </div>
          </Col>

          <Col xs={12} lg={4}>
            <div
              className="panel panel-clickable"
              onClick={() => openModal('Ticket Summary', <AllTicketSCAT filterType={filterType} showChart={false} helpdesk={selectedHD} />)}
            >
              <div className="panel-head">
                <h5>CSAT</h5>
                <small>Customer Satisfaction Score</small>
              </div>
              <div className="panel-body d-flex align-items-center justify-content-center">
                <div style={{ width: '100%' }}>
                  <AllTicketSCAT filterType={filterType} showChart={true} helpdesk={selectedHD} />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* ---------- Completion + Category ---------- */}
        <Row className="g-3">
          <Col xs={12} md={4}>
            <div
              className="panel panel-clickable"
              style={{ minHeight: 420 }}
              onClick={() =>
                openModal('Tickets by Location', <AllDataOwn filterType={filterType} showChart={false} helpdesk={selectedHD} />)
              }
            >
              <div className="panel-head">
                <h5>Ticket Completion Rate</h5>
              </div>
              <div className="panel-body d-flex align-items-center justify-content-center">
                <div style={{ width: '100%', height: '100%' }}>
                  <AllDataOwn filterType={filterType} showChart={true} helpdesk={selectedHD} />
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} md={8}>
            <div
              className="panel panel-clickable"
              style={{ minHeight: 420 }}
              onClick={() =>
                openModal(
                  'All Tickets by Category',
                  <GetAllByCategoryOwn filterType={filterType} showChart={false} helpdesk={selectedHD} />
                )
              }
            >
              <div className="panel-head">
                <h5>Tickets by Category</h5>
              </div>
              <div className="panel-body" style={{ minHeight: 340 }}>
                <GetAllByCategoryOwn filterType={filterType} showChart={true} helpdesk={selectedHD} />
              </div>
            </div>
          </Col>
        </Row>

        {/* ---------- Modal ---------- */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalContent}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </AnimatedContent>
    </Container>
  );
}
