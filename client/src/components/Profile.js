import React, { useContext, useState } from 'react';
import { Button, Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartProvider';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clearCart, setIsLoggedIn } = useContext(CartContext);

  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState(localStorage.getItem('address') || '');
  const [message, setMessage] = useState('');
  const [fieldErrorKey, setFieldErrorKey] = useState('');

  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const address = localStorage.getItem('address');

  const validateNoSpecialChars = (value) => {
    const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ,.@-]*$/;
    return regex.test(value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('address');
    localStorage.removeItem('cart');
    clearCart(false);
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleSaveAddress = async () => {
    setFieldErrorKey('');
    setMessage('');

    if (!newAddress || newAddress.trim() === '') {
      setFieldErrorKey('Address is required');
      return;
    }

    if (!validateNoSpecialChars(newAddress)) {
      setFieldErrorKey('Invalid characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/update-address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: newAddress }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('address', newAddress);
        setMessage('Address updated successfully');
        setIsEditing(false);

        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setFieldErrorKey(data.message || 'Error updating the address');
      }
    } catch (error) {
      setFieldErrorKey('Error updating the address');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFieldErrorKey('');
    setMessage('');
    setNewAddress(localStorage.getItem('address') || '');
  };

  return (
    <Container style={{ marginTop: '50px' }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="mb-4">{t('profile-title')}</h1>
              <p>
                <strong>{t('profile-username')}:</strong> {username ? username : t('default-username')}
              </p>
              <p>
                <strong>{t('profile-email')}:</strong> {email ? email : t('default-email')}
              </p>
              <p>
                <strong>{t('profile-address')}:</strong>
                {isEditing ? (
                  <>
                    <Form.Control
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      style={{ display: 'inline', width: 'auto', marginRight: '10px' }}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      style={{ marginRight: '10px' }}
                      onClick={handleSaveAddress}
                    >
                      {t('profile-save')}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                      {t('profile-cancel')}
                    </Button>
                    {fieldErrorKey && (
                      <div style={{ color: 'red', marginTop: '5px' }}>
                        {t(fieldErrorKey)}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {address ? address : t('default-address')}
                    <Button
                      variant="secondary"
                      size="sm"
                      style={{ marginLeft: '10px' }}
                      onClick={() => setIsEditing(true)}
                    >
                      {t('profile-edit')}
                    </Button>
                  </>
                )}
              </p>
              {message && <Alert variant="success">{t(message)}</Alert>}
              <Button className="custom-blue-btn" onClick={handleLogout}>
                {t('profile-logout')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
