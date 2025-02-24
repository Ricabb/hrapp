import React, { useState, useEffect } from 'react';

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
                onClick={() => {
                  if (onDateSelect) onDateSelect(day);
                }}
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

export default FullScreenCalendar;
