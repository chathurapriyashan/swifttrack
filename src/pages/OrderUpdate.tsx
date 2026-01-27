import { useState } from 'react';
import { OrderUpdateHeader } from './components/order-update-header';
import { CurrentOrderInfo } from './components/current-order-info';
import { DriverAssignment } from './components/driver-assignment';
import { StatusUpdate } from './components/status-update';
import { UpdateSummary } from './components/update-summary';

export interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
  available: boolean;
}

// Mock drivers database
const availableDrivers: Driver[] = [
  { id: 1, name: 'Michael Chen', phone: '+1 (555) 123-4567', vehicle: 'Toyota Prius - ABC 123', available: true },
  { id: 2, name: 'Sarah Johnson', phone: '+1 (555) 234-5678', vehicle: 'Honda Civic - XYZ 789', available: true },
  { id: 3, name: 'David Martinez', phone: '+1 (555) 345-6789', vehicle: 'Tesla Model 3 - DEF 456', available: true },
  { id: 4, name: 'Emily Rodriguez', phone: '+1 (555) 456-7890', vehicle: 'Ford Transit - GHI 012', available: false },
  { id: 5, name: 'James Wilson', phone: '+1 (555) 567-8901', vehicle: 'Nissan Leaf - JKL 345', available: true },
];

const orderStatuses = [
  'Pending',
  'Confirmed',
  'Dispatched',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export default function OrderUpdate() {
  // Mock current order data
  const [order] = useState({
    id: 'ORD-2847',
    name: 'Premium Groceries Delivery',
    status: 'In Transit',
    address: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      zip: '62701'
    },
    currentDriver: availableDrivers[0],
    items: [
      { id: 1, name: 'Organic Avocados', quantity: 6, price: 12.99 },
      { id: 2, name: 'Sourdough Bread', quantity: 2, price: 8.50 },
      { id: 3, name: 'Free Range Eggs (Dozen)', quantity: 1, price: 6.99 },
    ]
  });

  const [selectedDriver, setSelectedDriver] = useState<Driver>(order.currentDriver);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [notes, setNotes] = useState('');

  const hasChanges = 
    selectedDriver.id !== order.currentDriver.id || 
    selectedStatus !== order.status ||
    notes.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order updated:', {
      orderId: order.id,
      driver: selectedDriver,
      status: selectedStatus,
      notes
    });
    alert('Order updated successfully!');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <OrderUpdateHeader orderId={order.id} />
        
        <form onSubmit={handleSubmit} className="mt-12 space-y-12">
          {/* Current Order Info */}
          <CurrentOrderInfo order={order} />

          {/* Driver Assignment */}
          <DriverAssignment
            drivers={availableDrivers}
            selectedDriver={selectedDriver}
            onSelectDriver={setSelectedDriver}
            currentDriverId={order.currentDriver.id}
          />

          {/* Status Update */}
          <StatusUpdate
            statuses={orderStatuses}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            currentStatus={order.status}
          />

          {/* Notes */}
          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-600 mb-3">
              Update Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this update..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Update Summary */}
          {hasChanges && (
            <UpdateSummary
              currentDriver={order.currentDriver}
              newDriver={selectedDriver}
              currentStatus={order.status}
              newStatus={selectedStatus}
            />
          )}

          {/* Submit Button */}
          <div className="border-t border-black pt-8">
            <button
              type="submit"
              disabled={!hasChanges}
              className="w-full bg-black text-white py-4 uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Update Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
