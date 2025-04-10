import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../../context/CartProvider';
import './Register.css';

const Register = () => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [emailExistsError, setEmailExistsError] = useState('');

  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(CartContext);

  // Actualización de mensajes de error al cambiar el idioma
  useEffect(() => {
    setFieldErrors((prev) => {
      const updatedErrors = {};
      for (const [key, value] of Object.entries(prev)) {
        if (value === 'Please fill in this field') {
          updatedErrors[key] = t('Please fill in this field');
        } else if (value === 'Invalid email format') {
          updatedErrors[key] = t('Invalid email format');
        } else if (value === 'Invalid characters') {
          updatedErrors[key] = t('Invalid characters');
        }
      }
      return updatedErrors;
    });

    if (emailExistsError) setEmailExistsError(t('register-email-exists'));
    if (error) setError(t(error));
  }, [i18n.language, t, emailExistsError, error]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateNoSpecialChars = (value) => {
    const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ,.@-]*$/;
    return regex.test(value);
  };

  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'name':
        setName(value);
        if (value.trim() && validateNoSpecialChars(value)) {
          setFieldErrors((prev) => ({ ...prev, name: '' }));
        }
        break;
      case 'email':
        setEmail(value);
        if (value.trim() && validateEmail(value)) {
          setFieldErrors((prev) => ({ ...prev, email: '' }));
        }
        break;
      case 'password':
        setPassword(value);
        if (value.trim() && validateNoSpecialChars(value)) {
          setFieldErrors((prev) => ({ ...prev, password: '' }));
        }
        break;
      case 'address':
        setAddress(value);
        if (value.trim() && validateNoSpecialChars(value)) {
          setFieldErrors((prev) => ({ ...prev, address: '' }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar mensajes previos
    setMessage('');
    setError('');
    setFieldErrors({});
    setEmailExistsError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedAddress = address.trim();

    const newFieldErrors = {};

    // Validación de campos vacíos
    if (!trimmedName) {
      newFieldErrors.name = t('Please fill in this field');
    }
    if (!trimmedEmail) {
      newFieldErrors.email = t('Please fill in this field');
    }
    if (!trimmedPassword) {
      newFieldErrors.password = t('Please fill in this field');
    }
    if (!trimmedAddress) {
      newFieldErrors.address = t('Please fill in this field');
    }

    // Validación de email
    if (trimmedEmail && !validateEmail(trimmedEmail)) {
      newFieldErrors.email = t('Invalid email format');
    }

    // Validación de caracteres especiales
    if (trimmedName && !validateNoSpecialChars(trimmedName)) {
      newFieldErrors.name = t('Invalid characters');
    }
    if (trimmedPassword && !validateNoSpecialChars(trimmedPassword)) {
      newFieldErrors.password = t('Invalid characters');
    }
    if (trimmedAddress && !validateNoSpecialChars(trimmedAddress)) {
      newFieldErrors.address = t('Invalid characters');
    }

    // Si hay errores, actualiza el estado y detén el envío
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    // Enviar los datos al backend si no hay errores
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
          address: trimmedAddress,
        }),
      });

      const data = await response.json();

      // Si el correo ya está registrado
      if (response.status === 400) {
        setEmailExistsError(t('register-email-exists'));
        return;
      }

      // Si la respuesta es correcta, navegar a la página de inicio
      if (response.ok) {
        setMessage(data.message);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', trimmedEmail);
        localStorage.setItem('address', trimmedAddress);

        setIsLoggedIn(true);
        navigate('/');
      } else {
        setError(t('Unknown registration error.'));
      }
    } catch (error) {
      console.error('Error registrando el usuario:', error);
      setError(t('Registration error'));
    }
  };

  return (
    <Container className="register-container" style={{ marginTop: '50px', maxWidth: '500px' }}>
      <Row className="justify-content-md-center">
        <Col>
          <h1 className="text-center">{t('register-submit')}</h1>
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>{t('register-name')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('register-name')}
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                required
              />
              {fieldErrors.name && <div style={{ color: 'red' }}>{fieldErrors.name}</div>}
            </Form.Group>

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

            <Form.Group className="mb-3" controlId="formBasicAddress">
              <Form.Label>{t('register-address')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('register-address')}
                value={address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                required
              />
              {fieldErrors.address && <div style={{ color: 'red' }}>{fieldErrors.address}</div>}
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {t('register-submit')}
            </Button>
          </Form>

          {message && (
            <Alert variant="success" className="mt-3">
              {message}
            </Alert>
          )}

          {emailExistsError && (
            <Alert variant="danger" className="mt-3">
              {emailExistsError}
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
