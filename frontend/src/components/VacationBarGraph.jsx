// src/components/VacationBarGraph.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/**
 * VacationBarGraph Component
 *
 * This component renders a bar chart with two bars per month:
 * - "Accrued": The cumulative vacation hours accrued up to that month.
 * - "Used": The cumulative vacation hours used (approved) up to that month.
 *
 * It shows a warning if any month has used vacation hours exceeding the accrued vacation.
 *
 * The accrued vacation for month m is computed as:
 *   accrued = (maxVacationAllowed / 12) * m.
 * The used vacation for month m is computed as the cumulative sum of approved
 * vacation requests with a UTC month less than or equal to m.
 *
 * Props:
 *   - project: An object containing the project's schedule.
 *   - vacationRequests: An array of vacation request objects (each with a date, requestedHours, and status).
 */
function VacationBarGraph({ project, vacationRequests }) {
  // Calculate weekly working hours (sum scheduled hours for all days).
  const weeklyWorkingHours = Object.values(project.schedule || {}).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  // Maximum vacation allowed per year is twice the weekly working hours.
  const maxVacationAllowed = weeklyWorkingHours * 2;

  // Define month abbreviations.
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Build the data array (one object per month).
  const data = [];
  for (let m = 1; m <= 12; m++) {
    // Calculate cumulative accrued vacation hours for month m.
    const accrued = (maxVacationAllowed / 12) * m;
    // IMPORTANT: Use getUTCMonth() instead of getMonth() to ensure the month is interpreted in UTC.
    const used = vacationRequests
      .filter(
        (vr) =>
          vr.status === "approved" &&
          new Date(vr.date).getUTCMonth() + 1 <= m
      )
      .reduce((sum, vr) => sum + vr.requestedHours, 0);
    data.push({
      month: monthNames[m - 1],
      Accrued: Number(accrued.toFixed(2)),
      Used: used,
    });
  }

  // Determine if any month's used vacation exceeds accrued vacation.
  const warning = data.some(item => item.Used > item.Accrued);

  return (
    <div style={{ marginTop: '20px' }}>
      <h4>Vacation Accrual and Usage (Cumulative)</h4>
      {warning && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          Warning: More vacation hours have been used than accrued!
        </p>
      )}
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Accrued" fill="#8884d8" />
        <Bar dataKey="Used" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}

export default VacationBarGraph;
