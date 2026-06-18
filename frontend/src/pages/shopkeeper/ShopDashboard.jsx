import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Spinner from '../../components/common/Spinner';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import { FiPackage, FiShoppingBag, FiAlertTriangle, FiDollarSign, FiPlus } from 'react-icons/fi';

const ShopDashboard = () => {
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: shopData } = await api.get('/shops/my');
        setShop(shopData.shop);
        const [ordRes, stockRes] = await Promise.all([
          api.get(`/orders/shop?shopId=${shopData.shop._id}&limit=5`),
          api.get(`/inventory/low-stock/${shopData.shop._id}`),
        ]);
        setOrders(ordRes.data.orders || []);
        setLowStock(stockRes.data.items || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const revenue = orders.filter(o => o.isPaid).reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  if (!shop) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <FiShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Shop Found</h2>
        <p className="text-gray-400 mb-6">You haven't set up your shop yet.</p>
        <Link to="/seller/profile" className="btn-primary inline-block px-8 py-2.5">Create Your Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{shop.shopName}</h1>
          <p className="text-sm text-gray-500 capitalize">{shop.category} • {shop.location?.city}</p>
        </div>
        <Link to="/seller/products" className="btn-primary flex items-center gap-2"><FiPlus size={16} />Add Product</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders.length, icon: <FiPackage />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Revenue', value: `₹${revenue.toFixed(0)}`, icon: <FiDollarSign />, color: 'text-green-600 bg-green-50' },
          { label: 'Low Stock Items', value: lowStock.length, icon: <FiAlertTriangle />, color: 'text-orange-600 bg-orange-50' },
          { label: 'Shop Rating', value: `${shop.rating?.toFixed(1)} ★`, icon: <FiShoppingBag />, color: 'text-yellow-600 bg-yellow-50' },
        ].map((stat, i) => (
          <div key={i} className="card p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <Link to="/seller/orders" className="text-green-600 text-sm hover:underline">View all</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{order.customer?.name}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{order.totalAmount?.toFixed(2)}</p>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-1">
              <FiAlertTriangle className="text-orange-500" size={16} /> Low Stock
            </h2>
            <Link to="/seller/inventory" className="text-green-600 text-sm hover:underline">Manage</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">All stock levels are healthy ✓</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <img src={item.product?.images?.[0] || 'https://via.placeholder.com/40'} alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.product?.productName}</p>
                    <p className="text-xs text-orange-600 font-medium">{item.quantity} left</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { to: '/seller/products', label: 'Manage Products', icon: '📦' },
          { to: '/seller/orders', label: 'Manage Orders', icon: '🛒' },
          { to: '/seller/inventory', label: 'Inventory', icon: '📊' },
          { to: '/seller/profile', label: 'Shop Settings', icon: '⚙️' },
        ].map(link => (
          <Link key={link.to} to={link.to} className="card p-4 text-center hover:shadow-md transition-shadow hover:border-green-200 border-2 border-transparent">
            <div className="text-3xl mb-2">{link.icon}</div>
            <p className="text-sm font-medium text-gray-700">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopDashboard;
