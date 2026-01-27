import { Package, MapPin } from 'lucide-react';

interface CurrentOrderInfoProps {
  order: {
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    items: Array<{ id: number; name: string; quantity: number }>;
  };
}

export function CurrentOrderInfo({ order }: CurrentOrderInfoProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 p-6">
      <h2 className="text-sm uppercase tracking-wider text-gray-600 mb-4">Current Order Details</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" strokeWidth={1.5} />
            <p className="text-xs uppercase tracking-wider text-gray-600">Order Name</p>
          </div>
          <p className="text-sm">{order.name}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" strokeWidth={1.5} />
            <p className="text-xs uppercase tracking-wider text-gray-600">Delivery Address</p>
          </div>
          <p className="text-sm">
            {order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-gray-600 mb-2">Items</p>
          <p className="text-sm text-gray-600">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {' '}
            {order.items.map(item => `${item.name} (×${item.quantity})`).join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
