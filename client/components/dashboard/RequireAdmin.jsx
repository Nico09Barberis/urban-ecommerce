// src/components/RequireAdmin.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RequireAdmin = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || user.role !== 'admin') {
      toast.error('Acceso denegado');
      navigate('/home');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default RequireAdmin;

