import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../context/CartProvider';
import './Login.css';

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

const handleOtpChange = (index, value, event) => {
    if (!/^\d?$/.test(value)) return; // Solo permitir un dígito numérico

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Si se ingresa un número, pasar al siguiente campo
    if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
    }

    // Si se presiona "Backspace" y el campo está vacío, moverse al anterior
    if (!value && event.key === 'Backspace' && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
    }

    // 🚀 **Nuevo: Si se presiona "Enter" en el último campo, presionar el botón de login**
    if (event.key === 'Enter' && index === 5) {
        event.preventDefault(); // Evita que el último número se borre
        document.getElementById("login-button")?.click(); // Simula el clic en el botón de login
    }
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

    // Si el campo OTP es requerido pero no tiene 6 dígitos, mostrar mensaje y no enviar solicitud
    if (showOtpField && otp.join('').length !== 6) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword, otp: showOtpField ? otp.join('') : undefined }),
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
        setServerErrorKey('');
      } else if (data.message === 'Código de autenticación incorrecto') {
        setServerErrorKey(t('Incorrect OTP authentication code'));
      } else if (!showOtpField) {
        setServerErrorKey(t('Invalid email or password'));
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setServerErrorKey('An error occurred while logging in');
    }
  };

  return (
    <Container className="login-container" style={{ marginTop: '50px', maxWidth: '500px' }}>
      <Row className="justify-content-md-center">
        <Col>
          <h1 className="text-center">{t('login-title')}</h1>
          <Form onSubmit={handleLogin} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>{t('login-email')}</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => handleFieldChange('email', e.target.value)} required />
              {attemptedSubmit && fieldErrors.email && <div style={{ color: 'red' }}>{fieldErrors.email}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('login-password')}</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => handleFieldChange('password', e.target.value)} required />
              {attemptedSubmit && fieldErrors.password && <div style={{ color: 'red' }}>{fieldErrors.password}</div>}
            </Form.Group>

            {showOtpField && (
              <Form.Group className="mb-3">
                <Form.Label>{t("Authentication Code (OTP)")}</Form.Label>
                <InputGroup className="d-flex justify-content-center">
                  {Array(6).fill('').map((_, index) => (
                    <Form.Control
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={otp[index] || ''}
                      onChange={(e) => handleOtpChange(index, e.target.value, e)}
                      onKeyDown={(e) => handleOtpChange(index, '', e)}
                      className="otp-box"
                      style={{
                        width: '40px',
                        height: '40px',
                        textAlign: 'center',
                        fontSize: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        marginRight: '5px',
                      }}
                    />
                  ))}
                </InputGroup>
                {attemptedSubmit && otp.join('').length < 6 && <div style={{ color: 'red', marginTop: '5px' }}>{t('Enter a 6-digit code')}</div>}
              </Form.Group>
            )}

            <Button variant="primary" type="submit" className="w-100">
              {t('login-submit')}
            </Button>
          </Form>

          {serverErrorKey && <Alert variant="danger" className="mt-3">{serverErrorKey}</Alert>}

          <div className="mt-3 text-center">
            <p>
              {t('register-title')}{' '}
              <Link to="/register">{t('register-submit')}</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
