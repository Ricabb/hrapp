// src/components/ProjectDashboard.jsx
import React, { useState, useEffect } from 'react';
import './ProjectDashboard.css'; // Import the CSS file for styling

function ProjectDashboard() {
  // State for projects, loading status, and any fetch errors
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/projects')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="project-dashboard">
      <h2>Projects Dashboard</h2>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="project-grid">
          {projects.map(project => (
            <div className="project-card" key={project._id}>
              <h3>{project.name}</h3>
              <p><strong>Schedule:</strong> {project.schedule && project.schedule.join(', ')}</p>
              <p><strong>Daily Hours:</strong> {project.dailyHours}</p>
              <p><strong>Total Weekly Hours:</strong> {project.totalWeeklyHours}</p>
              <div className="project-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => alert(`Viewing project: ${project.name}`)}
                >
                  View Details
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => alert(`Editing project: ${project.name}`)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectDashboard;
