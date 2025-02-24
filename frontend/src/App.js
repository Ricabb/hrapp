// src/App.js
import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import VacationBarGraph from './components/VacationBarGraph';

// ---------------------- Helper Functions ----------------------
function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateWithoutTimezone(dateString) {
  return dateString.split("T")[0];
}

function normalizeDayName(dayName) {
  return dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();
}

function getWorkingHoursColor(available) {
  if (available <= 0) return '#fff';
  if (available >= 1 && available <= 3) return '#c6ecc6';
  if (available >= 4 && available <= 6) return '#90ee90';
  return '#2e8b57';
}

// ---------------------- Login Component ----------------------
function Login({ onLogin, user }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      alert("Error during Google sign-in. Check console for details.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogin(null);
    } catch (error) {
      console.error("Error during sign-out:", error);
      alert("Error during sign-out. Check console for details.");
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {user ? (
        <>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
}

// ---------------------- SlidingModal Component ----------------------
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

// ---------------------- CustomModal Component ----------------------
function CustomModal({ message, visible, onClose }) {
  if (!visible) return null;
  const overlayStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };
  const modalStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "80%",
    maxHeight: "80%",
    overflowY: "auto",
    userSelect: "text"
  };
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <pre>{message}</pre>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// ---------------------- FullScreenCalendar Component ----------------------
function FullScreenCalendar({ onClose, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 50);
  }, []);

  const handleCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();

  let weeks = [];
  let currentWeek = [];
  for (let i = 0; i < startDay; i++) {
    currentWeek.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(new Date(year, month, day));
    if (currentWeek.length === 7 || day === daysInMonth) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    zIndex: 2000,
    transform: animateIn ? "scale(1)" : "scale(0.8)",
    opacity: animateIn ? 1 : 0,
    transition: "transform 0.5s ease, opacity 0.5s ease",
    overflow: "hidden",
  };

  const headerStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#333",
    fontFamily: "'Patrick Hand', cursive, sans-serif",
    textAlign: "center",
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "1.2rem",
    margin: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "2px dashed #333",
    backgroundColor: "transparent",
    fontFamily: "'Patrick Hand', cursive, sans-serif",
    color: "#333",
  };

  const gridContainerStyle = {
    flexGrow: 1,
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridGap: "2px",
    width: "100%",
    padding: "0 10px",
  };

  const dayHeaderStyle = {
    borderBottom: "2px dashed #333",
    padding: "10px",
    textAlign: "center",
    fontFamily: "'Patrick Hand', cursive, sans-serif",
    fontSize: "1.2rem",
    color: "#333",
  };

  const dayStyle = {
    border: "2px dashed #333",
    padding: "10px",
    textAlign: "center",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "'Patrick Hand', cursive, sans-serif",
    background: "#fff",
    flexGrow: 1,
  };

  const emptyDayStyle = { padding: "10px" };
  const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        {currentDate.toLocaleString("default", { month: "long" })} {year}
      </div>
      <div style={{ textAlign: "center" }}>
        <button style={buttonStyle} onClick={handleCurrentMonth}>Current Month</button>
        <button style={buttonStyle} onClick={onClose}>Close Calendar</button>
      </div>
      <div style={gridContainerStyle}>
        {weekDayNames.map((name, index) => (
          <div key={index} style={dayHeaderStyle}>{name}</div>
        ))}
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) =>
            day ? (
              <div
                key={day.toISOString()}
                style={dayStyle}
                onClick={() => onDateSelect && onDateSelect(day)}
              >
                {day.getDate()}
              </div>
            ) : (
              <div key={weekIndex + "-" + dayIndex} style={emptyDayStyle}></div>
            )
          )
        )}
      </div>
    </div>
  );
}

