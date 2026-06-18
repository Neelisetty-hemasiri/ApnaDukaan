import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi';

const CheckoutPage = () => {
  const { cartItems, shopId, itemsPrice, taxPrice, deliveryCharge, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.pincode)
      return toast.error('Please fill in all address fields');

    setLoading(true);
    try {
      const orderItems = cartItems.map(i => ({ productId: i._id, quantity: i.qty }));
      const { data } = await api.post('/orders', {
        shopId,
        items: orderItems,
        deliveryAddress: address,
        paymentMethod,
        deliveryCharge,
      });

      if (paymentMethod === 'cod') {
        await api.post('/payments/cod', { orderId: data.order._id });
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/orders/${data.order._id}`);
      } else if (paymentMethod === 'paypal') {
        const { data: payData } = await api.post('/payments/paypal/create', { orderId: data.order._id });
        window.location.href = payData.approvalUrl;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FiMapPin className="text-green-600" />Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Street Address</label>
                <input className="input-field" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="House No, Street Name" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                <input className="input-field" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="City" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">State</label>
                <input className="input-field" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} placeholder="State" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Pincode</label>
                <input className="input-field" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} placeholder="500001" required />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FiCreditCard className="text-green-600" />Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', emoji: '💵' },
                { value: 'paypal', label: 'PayPal', desc: 'Secure online payment via PayPal', emoji: '💳' },
              ].map(m => (
                <label key={m.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === m.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} className="sr-only" />
                  <span className="text-2xl">{m.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                  {paymentMethod === m.value && <FiCheck className="text-green-600" size={18} />}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-5 h-fit">
          <h2 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate flex-1">{item.productName} ×{item.qty}</span>
                <span className="font-medium ml-2">₹{((item.discountedPrice || item.price) * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax</span><span>₹{taxPrice.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
            <span>Total</span><span className="text-green-700">₹{totalPrice.toFixed(2)}</span>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-4 text-base">
            {loading ? 'Placing Order...' : `Place Order • ₹${totalPrice.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
