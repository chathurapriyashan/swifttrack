import { ShoppingBag } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface OrderItemsProps {
  items: Item[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
        <h2 className="text-sm uppercase tracking-wider text-gray-600">Items Ordered</h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-8">×{item.quantity}</span>
              <span>{item.name}</span>
            </div>
            <span className="text-sm">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
