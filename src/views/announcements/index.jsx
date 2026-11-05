import { useEffect, useState } from 'react';
import { Container, Button, Card, Form, Row, Col, Alert, Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import config from 'config';
import Spinner from 'react-bootstrap/Spinner';
import AnimatedContent from 'layouts/ReactBits/AnimatedContent';
import { useNavigate } from 'react-router';

export default function Announcements() {
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementTitleText, setAnnouncementTitleText] = useState('');
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [fullname, setFullname] = useState({});

  const navigate = useNavigate();

  const [showCard, setShowCard] = useState(false);
  const [ancId, setAncId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

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

  const [access, setAccess] = useState(false);

  // Validations (empty dependency array so it only runs once)
  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    setAccess(empInfo?.emp_tier === 'helpdesk');
  }, []);

  // Fetch announcements and usernames
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${config.baseApi}/announcements/get-all-anc`);
        const active = res.data.filter((data) => data.is_active === true);
        const sorted = active.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setAnnouncementsList(sorted);

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

  const resetForm = () => {
    setShowCard(false);
    setIsEditing(false);
    setEditId(null);
    setAnnouncementTitleText('');
    setAnnouncementText('');
  };

  const HandleAdd = () => {
    setShowCard(true);
    setIsEditing(false);
    setAnnouncementText('');
    setAnnouncementTitleText('');
  };

  const HandleSave = async () => {
    const empInfo = JSON.parse(localStorage.getItem('user'));

    if (!announcementTitleText.trim() || !announcementText.trim()) {
      setLoading(false);
      setError('Unable to save empty fields, please try again.');
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${config.baseApi}/announcements/add-anc`, {
        announcements: announcementText,
        created_by: empInfo.user_name,
        announcementTitle: announcementTitleText,
        location: empInfo.emp_location
      });
      setSuccess('Announcement created successfully!');
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error('Error saving announcement:', error);
      setLoading(false);
      setError('Failed to create announcement.');
    }
  };

  const handleEditClick = (announcement) => {
    setAnnouncementText(announcement.announcements);
    setAnnouncementTitleText(announcement.announcementTitle);
    setEditId(announcement.announcements_id);
    setIsEditing(true);
    setShowCard(true);
    setAncId(null);
  };

  const handleUpdate = async () => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    try {
      setLoading(true);
      await axios.post(`${config.baseApi}/announcements/update-anc`, {
        announcement_id: editId,
        announcements: announcementText,
        updated_by: empInfo.user_name,
        announcementTitle: announcementTitleText
      });
      setSuccess('Announcement updated successfully!');
      resetForm();
      window.location.reload();
    } catch (err) {
      console.log('Unable to update announcement:', err);
      setLoading(false);
      setError('Failed to update announcement.');
    }
  };

  const handleDelete = async (announcementId) => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (!window.confirm('Are you sure you want to archive this announcement?')) {
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${config.baseApi}/announcements/delete-anc`, {
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

  const HandleArchive = () => {
    setLoading(true);
    navigate('/inactive-announcements');
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

        {/* Header: stacks on mobile, buttons fill the row */}
        {access && (
          <Row className="align-items-center mb-3 g-2">
            <Col xs={12} md={6}>
              <h2 className="mb-0" style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)' }}>
                <b>Announcements</b>
              </h2>
            </Col>
            <Col xs={12} md={6}>
              <div className="d-flex justify-content-md-end gap-2">
                <Button variant="secondary" className="flex-fill flex-md-grow-0" onClick={HandleArchive}>
                  Archive
                </Button>
                <Button variant="primary" className="flex-fill flex-md-grow-0" onClick={HandleAdd}>
                  + Create Post
                </Button>
              </div>
            </Col>
          </Row>
        )}

        <div className="mt-3 mt-md-4">
          {announcementsList.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <Card.Text style={{ fontSize: '1.2rem', fontWeight: '500', textAlign: 'center' }}>NO ANNOUNCEMENTS</Card.Text>
            </div>
          ) : (
            currentAnnouncements.map((item) => (
              <Card key={item.announcements_id} className="mb-3 mb-md-4 shadow-sm" style={{ borderRadius: '15px' }}>
                <Card.Body className="p-3 p-md-4">
                  <div className="d-flex align-items-start justify-content-between mb-3 mb-md-4 gap-2">
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

                    {access && (
                      // position-relative so the dropdown anchors to this icon
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
                            style={{ top: '100%', right: 0, zIndex: 1000, minWidth: '120px' }}
                          >
                            <div
                              className="px-3 py-2 text-dark border-bottom"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleEditClick(item)}
                            >
                              Edit
                            </div>
                            <div
                              className="px-3 py-2 text-danger"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleDelete(item.announcements_id)}
                            >
                              Archive
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Card.Text className="mb-1" style={{ fontSize: 'clamp(1.15rem, 4vw, 1.5rem)', overflowWrap: 'anywhere' }}>
                    <b>{item.announcementTitle}</b>
                  </Card.Text>
                  <Card.Text className="mb-0" style={{ fontSize: '1rem', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
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
      </AnimatedContent>

      {/* Create / Edit form: full-screen on phones, centered modal on larger screens */}
      <Modal show={showCard} onHide={resetForm} centered fullscreen="sm-down">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Announcement' : 'Create Announcement'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="announcementTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={announcementTitleText}
                onChange={(e) => setAnnouncementTitleText(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="announcementText">
              <Form.Label>Announcement</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="What's on your mind?"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="gap-2">
          <Button variant="secondary" onClick={resetForm}>
            Cancel
          </Button>
          <Button variant="primary" onClick={isEditing ? handleUpdate : HandleSave}>
            {isEditing ? 'Update' : 'Post'}
          </Button>
        </Modal.Footer>
      </Modal>

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
