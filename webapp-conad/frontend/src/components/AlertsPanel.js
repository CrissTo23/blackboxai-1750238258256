import React from 'react';

function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded">
      <h2 className="text-xl font-semibold text-red-700 mb-2">Alerts</h2>
      <ul className="list-disc list-inside text-red-700">
        {alerts.map((alert) => (
          <li key={alert._id}>
            {alert.message} <span className="text-sm text-gray-600">({new Date(alert.timestamp).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlertsPanel;
