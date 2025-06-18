import React from 'react';

function DeliveryList({ deliveries }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Deliveries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Delivery ID</th>
              <th className="py-2 px-4 border-b">Driver</th>
              <th className="py-2 px-4 border-b">Store</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No deliveries found.</td>
              </tr>
            ) : (
              deliveries.map((delivery) => (
                <tr key={delivery._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{delivery.deliveryId}</td>
                  <td className="py-2 px-4 border-b">{delivery.driver}</td>
                  <td className="py-2 px-4 border-b">{delivery.store}</td>
                  <td className="py-2 px-4 border-b">{delivery.status}</td>
                  <td className="py-2 px-4 border-b">{new Date(delivery.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeliveryList;
