export const handleOtpChange = (index, value, event, otp, setOtp) => {
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
    
        // Nuevo: Si se presiona "Enter" en el último campo, presionar el botón de login
        if (event.key === 'Enter' && index === 5) {
            event.preventDefault(); // Evita que el último número se borre
            document.getElementById("login-button")?.click(); // Simula el clic en el botón de login
        }
    };
    
    
