import React, { useState, useEffect } from 'react';

function SlidingModal({ children, onClose }) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setSlideIn(true), 50);
  }, []);

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: slideIn ? 'translate(-50%, -50%)' : 'translate(-50%, 150vh)',
    transition: 'transform 0.5s ease-out',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 1001,
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  };

  const handleClose = () => {
    setSlideIn(false);
    setTimeout(() => onClose(), 500);
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={handleClose} style={{ marginTop: '10px' }}>Close</button>
      </div>
    </div>
  );
}

export default SlidingModal;
