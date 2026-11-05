import { useEffect, useState } from 'react';
import { Container, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import config from 'config';
import { useNavigate } from 'react-router';
import Spinner from 'react-bootstrap/Spinner';

export default function InActiveAnnouncement() {
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [fullname, setFullname] = useState({});
  const navigate = useNavigate();
  const [ancId, setAncId] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 5;

  const [loading, setLoading] = useState(false);

  // Pagination logic
  const indexOfLast = currentPage * announcementsPerPage;
  const indexOfFirst = indexOfLast - announcementsPerPage;
  const currentAnnouncements = announcementsList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(announcementsList.length / announcementsPerPage);

  // Fetch all announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${config.baseApi}/announcements/get-all-anc`);

        // All inactive announcements
        const inactive = res.data.filter((data) => data.is_active === false);
        setAnnouncementsList(inactive);

        const usernames = res.data.map((data) => data.created_by);

        const getUsernames = await axios.get(`${config.baseApi}/authentication/get-all-notes-usernames`, {
          params: { user_name: JSON.stringify(usernames) }
        });

        const userMap = {};
        getUsernames.data.forEach((user) => {
          userMap[user.user_name] = `${user.emp_FirstName} ${user.emp_LastName}`;
        });
        setFullname(userMap);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  // Re-activate announcement
  const handleEditClick = async (announcement) => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    try {
      setLoading(true);
      await axios.post(`${config.baseApi}/announcements/reactivate-anc`, {
        announcement_id: announcement.announcements_id,
        updated_by: empInfo.user_name
      });

      setSuccess('Announcement Re-activated successfully!');
      setAncId(null);
      window.location.reload();
    } catch (err) {
      console.log('Unable to update announcement:', err);
      setLoading(false);
      setError('Failed to update announcement.');
    }
  };

  // Permanently delete announcement
  const handleDelete = async (announcementId) => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${config.baseApi}/announcements/perma-delete-anc`, {
        announcement_id: announcementId,
        updated_by: empInfo.user_name
      });
      setSuccess('Announcement deleted successfully!');
      setAnnouncementsList(announcementsList.filter((item) => item.announcements_id !== announcementId));
      setAncId(null);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setLoading(false);
      setError('Failed to delete announcement.');
    }
  };

  // Navigate to the main announcement page
  const HandleAnnouncements = () => {
    setLoading(true);
    navigate('/announcements');
  };

  const alertWrapperStyle = {
    top: '80px',
    zIndex: 9999,
    width: 'calc(100% - 24px)',
    maxWidth: '420px'
  };

  return (
    <Container
      fluid
      className="px-3 px-md-5"
      style={{
        background: 'linear-gradient(to bottom, #ffe798ff, #b8860b)',
        minHeight: '100dvh',
        paddingTop: 'clamp(80px, 12vw, 100px)',
        paddingBottom: '20px',
        overflowX: 'hidden'
      }}
    >
      {/* Alerts */}
      {error && (
        <div className="position-fixed start-50 translate-middle-x" style={alertWrapperStyle}>
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        </div>
      )}
      {success && (
        <div className="position-fixed start-50 translate-middle-x" style={alertWrapperStyle}>
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            {success}
          </Alert>
        </div>
      )}

      <Row className="mb-3">
        <Col>
          <div className="d-grid d-md-flex justify-content-md-end">
            <Button variant="secondary" onClick={HandleAnnouncements}>
              Announcements
            </Button>
          </div>
        </Col>
      </Row>

      <div className="mt-3 mt-md-4">
        {currentAnnouncements.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <Card.Text style={{ fontSize: '1.2rem', fontWeight: '500', textAlign: 'center' }}>NO ARCHIVED ANNOUNCEMENTS</Card.Text>
          </div>
        ) : (
          currentAnnouncements.map((item) => (
            <Card key={item.announcements_id} className="mb-3 mb-md-4 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body className="p-3 p-md-4">
                <div className="d-flex align-items-start justify-content-between mb-2 gap-2">
                  <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
                    <img
                      src="src/assets/images/user/avatar-2.jpg"
                      alt="Profile"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '10px',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <strong className="d-block text-truncate">{fullname[item.created_by] || item.created_by || 'Unknown'}</strong>
                      <small className="text-muted d-block">{new Date(item.created_at).toLocaleString()}</small>
                    </div>
                  </div>

                  {/* position-relative anchors the dropdown to this icon */}
                  <div className="position-relative flex-shrink-0">
                    <button
                      type="button"
                      className="btn btn-link text-dark p-2 lh-1"
                      aria-label="Announcement options"
                      onClick={() => setAncId(item.announcements_id === ancId ? null : item.announcements_id)}
                    >
                      <i className="bi bi-three-dots"></i>
                    </button>

                    {ancId === item.announcements_id && (
                      <div
                        className="position-absolute bg-white border rounded shadow-sm"
                        style={{ top: '100%', right: 0, zIndex: 1000, minWidth: '130px' }}
                      >
                        <div
                          className="px-3 py-2 text-dark border-bottom"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleEditClick(item)}
                        >
                          Re-activate
                        </div>
                        <div
                          className="px-3 py-2 text-danger"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleDelete(item.announcements_id)}
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Card.Text className="mb-0" style={{ fontSize: '1.05rem', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                  {item.announcements}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 flex-wrap gap-2">
            <Button
              variant="miColor"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="miColor"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000
          }}
        >
          <Spinner animation="border" variant="light" />
        </div>
      )}
    </Container>
  );
}
