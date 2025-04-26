import React, { useContext, useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Alert, Image, InputGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartProvider';
import { useTranslation } from 'react-i18next';
import { handleOtpChange } from '../../utils/otpUtils'; // Importa la función reutilizable
import { API_URL } from '../../utils/config';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clearCart, setIsLoggedIn } = useContext(CartContext);

  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState(localStorage.getItem('address') || '');
  const [message, setMessage] = useState('');
  const [fieldErrorKey, setFieldErrorKey] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [tempSecret, setTempSecret] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [backupCodes, setBackupCodes] = useState([]);
  const [showCodesModal, setShowCodesModal] = useState(false);

  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const address = localStorage.getItem('address');


  useEffect(() => {
    // Verificar si el usuario tiene 2FA activo y actualizar la información del perfil
    const check2FAStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await response.json();
        if (response.ok) {
          setIs2FAEnabled(!!data.two_factor_secret);
          
          // Actualizar la información en localStorage para mostrarla en el perfil
          if (data.username) localStorage.setItem('username', data.username);
          if (data.email) localStorage.setItem('email', data.email);
          if (data.address) localStorage.setItem('address', data.address);
        }
      } catch (error) {
        console.error('Error verificando 2FA:', error);
      }
    };
  
    check2FAStatus();
  }, []);
  

  const validateNoSpecialChars = (value) => {
    const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ,.@-]*$/;
    return regex.test(value);
  };

  const handleLogout = () => {
    localStorage.clear();
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
      const response = await fetch(`${API_URL}/api/auth/update-address`, {
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

  const handleEnable2FA = async () => {
    setMessage('');
    setQrCode('');
    setTempSecret('');

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/auth/generate-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setQrCode(data.qrCode);
        setTempSecret(data.tempSecret);
      } else {
        setMessage('Error generando 2FA: ' + data.message);
      }
    } catch (error) {
      console.error('Error generando 2FA:', error);
      setMessage('Error al conectar con el servidor.');
    }
  };

  const handleConfirm2FA = async () => {
    if (otp.join('').length !== 6) {
      return;
    }
  
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/auth/confirm-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: otp.join(''), tempSecret }),
      });
  
      const data = await response.json();
      console.log("Respuesta recibida del backend:", data);
  
      if (response.ok) {
        setIs2FAEnabled(true);
        setQrCode('');
        setTempSecret('');
        setOtp(Array(6).fill(''));
        setBackupCodes(data.backupCodes); // Aquí es donde deberías recibir los códigos desencriptados
        setShowCodesModal(true);
        setMessage(t('2FA enabled successfully'));
  
        setTimeout(() => {
          setMessage('');
        }, 3000);
  
      } else {
        setMessage(t('Incorrect OTP authentication code'));
      }
    } catch (error) {
      console.error('Error confirmando 2FA:', error);
      setMessage('Error al conectar con el servidor.');
    }
  };
  

  const handleDisable2FA = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/auth/disable-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setQrCode('');
        setIs2FAEnabled(false);
        setMessage(t('2FA disabled successfully'));
        
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error desactivando 2FA:', error);
      setMessage('Error al conectar con el servidor.');
    }
  };

  const handleDownload = () => {
    const content = backupCodes.map((code, index) => `${code}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EK_Recovery_Codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
  };

  
  const handleGenerateCodes = async () => {
    try {
        const response = await fetch(`${API_URL}/api/auth/generate-recovery-codes`, {  // Aquí asegúrate que está bien configurado el prefijo
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setBackupCodes(data.codes);  // Aquí se actualizan los códigos en tu frontend
            setShowCodesModal(true); // Muestra el modal con los nuevos códigos
        } else {
            alert('Failed to generate recovery codes.');
        }
    } catch (error) {
        console.error('Error generating codes:', error);
    }
};



  return (
    <>
    <Container style={{ marginTop: '50px' }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="mb-4">{t('profile-title')}</h1>
              <p><strong>{t('profile-username')}:</strong> {username || t('Usuario')}</p>
              <p><strong>{t('profile-email')}:</strong> {email || t('Correo no disponible')}</p>
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

              
              {/* 🔒 Autenticación de Dos Factores */}
              <div className="p-3 mb-3 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-start">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-phone" style={{ fontSize: '18px', marginRight: '8px' }}></i>
                    <strong style={{ marginRight: '8px' }}>{t('Authenticator app')}</strong>
                  </div>
                  
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <span
                      style={{
                        padding: '1px 5px',
                        backgroundColor: 'white',
                        border: `1px solid ${is2FAEnabled ? '#28a745' : 'red'}`,
                        borderRadius: '10px',
                        color: is2FAEnabled ? '#28a745' : 'red',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      {is2FAEnabled ? t('Configured') : t('Not Configured')}
                    </span>

                    <Button
                      variant={is2FAEnabled ? "outline-danger" : "secondary"}
                      onClick={is2FAEnabled ? handleDisable2FA : handleEnable2FA}
                      style={{ padding: '6px 12px', fontSize: '14px' }}
                    >
                      {is2FAEnabled ? t('Disable') : t('Enable')}
                    </Button>
                  </div>
                </div>

                <p style={{ color: '#666', fontSize: '13px', marginTop: '8px', marginBottom: '0' }}>
                  {t('Use an authentication app to get two-factor authentication codes when prompted.')}
                </p>
              </div>



            {qrCode && (
              <div className="mt-3">
                <p style={{ fontSize: '16px' }}>1. {t('open-authenticator-app')}</p>
                <p style={{ fontSize: '16px' }}>2. {t('scan-qr-code')}</p>
                <div className="text-center">
                  <Image src={qrCode} alt="Código QR para 2FA" />
                </div>

                <p style={{ fontSize: '16px' }} className="mt-3">3. {t('enter-six-digit-code')}</p>
                
                {/* Cuadros OTP alineados al centro */}
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
                            height: '40px',  
                            textAlign: 'center',
                            fontSize: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            margin: '0 4px', 
                          }}
                        />
                      ))}
                    </InputGroup>
                  </Col>
                </Row>

                {/* Mensajes de error (idénticos al Login) */}
                {otp.join('').length < 6 && (
                  <div style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>
                    {t('Enter a 6-digit code')}
                  </div>
                )}

                {/* Contenedor para los botones alineados a la derecha */}
                <div className="d-flex justify-content-end mt-3">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => {
                      setQrCode('');
                      setOtp(Array(6).fill(''));
                      setMessage('');
                    }}
                  >
                    {t('profile-cancel')}
                  </Button>

                  <Button 
                    variant="primary" 
                    size="sm" 
                    id="confirm-2fa-button"
                    onClick={handleConfirm2FA}
                  >
                    {t('Enable')}
                  </Button>
                </div>
              </div>
            )}

            {/* Códigos de Recuperación */}
            <div 
              className="p-3 mt-3 rounded"
              style={{
                border: '1px solid #ddd',
                backgroundColor: '#f8f9fa',
                position: 'relative'
              }}
            >
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-key" style={{ marginRight: '8px', fontSize: '20px' }}></i>
                  <strong>{t('Recovery codes')}</strong>
                </div>

                {is2FAEnabled && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleGenerateCodes}
                    className="mb-2"
                    style={{ whiteSpace: 'nowrap' }} // 👈 Esto evita el salto de línea
                  >
                    {t('Generate new codes')}
                  </Button>
                )}
              </div>

              <div style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
                {is2FAEnabled ? (
                  <p>{t('Use these recovery codes to log in if you lose access to your authentication app')}</p>
                ) : (
                  <p style={{ color: 'red' }}>{t('Two-Factor Authentication is not enabled. No recovery codes available')}</p>
                )}
              </div>
            </div>


            
            {message && (
              <Alert 
                variant={message === t('Incorrect OTP authentication code') ? "danger" : "success"} 
                className="mt-3"
              >
                {t(message)}
              </Alert>
            )}

              <Button 
                className="btn btn-primary w-100 mt-3" 
                onClick={handleLogout}
              >
                {t('profile-logout')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    {/* Modal para mostrar los códigos de respaldo */}
    <Modal show={showCodesModal} backdrop="static" keyboard={false} size="lg" centered>
        <Modal.Header>
          <Modal.Title>{t('Save your recovery codes')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: '460px' }}>
          <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', textAlign: 'center' }}>
              {backupCodes.map((code, index) => (
                <div 
                  key={index} 
                  style={{ 
                    backgroundColor: '#fff', 
                    padding: '8px', 
                    borderRadius: '5px', 
                    border: '1px solid #ddd', 
                    fontFamily: 'monospace', 
                    fontSize: '15px'
                  }}
                >
                  • {code}
                </div>
              ))}
            </div>
          </div>
          
          {/* Explicación y Botón de Descarga */}
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#eef3f7', borderRadius: '5px' }}>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleDownload} 
              style={{ marginRight: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <i className="bi bi-download"></i> {t('Download')}
            </Button>
            <p style={{ marginTop: '14px', margin: '0 0 10px', fontSize: '13px', color: '#333' }}>
              {t('Why is saving your recovery codes important?')}<br/>
              {t('If you lose access to your phone, you can authenticate using your recovery codes. We recommend saving them with a secure password manager.')}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={() => setShowCodesModal(false)} 
            style={{ 
              fontWeight: 'bold', 
              padding: '8px 16px',
              fontSize: '14px'
            }}
          >
            {t('I have saved my recovery codes')}
          </Button>
        </Modal.Footer>
    </Modal>
    </>
  );
};

export default Profile;