import React, { useState } from 'react';

function VacationRequestForm({ userId, projectId, onRequestSuccess }) {
  const [requestedHours, setRequestedHours] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/vacation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, projectId, requestedHours: Number(requestedHours) })
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
      } else {
        const data = await response.json();
        alert('Vacation request submitted successfully!');
        onRequestSuccess(data);
      }
    } catch (error) {
      console.error('Error submitting vacation request:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Request Vacation Time</h3>
      <label>
        Hours:
        <input
          type="number"
          value={requestedHours}
          onChange={(e) => setRequestedHours(e.target.value)}
          min="1"
          required
        />
      </label>
      <button type="submit">Submit Request</button>
    </form>
  );
}

export default VacationRequestForm;
