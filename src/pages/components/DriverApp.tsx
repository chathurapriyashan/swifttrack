import { useEffect, useState } from 'react';
import { DriverHeader } from './driver-header';
import { DailyRoute } from './daily-route';
import { RouteOverview } from './route-overview';
import { SignatureCapture } from './signature-capture';
import { OrderCard } from './order-card';

export interface Order {
  id: string;
  customerName: string;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  items: number;
  totalAmount: number;
  estimatedTime: string;
  status: 'pending' | 'in-progress' | 'delivered';
  phone: string;
  notes?: string;
  signatureImage?: string;
  stopNumber: number;
}

// Mock today's orders
const initialOrders: Order[] = [
  {
    id: 'ORD-2847',
    customerName: 'John Smith',
    address: { street: '742 Evergreen Terrace', city: 'Springfield', zip: '62701' },
    items: 5,
    totalAmount: 52.45,
    estimatedTime: '09:30 AM',
    status: 'delivered',
    phone: '+1 (555) 111-2222',
    notes: 'Ring doorbell twice',
    signatureImage: 'captured',
    stopNumber: 1
  },
  {
    id: 'ORD-2848',
    customerName: 'Sarah Johnson',
    address: { street: '123 Main Street', city: 'Springfield', zip: '62702' },
    items: 3,
    totalAmount: 28.99,
    estimatedTime: '10:15 AM',
    status: 'in-progress',
    phone: '+1 (555) 333-4444',
    notes: 'Leave at door',
    stopNumber: 2
  },
  {
    id: 'ORD-2849',
    customerName: 'Mike Chen',
    address: { street: '456 Oak Avenue', city: 'Springfield', zip: '62703' },
    items: 8,
    totalAmount: 78.50,
    estimatedTime: '11:00 AM',
    status: 'pending',
    phone: '+1 (555) 555-6666',
    stopNumber: 3
  },
  {
    id: 'ORD-2850',
    customerName: 'Emily Davis',
    address: { street: '789 Maple Drive', city: 'Springfield', zip: '62704' },
    items: 4,
    totalAmount: 45.30,
    estimatedTime: '11:45 AM',
    status: 'pending',
    phone: '+1 (555) 777-8888',
    notes: 'Call upon arrival',
    stopNumber: 4
  },
  {
    id: 'ORD-2851',
    customerName: 'Robert Wilson',
    address: { street: '321 Pine Street', city: 'Springfield', zip: '62705' },
    items: 6,
    totalAmount: 63.75,
    estimatedTime: '12:30 PM',
    status: 'pending',
    phone: '+1 (555) 999-0000',
    stopNumber: 5
  }
];



async function loadOrdersByDriverId(driverId) {
  try {
    const response = await fetch(`http://10.23.1.254:3000/api/orders`);
    if (response.ok) {
      const data = await response.json();
      console.log("Fetched orders data:", data);
      return data.filter(order => order.driver_id === driverId)  as Order[];
  
    } else {
      throw new Error("Failed to fetch orders: " + response.statusText);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}



export default function DriverApp() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [capturingSignature, setCapturingSignature] = useState<string | null>(null);

  const completedCount = orders.filter(o => o.status === 'delivered').length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const inProgressCount = orders.filter(o => o.status === 'in-progress').length;

  const handleStartDelivery = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'in-progress' } : order
    ));
  };

  const handleCaptureSignature = (orderId: string) => {
    setCapturingSignature(orderId);
  };

  const handleSignatureSubmit = (orderId: string, imageData: string) => {
    setOrders(orders.map(order =>
      order.id === orderId 
        ? { ...order, status: 'delivered', signatureImage: imageData }
        : order
    ));
    setCapturingSignature(null);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleNavigate = (address: Order['address']) => {
    const query = encodeURIComponent(`${address.street}, ${address.city}, ${address.zip}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleNavigateFullRoute = () => {
    // Create waypoints for all pending and in-progress orders
    const activeOrders = orders
      .filter(o => o.status !== 'delivered')
      .sort((a, b) => a.stopNumber - b.stopNumber);
    
    if (activeOrders.length > 0) {
      const origin = activeOrders[0];
      const destination = activeOrders[activeOrders.length - 1];
      const waypoints = activeOrders.slice(1, -1)
        .map(o => `${o.address.street}, ${o.address.city}, ${o.address.zip}`)
        .join('|');
      
      const originQuery = encodeURIComponent(`${origin.address.street}, ${origin.address.city}, ${origin.address.zip}`);
      const destQuery = encodeURIComponent(`${destination.address.street}, ${destination.address.city}, ${destination.address.zip}`);
      
      let url = `https://www.google.com/maps/dir/?api=1&origin=${originQuery}&destination=${destQuery}`;
      if (waypoints) {
        url += `&waypoints=${encodeURIComponent(waypoints)}`;
      }
      
      window.open(url, '_blank');
    }
  };


  useEffect(() => {
    // Simulate loading orders for a specific driver (e.g., driverId = '123')
    loadOrdersByDriverId(1).then(loadedOrders => {
      console.log("Loaded orders for driver:", loadedOrders);
      setOrders(loadedOrders);
    });
  }, []);



  return (
    <div className="min-h-screen bg-white pb-6">
      {/* Mobile optimized max-width */}
      <div className="max-w-md mx-auto">
        <DriverHeader driverName="Michael Chen" />
        
        <div className="px-4 space-y-4 mt-4">
          {/* Daily Route - Now at the top */}
          <DailyRoute 
            orders={orders}
            onNavigateRoute={handleNavigateFullRoute}
          />

          <RouteOverview
            totalOrders={orders.length}
            completed={completedCount}
            pending={pendingCount}
            inProgress={inProgressCount}
          />

          {/* Orders List */}
          <div>
            <h2 className="text-xs uppercase tracking-wider text-gray-600 mb-3 px-1">
              Today's Deliveries
            </h2>
            <div className="space-y-3">
              {orders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStartDelivery={handleStartDelivery}
                  onCaptureSignature={handleCaptureSignature}
                  onCall={handleCall}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Signature Capture Modal */}
        {capturingSignature && (
          <SignatureCapture
            orderId={capturingSignature}
            customerName={orders.find(o => o.id === capturingSignature)?.customerName || ''}
            onSubmit={handleSignatureSubmit}
            onCancel={() => setCapturingSignature(null)}
          />
        )}
      </div>
    </div>
  );
}
