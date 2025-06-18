import React, { useEffect, useState } from 'react';
import { fetchDeliveries, fetchAlerts } from '../services/api';
import DeliveryList from '../components/DeliveryList';
import AlertsPanel from '../components/AlertsPanel';

function Dashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    driver: '',
    store: '',
  });

  useEffect(() => {
    async function loadData() {
      const deliveriesData = await fetchDeliveries(filters);
      setDeliveries(deliveriesData);
      const alertsData = await fetchAlerts();
      setAlerts(alertsData);
    }
    loadData();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Conad Delivery Monitoring Dashboard</h1>
      <AlertsPanel alerts={alerts} />
      <div className="my-6">
        <h2 className="text-2xl font-semibold mb-4">Filters</h2>
        <div className="flex space-x-4">
          <select name="status" value={filters.status} onChange={handleFilterChange} className="border p-2 rounded">
            <option value="">All Statuses</option>
            <option value="Disponibili">Disponibili</option>
            <option value="In Corso">In Corso</option>
          </select>
          <input
            type="text"
            name="driver"
            placeholder="Filter by driver"
            value={filters.driver}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="store"
            placeholder="Filter by store"
            value={filters.store}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
        </div>
      </div>
      <DeliveryList deliveries={deliveries} />
    </div>
  );
}

export default Dashboard;
