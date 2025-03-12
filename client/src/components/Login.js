import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../context/CartProvider';
import './Login.css';

const Login = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverErrorKey, setServerErrorKey] = useState(''); // Cambiar de mensaje traducido a clave
  const navigate = useNavigate();

  const { setIsLoggedIn } = useContext(CartContext);

  useEffect(() => {
    // Actualizar mensajes de error al cambiar el idioma
    setFieldErrors((prev) => {
      const updatedErrors = {};
      for (const [key, value] of Object.entries(prev)) {
        if (value === 'Please fill in this field') {
          updatedErrors[key] = t('Please fill in this field');
        } else if (value === 'Invalid email format') {
          updatedErrors[key] = t('Invalid email format');
        }
      }
      return updatedErrors;
    });
  }, [i18n.language, t]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'email':
        setEmail(value);
        if (value.trim() && validateEmail(value)) {
          setFieldErrors((prev) => ({ ...prev, email: '' }));
        }
        break;
      case 'password':
        setPassword(value);
        if (value.trim()) {
          setFieldErrors((prev) => ({ ...prev, password: '' }));
        }
        break;
      default:
        break;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setFieldErrors({});
    setServerErrorKey('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const newFieldErrors = {};

    // Validaciones por campo
    if (!trimmedEmail) {
      newFieldErrors.email = t('Please fill in this field');
    } else if (!validateEmail(trimmedEmail)) {
      newFieldErrors.email = t('Invalid email format');
    }

    if (!trimmedPassword) {
      newFieldErrors.password = t('Please fill in this field');
    }

    // Si hay errores, detener el envío
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    // Intentar iniciar sesión si no hay errores
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // Limpieza de errores y configuración exitosa
        setServerErrorKey('');
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('address', data.address);

        // Sincronizar carrito de compras
        const guestCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (guestCart.length > 0) {
          const token = data.token;
          await fetch('http://localhost:5000/api/cart/merge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ guestCart }),
          });
          localStorage.removeItem('cart');
        }

        setIsLoggedIn(true);
        navigate('/profile'); // Redirigir al perfil o página deseada
      } else {
        setServerErrorKey('Invalid email or password'); // Guardar clave en lugar del mensaje
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setServerErrorKey('An error occurred while logging in'); // Guardar clave en lugar del mensaje
    }
  };

  return (
    <Container className="login-container" style={{ marginTop: '50px', maxWidth: '500px' }}>
      <Row className="justify-content-md-center">
        <Col>
          <h1 className="text-center">{t('login-title')}</h1>
          <Form onSubmit={handleLogin} noValidate>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>{t('login-email')}</Form.Label>
              <Form.Control
                type="email"
                placeholder={t('login-email')}
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                required
              />
              {fieldErrors.email && <div style={{ color: 'red' }}>{fieldErrors.email}</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>{t('login-password')}</Form.Label>
              <Form.Control
                type="password"
                placeholder={t('login-password')}
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                required
              />
              {fieldErrors.password && <div style={{ color: 'red' }}>{fieldErrors.password}</div>}
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {t('login-submit')}
            </Button>
          </Form>

          {serverErrorKey && (
            <Alert variant="danger" className="mt-3">
              {t(serverErrorKey)}
            </Alert>
          )}

          <div className="mt-3 text-center">
            <p>
              {t('register-title')}{' '}
              <Link to="/register" className="register-link">
                {t('register-submit')}
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
