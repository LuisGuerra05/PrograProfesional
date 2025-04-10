import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, InputGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../../context/CartProvider';
import { toast, ToastContainer } from 'react-toastify'; // Importar react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de react-toastify
import './Login.css';
import { handleOtpChange } from '../../utils/otpUtils'; // Importa la función desde utils


const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [showOtpField, setShowOtpField] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverErrorKey, setServerErrorKey] = useState('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const navigate = useNavigate();

  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  const { setIsLoggedIn } = useContext(CartContext);

  useEffect(() => {
    if (attemptedSubmit) {
      setFieldErrors((prev) => ({
        email: !email.trim() ? t('Please fill in this field') : !validateEmail(email) ? t('Invalid email format') : '',
        password: !password.trim() ? t('Please fill in this field') : '',
      }));
    }
  }, [email, password, attemptedSubmit, t]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFieldChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    setServerErrorKey('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    const newFieldErrors = {};
    if (!trimmedEmail) newFieldErrors.email = t('Please fill in this field');
    else if (!validateEmail(trimmedEmail)) newFieldErrors.email = t('Invalid email format');
    if (!trimmedPassword) newFieldErrors.password = t('Please fill in this field');

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('address', data.address);
        setIsLoggedIn(true);
        navigate('/profile');
      } else if (data.message === 'Se requiere código de autenticación') {
        setShowOtpField(true);
        localStorage.setItem('tempToken', data.tempToken); // 🔑 Guardar token temporal
      } else {
        setServerErrorKey(t('Invalid email or password'));
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setServerErrorKey('An error occurred while logging in');
    }
};

const handleSendOTP = async () => {
    if (otp.join('').length !== 6) {
      return;
    }

    const tempToken = localStorage.getItem('tempToken');
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tempToken}` },
        body: JSON.stringify({ otp: otp.join('') })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.removeItem('tempToken');
        setIsLoggedIn(true);
        navigate('/profile');
      } else {
        setServerErrorKey(t('Incorrect OTP authentication code'));
      }
    } catch (error) {
      console.error('Error al enviar OTP:', error);
      setServerErrorKey('An error occurred while verifying OTP');
    }
};

const handleRecoveryLogin = async () => {
  setRecoveryError('');

  try {
    const response = await fetch('http://localhost:5000/api/auth/recovery-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, recoveryCode }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);

      // Mostrar alerta tipo toast con los códigos restantes
      toast.success(t('Recovery code toast message', { count: data.remainingCodes }), {
        autoClose: 3000, // Duración de 3 segundos
        className: 'custom-toast',
        progressClassName: 'Toastify__progress-bar--blue',
        progressStyle: { backgroundColor: 'rgba(0, 123, 255, 0.85)' }
      });
      
      // Espera 1 segundo y luego navega
      setTimeout(() => {
        navigate('/profile');
      }, 3000);

    } else {
      setRecoveryError(t(data.message || 'Invalid recovery code'));
    }
  } catch (error) {
    console.error('Error al usar código de recuperación:', error);
    setRecoveryError('An error occurred while logging in');
  }
};



  return (
    <>
    <Container className="login-container" style={{ marginTop: '50px', maxWidth: '500px' }}>
      <Row className="justify-content-md-center">
        <Col>
          <h1 className="text-center">{t('login-title')}</h1>
          <Form onSubmit={handleLogin} noValidate>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>{t('login-email')}</Form.Label>
              <Form.Control type="email" placeholder={t('login-email')} value={email} onChange={(e) => handleFieldChange('email', e.target.value)} required />
              {attemptedSubmit && fieldErrors.email && <div style={{ color: 'red' }}>{fieldErrors.email}</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>{t('login-password')}</Form.Label>
              <Form.Control type="password" placeholder={t('login-password')} value={password} onChange={(e) => handleFieldChange('password', e.target.value)} required />
              {attemptedSubmit && fieldErrors.password && <div style={{ color: 'red' }}>{fieldErrors.password}</div>}
            </Form.Group>

            {showOtpField && (
            <Form.Group className="mb-3">
              <Form.Label>{t('Two-Step Authentication (2FA)')}</Form.Label>
              <Row className="justify-content-center">
                <Col xs="auto">
                  <InputGroup className="d-flex justify-content-center">
                    {Array(6).fill('').map((_, index) => (
                      <Form.Control
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={otp[index] || ''}
                        onChange={(e) => handleOtpChange(index, e.target.value, e, otp, setOtp)}
                        onKeyDown={(e) => handleOtpChange(index, '', e, otp, setOtp)}
                        className="otp-box"
                        style={{
                          width: '40px',  
                          height: '35px',  
                          textAlign: 'center',
                          fontSize: '18px',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          margin: '0 2px', 
                        }}
                      />
                    ))}
                  </InputGroup>
                </Col>
              </Row>
              {attemptedSubmit && otp.join('').length < 6 && (
                <div style={{ color: 'red', marginTop: '5px' }}>{t('Enter a 6-digit code')}</div>
              )}
            </Form.Group>
          )}


          {showOtpField ? (
            <Button 
              variant="primary" 
              className="w-100 mt-3" 
              onClick={handleSendOTP} // Llamar a la función que envía el OTP
            >
              {t('login-submit')}
            </Button>
          ) : (
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
            >
              {t('login-submit')}
            </Button>
          )}

          </Form>

          {/* Línea divisoria con "Or" */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
            <span style={{ margin: '0 10px', color: '#666' }}>{t('Or')}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
          </div>

          <Button 
            variant="outline-secondary" 
            size="sm"
            className="w-100 mt-3 d-flex align-items-center justify-content-center" 
            style={{ 
              backgroundColor: '#343a40', 
              color: '#f0f0f0', 
              border: '1px solid #444', 
              ppadding: '10px 12px', 
              fontSize: '14px',
              transition: 'background-color 0.3s, color 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#495057';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#343a40';
              e.target.style.color = '#f0f0f0';
            }}
            onClick={() => setShowRecoveryModal(true)}
        >
            <i className="bi bi-person-fill-lock" style={{ marginRight: '8px' }}></i>
            {t('Use recovery code')}
        </Button>

          <div className="mt-3 text-center">
            <p>
              {t('register-title')}{' '}
              <Link to="/register">{t('register-submit')}</Link>
            </p>
          </div>

          {serverErrorKey && <Alert variant="danger" className="mt-3">{serverErrorKey}</Alert>}
        </Col>
      </Row>
    </Container>
    <Modal show={showRecoveryModal} onHide={() => setShowRecoveryModal(false)} centered>
      <Modal.Header closeButton>
      <Modal.Title>
        <i className="bi bi-key" style={{ marginRight: '8px' }}></i>
        {t('Recovery code')}
      </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>{t('login-email')}</Form.Label>
          <Form.Control 
            type="email"
            placeholder={t('login-email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>{t('Recovery code')}</Form.Label>
          <Form.Control 
            type="text"
            placeholder={t('Recovery code')}
            value={recoveryCode}
            onChange={(e) => setRecoveryCode(e.target.value)}
          />
        </Form.Group>
        
        {recoveryError && <Alert variant="danger">{recoveryError}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowRecoveryModal(false)}>
          {t('Cancel')}
        </Button>
        <Button className="custom-blue-btn" onClick={handleRecoveryLogin}>
          {t('Verify')}
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Contenedor de Toast */}
    <ToastContainer />
    </>
  );
};

export default Login;