// ---------------------- ProjectDashboard Component ----------------------
function ProjectDashboard({ projects, vacationRequests, onProjectDeleted, onVacationAdded, onEditProject }) {
  const [openCalendars, setOpenCalendars] = useState([]);

  const toggleCalendar = (projectId) => {
    setOpenCalendars(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await fetch(`http://localhost:5000/projects/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errData = await response.json();
        alert("Error deleting project: " + errData.error);
      } else {
        alert("Project deleted successfully");
        onProjectDeleted();
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div>
      <h2>Projects Dashboard</h2>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map(project => {
          const totalWorkingHours = Object.values(project.schedule || {}).reduce((sum, arr) => sum + arr.length, 0);
          const projectVacations = vacationRequests.filter(
            vr => vr.date && (vr.projectId === project._id || vr.projectId === project.id)
          );
          return (
            <div key={project._id} style={{ border: '1px solid #aaa', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
              <h3>{project.name}</h3>
              {project.fake ? (
                <p>This is a cumulative view of all projects. Vacation requests made here will be assigned based on the schedule mapping.</p>
              ) : (
                <>
                  <button onClick={() => onEditProject(project)} style={{ marginRight: '10px' }}>Edit</button>
                  <button onClick={() => handleDelete(project._id)}>Delete Project</button>
                </>
              )}
              <div style={{ marginTop: '15px' }}>
                <h4>Vacation Requests for this Project</h4>
                {projectVacations.length === 0 ? (
                  <p>No vacation requests for this project.</p>
                ) : (
                  <ul>
                    {projectVacations.map((vr) => (
                      <VacationRequestRow key={vr._id} vr={vr} onVacationUpdated={onVacationAdded} />
                    ))}
                  </ul>
                )}
                {!project.fake && <VacationRequestForm projectId={project._id} onVacationAdded={onVacationAdded} />}
              </div>
              {project.fake || openCalendars.includes(project._id) ? (
                <>
                  <div style={{ marginTop: '20px' }}>
                    <h4>{project.fake ? "Cumulative Project Calendar" : "Project Calendar"}</h4>
                    <ProjectCalendar
                      project={project}
                      vacationRequests={project.fake ? vacationRequests : vacationRequests.filter(
                        vr => vr.projectId === project._id || vr.projectId === project.id
                      )}
                      onVacationRequested={onVacationAdded}
                    />
                  </div>
                  <div style={{ marginTop: '30px' }}>
                    <h2>{project.fake ? "Cumulative Vacation Bar Graph" : `Vacation Bar Graph for ${project.name}`}</h2>
                    <VacationBarGraph
                      project={project}
                      vacationRequests={project.fake ? vacationRequests : vacationRequests.filter(
                        vr => vr.projectId === project._id || vr.projectId === project.id
                      )}
                    />
                  </div>
                </>
              ) : (
                <button
                  onClick={() => toggleCalendar(project._id)}
                  style={{ marginLeft: '10px', padding: '8px 12px', cursor: 'pointer' }}
                >
                  Show Calendar
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ---------------------- ProjectStats Component ----------------------
function ProjectStats({ projects, vacationRequests }) {
  const stats = projects.map((project) => {
    const weeklyWorkingHours = Object.values(project.schedule || {}).reduce((sum, arr) => sum + arr.length, 0);
    const workingHoursPerYear = weeklyWorkingHours * 52;
    const maxVacationAllowed = weeklyWorkingHours * 2;
    const projectRequests = vacationRequests.filter(
      (vr) => vr.date && (vr.projectId === project._id || vr.projectId === project.id)
    );
    const approvedHours = projectRequests
      .filter((vr) => vr.status === 'approved')
      .reduce((sum, vr) => sum + vr.requestedHours, 0);
    const pendingHours = projectRequests
      .filter((vr) => vr.status === 'pending')
      .reduce((sum, vr) => sum + vr.requestedHours, 0);
    const rejectedHours = projectRequests
      .filter((vr) => vr.status === 'rejected')
      .reduce((sum, vr) => sum + vr.requestedHours, 0);
    const cancelledHours = projectRequests
      .filter((vr) => vr.status === 'cancelled')
      .reduce((sum, vr) => sum + vr.requestedHours, 0);
    const ratio = approvedHours > 0 ? (workingHoursPerYear / approvedHours).toFixed(2) : 'N/A';
    const remainingVacationAllowance = Math.max(maxVacationAllowed - approvedHours, 0);

    return {
      id: project._id,
      name: project.name,
      weeklyWorkingHours,
      workingHoursPerYear,
      maxVacationAllowed,
      approvedHours,
      pendingHours,
      rejectedHours,
      cancelledHours,
      remainingVacationAllowance,
      ratio,
    };
  });

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Project Statistics</h2>
      {stats.length === 0 ? (
        <p>No stats available.</p>
      ) : (
        <div>
          {stats.map((s) => (
            <div key={s.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
              <h3>{s.name}</h3>
              <ul>
                <li><strong>Weekly Working Hours:</strong> {s.weeklyWorkingHours}</li>
                <li><strong>Working Hours Per Year:</strong> {s.workingHoursPerYear}</li>
                <li><strong>Max Vacation Allowed Per Year:</strong> {s.maxVacationAllowed}</li>
                <li><strong>Approved Vacation Hours:</strong> {s.approvedHours}</li>
                <li><strong>Pending Vacation Hours:</strong> {s.pendingHours}</li>
                <li><strong>Rejected Vacation Hours:</strong> {s.rejectedHours}</li>
                <li><strong>Cancelled Vacation Hours:</strong> {s.cancelledHours}</li>
                <li><strong>Remaining Vacation Allowance:</strong> {s.remainingVacationAllowance}</li>
                <li><strong>Ratio (Working Hours per Approved Vacation Hour):</strong> {s.ratio}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------- ProjectForm Component ----------------------
function ProjectForm({ projects, editingProject, onProjectSaved }) {
  const [projectName, setProjectName] = useState('');
  const [schedule, setSchedule] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });

  // Updated validation: skip both the project being edited and any cumulative (fake) project.
  const validateSchedule = (newSchedule, projects, editingProjectId) => {
    for (let day in newSchedule) {
      const newHours = newSchedule[day];
      for (let proj of projects) {
        if (proj.fake) continue; // Ignore cumulative project
        if (editingProjectId && proj._id === editingProjectId) continue;
        if (proj.schedule && proj.schedule[day]) {
          for (let hour of newHours) {
            if (proj.schedule[day].includes(hour)) {
              return `Conflict on ${day} at ${hour}:00 with project "${proj.name}"`;
            }
          }
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (editingProject) {
      setProjectName(editingProject.name || '');
      setSchedule(editingProject.schedule || {
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
      });
    } else {
      setProjectName('');
      setSchedule({
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
      });
    }
  }, [editingProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const conflict = validateSchedule(schedule, projects, editingProject ? editingProject._id : null);
    if (conflict) {
      alert("Schedule conflict: " + conflict);
      return;
    }
    const payload = { name: projectName, schedule };
    try {
      let response;
      if (editingProject) {
        response = await fetch(`http://localhost:5000/projects/${editingProject._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('http://localhost:5000/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (!response.ok) {
        const errData = await response.json();
        alert('Error saving project: ' + errData.error);
        return;
      }
      await response.json();
      onProjectSaved(
        editingProject 
          ? `Project "${projectName}" updated successfully!\nSchedule:\n${JSON.stringify(schedule, null, 2)}`
          : `Project "${projectName}" added successfully!\nSchedule:\n${JSON.stringify(schedule, null, 2)}`
      );
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Project Name:&nbsp;
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>Select Working Schedule:</label>
          <ScheduleGrid schedule={schedule} setSchedule={setSchedule} />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          {editingProject ? 'Save Changes' : 'Add Project'}
        </button>
      </form>
    </div>
  );
}

// ---------------------- ScheduleGrid Component ----------------------
function ScheduleGrid({ schedule, setSchedule }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  const toggleHour = (day, hour) => {
    setSchedule(prev => {
      const currentHours = prev[day] || [];
      let newHours;
      if (currentHours.includes(hour)) {
        newHours = currentHours.filter(h => h !== hour);
      } else {
        newHours = [...currentHours, hour].sort((a, b) => a - b);
      }
      return { ...prev, [day]: newHours };
    });
  };

  return (
    <table style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: '5px' }}>Hour</th>
          {days.map(day => (
            <th key={day} style={{ border: '1px solid #ccc', padding: '5px' }}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hours.map(hour => (
          <tr key={hour}>
            <td style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'center' }}>{hour}:00</td>
            {days.map(day => {
              const isSelected = schedule[day].includes(hour);
              return (
                <td
                  key={day}
                  style={{
                    border: '1px solid #ccc',
                    padding: '5px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#90ee90' : '#fff'
                  }}
                  onClick={() => toggleHour(day, hour)}
                >
                  {isSelected ? '✓' : ''}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---------------------- VacationRequestRow Component ----------------------
function VacationRequestRow({ vr, onVacationUpdated }) {
  const [selectedApprover, setSelectedApprover] = useState("Rita");

  const handleCancel = async () => {
    try {
      const response = await fetch(`http://localhost:5000/vacation-requests/${vr._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (!response.ok) {
        const errData = await response.json();
        alert("Error cancelling vacation: " + errData.error);
      } else {
        alert("Vacation cancelled.");
        onVacationUpdated();
      }
    } catch (err) {
      console.error("Error cancelling vacation:", err);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:5000/vacation-requests/${vr._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', approverName: selectedApprover })
      });
      if (!response.ok) {
        const errData = await response.json();
        alert("Error approving vacation: " + errData.error);
      } else {
        alert("Vacation approved.");
        onVacationUpdated();
      }
    } catch (err) {
      console.error("Error approving vacation:", err);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:5000/vacation-requests/${vr._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (!response.ok) {
        const errData = await response.json();
        alert("Error rejecting vacation: " + errData.error);
      } else {
        alert("Vacation rejected.");
        onVacationUpdated();
      }
    } catch (err) {
      console.error("Error rejecting vacation:", err);
    }
  };

  return (
    <li>
      Date: {formatDateWithoutTimezone(vr.date)} — Requested Hours: {vr.requestedHours} — Status: {vr.status}
      <div style={{ marginTop: '5px' }}>
        {vr.status === 'pending' && (
          <>
            <select value={selectedApprover} onChange={(e) => setSelectedApprover(e.target.value)}>
              <option value="Rita">Rita</option>
              <option value="Richard">Richard</option>
              <option value="Simon">Simon</option>
              <option value="Sandra">Sandra</option>
              <option value="Dina">Dina</option>
              <option value="Joseph">Joseph</option>
            </select>
            <button onClick={handleApprove} style={{ marginLeft: '5px' }}>Approve</button>
            <button onClick={handleReject} style={{ marginLeft: '5px' }}>Reject</button>
          </>
        )}
        {(vr.status === 'pending' || vr.status === 'approved') && (
          <button onClick={handleCancel} style={{ marginLeft: '5px' }}>Cancel</button>
        )}
      </div>
    </li>
  );
}

// ---------------------- VacationRequestForm Component ----------------------
function VacationRequestForm({ projectId, onVacationAdded }) {
  const [requestedHours, setRequestedHours] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestedHours || !date) return;
    const payload = { userId: "USER_ID_EXAMPLE", projectId, requestedHours: Number(requestedHours), date };
    try {
      const response = await fetch('http://localhost:5000/vacation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errData = await response.json();
        alert("Error adding vacation request: " + errData.error);
        return;
      }
      await response.json();
      onVacationAdded();
      setRequestedHours('');
      setDate('');
    } catch (err) {
      console.error("Error adding vacation request:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
      <div>
        <label>
          Date:&nbsp;
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Vacation Hours:&nbsp;
          <input
            type="number"
            value={requestedHours}
            onChange={(e) => setRequestedHours(e.target.value)}
            required
            style={{ marginLeft: '5px', width: '60px' }}
          />
        </label>
      </div>
      <button type="submit" style={{ marginTop: '5px' }}>Submit Request</button>
    </form>
  );
}

// ---------------------- ProjectCalendar Component ----------------------
function ProjectCalendar({ project, vacationRequests, onVacationRequested }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [debugData, setDebugData] = useState(null);
  const [calendarLogs, setCalendarLogs] = useState([]);
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
  const totalCells = 42; // 42 cells for a 6-week layout.

  const addLog = (msg) => {
    setCalendarLogs(prev => [...prev, msg]);
  };

  const getWorkingHoursCount = (date) => {
    const dayName = normalizeDayName(date.toLocaleDateString("en-US", { weekday: "long" }));
    return project.schedule && project.schedule[dayName] ? project.schedule[dayName].length : 0;
  };

  const getApprovedVacationHours = (date) => {
    const cellDateStr = formatDateLocal(date);
    return vacationRequests
      .filter(vr => vr.date && vr.date.split("T")[0] === cellDateStr && vr.status === "approved")
      .reduce((sum, vr) => sum + vr.requestedHours, 0);
  };

  const getAvailableHours = (date) => {
    const scheduled = getWorkingHoursCount(date);
    const approved = getApprovedVacationHours(date);
    return Math.max(scheduled - approved, 0);
  };

  const getCellColor = (date) => {
    const scheduled = getWorkingHoursCount(date);
    const approved = getApprovedVacationHours(date);
    if (scheduled > 0 && approved >= scheduled) {
      return "#ffff99";
    }
    return getWorkingHoursColor(getAvailableHours(date));
  };

  const handleCellClick = async (date) => {
    if (!date) return;
    const dateStr = formatDateLocal(date);
    addLog(`Cell clicked: ${dateStr}`);
    const dayName = normalizeDayName(date.toLocaleDateString("en-US", { weekday: "long" }));
    let targetProjectId = project._id;
    if (project.fake) {
      const hour = date.getHours();
      targetProjectId = project.scheduleMapping[dayName] && project.scheduleMapping[dayName][hour];
      if (!targetProjectId) {
        window.alert("No project is scheduled at this time.");
        addLog("Request aborted: No project mapping found.");
        return;
      }
    }
    const workingCount = getWorkingHoursCount(date);
    addLog(`Scheduled hours: ${workingCount}`);
    if (workingCount === 0) {
      window.alert("Warning: This day is not a working day for this project. Cannot request vacation.");
      addLog("Request aborted: Not a working day.");
      return;
    }
    const approvedVacHours = getApprovedVacationHours(date);
    addLog(`Approved vacation hours: ${approvedVacHours}`);
    const availableHours = getAvailableHours(date);
    addLog(`Available hours: ${availableHours}`);
    if (availableHours <= 0) {
      window.alert("No available working hours remain on this day for a vacation request.");
      addLog("Request aborted: No available hours.");
      return;
    }
    const input = window.prompt(`Enter number of vacation hours to request for ${dateStr} (max ${availableHours}):`);
    if (!input) {
      addLog("User cancelled the prompt.");
      return;
    }
    const requestedHours = Number(input);
    if (isNaN(requestedHours) || requestedHours <= 0) {
      window.alert("Invalid number of hours.");
      addLog("Request aborted: Invalid number.");
      return;
    }
    if (requestedHours > availableHours) {
      window.alert(`Requested vacation hours exceed available working hours for ${dateStr}. Available: ${availableHours}.`);
      addLog("Request aborted: Exceeds available hours.");
      return;
    }
    const payload = {
      userId: "USER_ID_EXAMPLE",
      projectId: targetProjectId,
      requestedHours,
      date: dateStr,
    };
    addLog(`Submitting payload: ${JSON.stringify(payload)}`);
    try {
      const response = await fetch("http://localhost:5000/vacation-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        window.alert("Error requesting vacation: " + errData.error);
        addLog("Request error: " + errData.error);
      } else {
        window.alert(`Vacation request for ${requestedHours} hours on ${dateStr} submitted.`);
        addLog("Request submitted successfully.");
        onVacationRequested();
      }
    } catch (err) {
      console.error("Error submitting vacation request:", err);
      addLog("Request error: " + err.message);
    }
  };

  const queryProjectData = async () => {
    try {
      const projectRes = await fetch(`http://localhost:5000/projects/${project._id}`);
      const projectDataText = await projectRes.text();
      let projectData;
      try {
        projectData = JSON.parse(projectDataText);
      } catch (err) {
        addLog("Error parsing project JSON: " + err.message);
        addLog("Project response: " + projectDataText);
        return;
      }
      const vacRes = await fetch(`http://localhost:5000/vacation-requests?projectId=${project._id}`);
      const vacData = await vacRes.json();
      const data = { project: projectData, vacationRequests: vacData };
      setDebugData(data);
      addLog("Query Project Data successful.");
    } catch (err) {
      addLog("Error querying project data: " + err.message);
    }
  };

  const renderMonthRow = (monthIndex) => {
    const firstDay = new Date(currentYear, monthIndex, 1, 12, 0, 0);
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    const startDay = firstDay.getDay();
    const cells = Array(totalCells).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const cellIndex = startDay + d - 1;
      if (cellIndex < totalCells) {
        cells[cellIndex] = new Date(currentYear, monthIndex, d, 12, 0, 0);
      }
    }
    return (
      <tr key={monthIndex}>
        <td style={{ border: '1px solid #ccc', padding: '2px', fontWeight: 'bold', width: '80px' }}>
          {new Date(currentYear, monthIndex, 1).toLocaleString('default', { month: 'long' })}
        </td>
        {cells.map((cell, idx) => (
          <td key={idx} style={{ border: '1px solid #ccc', padding: '2px', textAlign: 'center', width: '28px', height: '28px' }}>
            {cell ? (
              <div
                onClick={() => handleCellClick(cell)}
                style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: getCellColor(cell),
                  lineHeight: '28px',
                  cursor: 'pointer',
                  ...(cell.getTime() === todayDate.getTime()
                    ? { fontWeight: 'bold' }
                    : cell < todayDate
                    ? { fontStyle: 'italic' }
                    : {})
                }}
                title={formatDateLocal(cell)}
              >
                {cell.getDate()}
              </div>
            ) : (
              ""
            )}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '10px', backgroundColor: '#eef', padding: '5px', fontSize: '12px', maxHeight: '150px', overflowY: 'auto' }}>
        <strong>Calendar Logs:</strong>
        <pre style={{ margin: 0 }}>{calendarLogs.join('\n')}</pre>
        <button onClick={() => setCalendarLogs([])} style={{ fontSize: '10px', marginTop: '5px' }}>Clear Logs</button>
        <button onClick={queryProjectData} style={{ fontSize: '12px', marginTop: '5px', marginLeft: '10px' }}>
          Query Project Data
        </button>
        {debugData && (
          <pre style={{ marginTop: '5px', backgroundColor: '#ddd', padding: '5px', fontSize: '10px' }}>
            {JSON.stringify(debugData, null, 2)}
          </pre>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <button onClick={() => setCurrentYear(currentYear - 1)} style={{ marginRight: '10px' }}>← Previous Year</button>
        <h3 style={{ margin: '0 10px' }}>{currentYear}</h3>
        <button onClick={() => setCurrentYear(currentYear + 1)} style={{ marginLeft: '10px' }}>Next Year →</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '2px', width: '80px' }}>Month</th>
            {Array.from({ length: totalCells }, (_, i) => {
              const dayAbbr = ["S", "M", "T", "W", "T", "F", "S"][i % 7];
              return (
                <th key={i} style={{ border: '1px solid #ccc', padding: '2px', width: '28px' }}>
                  {dayAbbr}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 12 }, (_, monthIndex) => renderMonthRow(monthIndex))}
        </tbody>
      </table>
      <Legend />
    </div>
  );
}

// ---------------------- Legend Component ----------------------
function Legend() {
  const legendItems = [
    { color: "#fff", label: "0 working hours available" },
    { color: "#c6ecc6", label: "1-3 working hours available" },
    { color: "#90ee90", label: "4-6 working hours available" },
    { color: "#2e8b57", label: "7+ working hours available" },
    { color: "#ffff99", label: "Vacation approved (full day)" },
  ];

  return (
    <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "15px" }}>
      {legendItems.map((item, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "20px", height: "20px", backgroundColor: item.color, border: "1px solid #ccc" }}></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------- Main App Component ----------------------
function App() {
  const [projects, setProjects] = useState([]);
  const [vacationRequests, setVacationRequests] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [user, setUser] = useState(null);
  const [showProjectFormModal, setShowProjectFormModal] = useState(false);
  const [showFullScreenCalendar, setShowFullScreenCalendar] = useState(false);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch('http://localhost:5000/projects').then(res => res.json()),
        fetch('http://localhost:5000/vacation-requests').then(res => res.json())
      ])
      .then(([projData, vacData]) => {
        const cumulativeSchedule = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: []
        };
        const scheduleMapping = {
          Monday: {},
          Tuesday: {},
          Wednesday: {},
          Thursday: {},
          Friday: {},
          Saturday: {},
          Sunday: {}
        };

        for (let proj of projData) {
          for (let day in proj.schedule) {
            for (let hour of proj.schedule[day]) {
              if (!cumulativeSchedule[day].includes(hour)) {
                cumulativeSchedule[day].push(hour);
                scheduleMapping[day][hour] = proj._id;
              }
            }
          }
        }

        const fakeProject = {
          _id: "fake-cumulative",
          name: "Cumulative Projects",
          schedule: cumulativeSchedule,
          fake: true,
          scheduleMapping,
        };

        setProjects([fakeProject, ...projData]);

        const validVacations = vacData.filter(vr => vr.date);
        setVacationRequests(validVacations);
      })
      .catch(err => console.error("Error fetching data:", err));
    }
  }, [refreshFlag, user]);

  const refreshData = () => setRefreshFlag(prev => !prev);

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectFormModal(true);
  };

  if (!user) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>HR Vacation Manager</h1>
        <Login onLogin={setUser} user={user} />
        <p>Please sign in to continue.</p>
      </div>
    );
  }

  const floatingProjectButtonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
  };

  const floatingCalendarButtonStyle = {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>HR Vacation Manager</h1>
      <Login onLogin={setUser} user={user} />
      <ProjectDashboard
        projects={projects}
        vacationRequests={vacationRequests}
        onProjectDeleted={refreshData}
        onVacationAdded={refreshData}
        onEditProject={handleEditProject}
      />
      <ProjectStats projects={projects} vacationRequests={vacationRequests} />
      <CustomModal
        message={modalMessage}
        visible={modalMessage !== ""}
        onClose={() => setModalMessage("")}
      />

      {showProjectFormModal && (
        <SlidingModal onClose={() => setShowProjectFormModal(false)}>
          <ProjectForm
            projects={projects}
            editingProject={editingProject}
            onProjectSaved={(msg) => {
              refreshData();
              setModalMessage(msg);
              setEditingProject(null);
              setShowProjectFormModal(false);
            }}
          />
        </SlidingModal>
      )}

      {showFullScreenCalendar && (
        <FullScreenCalendar
          onClose={() => setShowFullScreenCalendar(false)}
          onDateSelect={(date) => {
            console.log("Selected date:", date);
            setShowFullScreenCalendar(false);
          }}
        />
      )}

      <button
        style={floatingProjectButtonStyle}
        onClick={() => {
          setEditingProject(null);
          setShowProjectFormModal(true);
        }}
      >
        Add New Project
      </button>

      <button
        style={floatingCalendarButtonStyle}
        onClick={() => setShowFullScreenCalendar(true)}
      >
        View Calendar
      </button>
    </div>
  );
}

export default App;
