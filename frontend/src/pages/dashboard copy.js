// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalForm from './mainform'; // Import the ModalForm component
import { Button } from '@mui/material';
function Dashboard() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
    }
  }, [navigate]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {/* Add your dashboard content here */}
      <h2>gowtham</h2>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Payment Request
      </Button>
      <ModalForm open={openModal} handleClose={handleCloseModal} />
    </div>
  );
}

export default Dashboard;
