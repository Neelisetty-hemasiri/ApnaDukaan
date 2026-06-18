import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { FiTruck, FiCheckCircle, FiMapPin, FiPhone } from 'react-icons/fi';

const DeliveryDashboard = () => {
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/delivery/available')
      .then(({ data }) => setAvailable(data.deliveries || []))
      .finally(() => setLoading(false));
  }, []);

  const acceptDelivery = async (id) => {
    try {
      await api.put(`/delivery/${id}/accept`);
      setAvailable(prev => prev.filter(d => d._id !== id));
      toast.success('Delivery accepted! Check My Deliveries.');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiTruck className="text-green-600" /> Available Deliveries
      </h1>

      {available.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FiTruck size={64} className="mx-auto text-gray-200 mb-4" />
          <p className="text-lg">No available deliveries right now.</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {available.map(delivery => {
            const order = delivery.order;
            return (
              <div key={delivery._id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">Order #{order?._id?.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">₹{order?.totalAmount?.toFixed(2)} • {order?.paymentMethod?.toUpperCase()}</p>
                  </div>
                  <span className="badge bg-blue-100 text-blue-700 text-xs">Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1 font-semibold">PICKUP FROM</p>
                    <p className="font-medium text-gray-800">{order?.shop?.shopName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FiMapPin size={11} />{order?.shop?.location?.street}, {order?.shop?.location?.city}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1 font-semibold">DELIVER TO</p>
                    <p className="font-medium text-gray-800">{order?.customer?.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FiPhone size={11} />{order?.customer?.phone}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FiMapPin size={11} />{order?.customer?.address?.street}, {order?.customer?.address?.city}
                    </p>
                  </div>
                </div>

                <button onClick={() => acceptDelivery(delivery._id)}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
                  <FiCheckCircle /> Accept Delivery
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
