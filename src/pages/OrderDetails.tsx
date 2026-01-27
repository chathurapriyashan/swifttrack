import { OrderHeader } from './components/order-header';
import { OrderInfo } from './components/order-info';
import { OrderItems } from './components/order-items';
import { OrderBill } from './components/order-bill';
import { OrderRoute } from './components/order-route';

export default function OrderDetails() {
  // Mock order data
  const order = {
    id: 'ORD-2847',
    name: 'Premium Groceries Delivery',
    status: 'In Transit',
    dispatchedTime: '2026-01-27T14:30:00',
    estimatedArrival: '2026-01-27T16:00:00',
    address: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      zip: '62701'
    },
    driver: {
      name: 'Michael Chen',
      phone: '+1 (555) 123-4567',
      vehicle: 'Toyota Prius - ABC 123'
    },
    items: [
      { id: 1, name: 'Organic Avocados', quantity: 6, price: 12.99 },
      { id: 2, name: 'Sourdough Bread', quantity: 2, price: 8.50 },
      { id: 3, name: 'Free Range Eggs (Dozen)', quantity: 1, price: 6.99 },
      { id: 4, name: 'Almond Milk', quantity: 3, price: 15.99 },
      { id: 5, name: 'Fresh Spinach', quantity: 2, price: 7.98 }
    ],
    routeSteps: [
      { label: 'Order Placed', time: '14:00', completed: true },
      { label: 'Dispatched', time: '14:30', completed: true },
      { label: 'In Transit', time: '15:15', completed: true, current: true },
      { label: 'Out for Delivery', time: '15:45', completed: false },
      { label: 'Delivered', time: '16:00', completed: false }
    ]
  };

  const subtotal = order.items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const deliveryFee = 4.99;
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <OrderHeader 
          orderId={order.id}
          status={order.status}
        />
        
        <div className="mt-12 space-y-12">
          <OrderInfo
            name={order.name}
            address={order.address}
            driver={order.driver}
            dispatchedTime={order.dispatchedTime}
            estimatedArrival={order.estimatedArrival}
          />

          <OrderRoute steps={order.routeSteps} />

          <OrderItems items={order.items} />

          <OrderBill
            subtotal={subtotal}
            tax={tax}
            deliveryFee={deliveryFee}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
