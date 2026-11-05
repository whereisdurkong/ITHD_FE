import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import config from 'config';
import { Container, Card, Accordion, Modal, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { PencilSquare, Archive } from 'react-bootstrap-icons';

import Spinner from 'react-bootstrap/Spinner';

export default function Hardware() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [kbID, setKbID] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const contentRef = useRef(null);
  const [faqData, setFaqData] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check user access (runs once)
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    setAccess(userInfo?.emp_tier === 'helpdesk');
  }, []);

  // Auto-hide alerts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch FAQ data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await axios.get(`${config.baseApi}/knowledgebase/all-knowledgebase`);
        if (all.data && Array.isArray(all.data)) {
          setFaqData(
            all.data
              .filter((item) => item.is_active === true && item.kb_category === 'hardware')
              .map((item) => ({
                id: item.kb_id,
                question: item.kb_title,
                answer: item.kb_desc
              }))
          );
        }
      } catch (err) {
        console.error('Error fetching FAQ data:', err);
      }
    };
    fetchData();
  }, []);

  // Pre-fill editor when editing
  useEffect(() => {
    if (showModal && contentRef.current) {
      contentRef.current.innerHTML = newContent;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  // Archive
  const handleArchive = async (id) => {
    try {
      setLoading(true);
      const empInfo = JSON.parse(localStorage.getItem('user'));
      await axios.post(`${config.baseApi}/knowledgebase/archive-knowledgebase`, { kb_id: id, updated_by: empInfo.user_name });

      setSuccess('Hardware troubleshooting step archived successfully');
      window.location.reload();
    } catch (err) {
      console.log('Unable to archive knowledgebase: ', err);
      setLoading(false);
      setError('Failed to archive kb.');
    }
  };

  // Update
  const handleUpdate = async () => {
    if (newTitle === '') {
      setLoading(false);
      setError('Please fill in title.');
    } else if (newContent.replace(/<(.|\n)*?>/g, '').trim() === '') {
      setLoading(false);
      setError('Please fill in description.');
    } else {
      const empInfo = JSON.parse(localStorage.getItem('user'));
      try {
        setLoading(true);
        await axios.post(`${config.baseApi}/knowledgebase/update-knowledgebase`, {
          kb_id: kbID,
          kb_title: newTitle,
          kb_desc: newContent,
          updated_by: empInfo.user_name
        });

        setEditMode(false);
        setSuccess('Hardware updated successfully');
        setNewTitle('');
        setNewContent('');
        setShowModal(false);
        window.location.reload();
      } catch (err) {
        console.log('Unable to update knowledgebase: ', err);
        setLoading(false);
      }
    }
  };

  // Add article
  const handleSave = async () => {
    if (newTitle === '') {
      setLoading(false);
      setError('Please fill in title.');
    } else if (newContent.replace(/<(.|\n)*?>/g, '').trim() === '') {
      setLoading(false);
      setError('Please fill in description.');
    } else {
      const empInfo = JSON.parse(localStorage.getItem('user'));
      try {
        setLoading(true);
        await axios.post(`${config.baseApi}/knowledgebase/add-knowledgebase`, {
          kb_title: newTitle,
          kb_desc: newContent,
          created_by: empInfo.user_name,
          kb_category: 'hardware'
        });
        setSuccess('Hardware saved successfully');
      } catch (err) {
        console.error('Error saving Hardware:', err);
      }

      setFaqData([...faqData, { question: newTitle, answer: newContent }]);
      setNewTitle('');
      setNewContent('');
      setEditMode(false);
      setAddMode(false);
      setShowModal(false);
      window.location.reload();
    }
  };

  // Editor helpers
  const handleContentChange = () => {
    setNewContent(contentRef.current.innerHTML);
  };

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
    contentRef.current.focus();
  };

  const applyLink = () => {
    const url = prompt('Enter the link URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      contentRef.current.focus();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setNewTitle('');
    setNewContent('');
    setAddMode(false);
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  const alertWrapperStyle = {
    top: '80px',
    zIndex: 11000,
    width: 'calc(100% - 24px)',
    maxWidth: '420px'
  };

  return (
    <Container
      fluid
      className="px-2 px-md-5"
      style={{
        background: 'linear-gradient(to bottom, #ffe798ff, #b8860b)',
        minHeight: '100dvh',
        paddingTop: 'clamp(80px, 12vw, 100px)',
        paddingBottom: '20px',
        overflowX: 'hidden'
      }}
    >
      {/* Keeps article HTML from overflowing the screen */}
      <style>{`
        .kb-content { overflow-wrap: anywhere; }
        .kb-content img, .kb-content video, .kb-content iframe { max-width: 100%; height: auto; }
        .kb-content table { display: block; max-width: 100%; overflow-x: auto; }
        .kb-content pre { white-space: pre-wrap; }
      `}</style>

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

      <Container className="px-0 px-md-3">
        <Card className="p-3 p-md-4 shadow-lg" style={{ borderRadius: '20px', backgroundColor: '#fff' }}>
          {/* Header: stacks on phones */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
            <h2 className="fw-bold text-dark mb-0" style={{ fontSize: 'clamp(1.3rem, 5vw, 2rem)' }}>
              Hardware Frequently Asked Questions
            </h2>
            {access && (
              <div className="d-flex gap-2 flex-shrink-0">
                <Button variant="primary" className="flex-fill flex-md-grow-0" onClick={() => navigate('/hardwarearchive')}>
                  Archive
                </Button>
                <Button
                  variant="primary"
                  className="flex-fill flex-md-grow-0"
                  onClick={() => {
                    setShowModal(true);
                    setAddMode(true);
                  }}
                >
                  Add
                </Button>
              </div>
            )}
          </div>

          <hr />

          <Accordion defaultActiveKey={0} flush>
            {faqData.length === 0 ? (
              <div className="text-center text-muted py-3">No hardware articles found</div>
            ) : (
              faqData.map((faq, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                  <Accordion.Header>
                    <span style={{ overflowWrap: 'anywhere' }}>{faq.question}</span>
                  </Accordion.Header>
                  <Accordion.Body className="px-2 px-md-3">
                    {/* Content on top, action buttons underneath on phones; side by side on larger screens */}
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2">
                      <div
                        className="text-muted kb-content w-100"
                        style={{ flex: 1, minWidth: 0 }}
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                      {access && (
                        <div className="d-flex gap-2 flex-shrink-0">
                          {/* EDIT BUTTON */}
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            aria-label="Edit"
                            onClick={() => {
                              setNewTitle(faq.question);
                              setNewContent(faq.answer);
                              setShowModal(true);
                              setEditMode(true);
                              setKbID(faq.id);
                            }}
                          >
                            <PencilSquare />
                          </Button>

                          {/* ARCHIVE BUTTON */}
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            aria-label="Archive"
                            onClick={() => {
                              handleArchive(faq.id);
                              setKbID(faq.id);
                              setShowModal(false);
                              setNewTitle('');
                              setNewContent('');
                              setAddMode(false);
                              setEditMode(false);
                            }}
                          >
                            <Archive />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))
            )}
          </Accordion>
          <hr className="my-4" />
          <p className="text-muted text-center mb-0" style={{ overflowWrap: 'anywhere' }}>
            Have more questions? Email us at <span className="fw-semibold text-primary">venturaadrian999@gmail.com</span>
          </p>
        </Card>
      </Container>

      {/* Modal: full-screen on phones, large centered dialog on bigger screens */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered fullscreen="sm-down">
        <Modal.Header>
          <Modal.Title style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}>
            {editMode ? 'Edit Hardware Troubleshooting Step' : 'Add Hardware Troubleshooting Step'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title question"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Content</Form.Label>

              {/* Toolbar wraps onto multiple lines on narrow screens */}
              <div className="d-flex flex-wrap gap-1 mb-2">
                <Button size="sm" variant="outline-secondary" onClick={() => applyFormat('bold')}>
                  <b>B</b>
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={() => applyFormat('italic')}>
                  <em>I</em>
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={() => applyFormat('underline')}>
                  <u>U</u>
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={() => applyFormat('insertUnorderedList')}>
                  • List
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={() => applyFormat('insertOrderedList')}>
                  1. List
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={applyLink}>
                  🔗 Link
                </Button>
              </div>

              <div
                ref={contentRef}
                contentEditable
                onInput={handleContentChange}
                className="kb-content"
                style={{
                  border: '1px solid #ced4da',
                  borderRadius: '5px',
                  padding: '10px',
                  minHeight: '150px',
                  maxHeight: '50dvh',
                  overflowY: 'auto',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              ></div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={editMode ? handleUpdate : handleSave}>
            {editMode ? 'Update' : 'Save'}
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
            zIndex: 12000
          }}
        >
          <Spinner animation="border" variant="light" />
        </div>
      )}
    </Container>
  );
}
