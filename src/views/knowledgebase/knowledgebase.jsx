import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import config from 'config';
import AnimatedContent from 'layouts/ReactBits/AnimatedContent';

import hardwareImg from 'assets/images/hardware.png';
import networkImg from 'assets/images/network.png';
import softwareImg from 'assets/images/software.png';
import systemImg from 'assets/images/system.png';

export default function Knowledgebase() {
  const [allData, setAllData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();

  // Helper: convert HTML string to plain text
  const htmlToPlainText = (html) => {
    if (!html) return '';
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    } catch (err) {
      return html
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }
  };

  const items = [
    {
      title: 'Hardware',
      desc: 'Learn how to troubleshoot and maintain your computer’s physical components and devices.',
      src: hardwareImg,            // was 'src/assets/images/hardware.png'
      link: '/hardware'
    },
    {
      title: 'Network',
      desc: 'Find guides to fix connectivity issues and understand how your network keeps you online.',
      src: networkImg,             // was 'src/assets/images/network.png'
      link: '/network'
    },
    {
      title: 'Application',
      desc: 'Explore tips and solutions for common application errors and application usage.',
      src: softwareImg,            // was 'src/assets/images/software.png'
      link: '/application'
    },
    {
      title: 'System',
      desc: 'Access guides and troubleshooting tips for our in-house applications and tools.',
      src: systemImg,              // was 'src/assets/images/system.png'
      link: '/system'
    }
  ];

  // Fetch API data and map kb_desc HTML -> plain text
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const all = await axios.get(`${config.baseApi}/knowledgebase/all-knowledgebase`);
        if (all.data && Array.isArray(all.data)) {
          const activeData = all.data
            .filter((item) => item.is_active === true)
            .map((item) => ({
              kb_id: item.kb_id,
              kb_title: item.kb_title,
              kb_answer: htmlToPlainText(item.kb_desc || ''),
              kb_category: item.kb_category
            }));
          setAllData(activeData);
        }
      } catch (err) {
        console.log('Unable to retrieve all kb data: ', err);
      }
    };
    fetchdata();
  }, []);

  // Search filter: title, description (plain text), and category
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === '') {
      setFilteredData([]);
      return;
    }

    setFilteredData(
      allData.filter(
        (item) =>
          (item.kb_title && item.kb_title.toLowerCase().includes(term)) ||
          (item.kb_answer && item.kb_answer.toLowerCase().includes(term)) ||
          (item.kb_category && item.kb_category.toLowerCase().includes(term))
      )
    );
  }, [searchTerm, allData]);

  return (
    <div style={{ minHeight: '100dvh', overflowX: 'hidden' }}>
      {/* Top Section */}
      <div
        style={{
          background: 'linear-gradient(to bottom, #ffe798ff, #b8860b)',
          minHeight: '50dvh',
          paddingTop: 'clamp(80px, 14vw, 10vh)',
          paddingBottom: '5vh',
          color: 'white',
          textAlign: 'center',
          position: 'relative'
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
          <Container className="px-3" style={{ maxWidth: '1000px', paddingTop: 'clamp(16px, 6vw, 10vh)' }}>
            <h1 style={{ paddingBottom: '10px', fontSize: 'clamp(1.6rem, 6vw, 2.5rem)' }}>
              <b>Hi. How can we help?</b>
            </h1>

            {/* Search Box + Dropdown */}
            <div style={{ marginTop: '20px', width: '100%', maxWidth: '700px', margin: '20px auto 0', position: 'relative' }}>
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  zIndex: 100
                }}
              >
                <FaSearch style={{ color: '#999', marginRight: '10px', flexShrink: 0 }} />
                <Form.Control
                  type="text"
                  placeholder="Find anything (ex. slow internet, request new mouse)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    fontSize: '1rem', // 16px+ stops iOS zooming into the input
                    flex: 1,
                    minWidth: 0,
                    textOverflow: 'ellipsis'
                  }}
                />
              </div>

              {/* Search Dropdown */}
              {filteredData.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    maxHeight: 'min(300px, 45dvh)',
                    overflowY: 'auto',
                    textAlign: 'left',
                    marginTop: '4px'
                  }}
                >
                  {filteredData.map((item) => (
                    <div
                      key={item.kb_id}
                      style={{
                        padding: '12px 15px',
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        color: '#000',
                        overflowWrap: 'anywhere'
                      }}
                      onClick={() => navigate(`/${item.kb_category || ''}`)}
                    >
                      <div style={{ fontWeight: 700 }}>{item.kb_title}</div>
                      <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '6px' }}>
                        {item.kb_answer.length > 120 ? item.kb_answer.substring(0, 120) + '...' : item.kb_answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Troubleshooting Links */}
            <div
              style={{
                marginTop: '20px',
                fontSize: '0.95rem',
                flexWrap: 'wrap',
                display: 'flex',
                justifyContent: 'center',
                gap: '6px 12px'
              }}
            >
              <span style={{ flexBasis: '100%' }} className="d-sm-inline">
                Common troubleshooting topics:
              </span>
              <a href="/network" style={{ color: '#fff', textDecoration: 'underline' }}>
                Slow internet
              </a>
              <a href="/hardware" style={{ color: '#fff', textDecoration: 'underline' }}>
                Keyboard not working
              </a>
              <a href="/application" style={{ color: '#fff', textDecoration: 'underline' }}>
                Outlook Unable to log in
              </a>
            </div>
          </Container>
        </AnimatedContent>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          backgroundColor: '#003e03ff',
          minHeight: '50dvh',
          paddingTop: '40px',
          paddingBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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
          <Container fluid="lg" className="px-3">
            <Row className="text-center justify-content-center">
              {items.map((item, idx) => (
                <Col key={idx} xs={12} sm={6} lg={3} className="mb-4 d-flex justify-content-center">
                  <Link
                    to={item.link}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      width: '100%',
                      maxWidth: '260px'
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      style={{
                        width: 'clamp(90px, 22vw, 150px)',
                        height: 'auto',
                        cursor: 'pointer'
                      }}
                    />
                    <h4 className="mt-3" style={{ color: '#fff', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', cursor: 'pointer' }}>
                      <b>{item.title}</b>
                    </h4>
                    <p style={{ color: '#fff', maxWidth: '100%', textAlign: 'center', margin: 0 }}>{item.desc}</p>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </AnimatedContent>
      </div>
    </div>
  );
}
