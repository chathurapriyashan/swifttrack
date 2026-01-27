import { Package } from 'lucide-react';

interface OrderHeaderProps {
  orderId: string;
  status: string;
}

export function OrderHeader({ orderId, status }: OrderHeaderProps) {
  return (
    <div className="border-b border-black pb-8">
      <div className="flex items-center gap-3 mb-4">
        <Package className="w-8 h-8" strokeWidth={1.5} />
        <h1 className="text-4xl tracking-tight">Order Details</h1>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm tracking-wider uppercase text-gray-600">{orderId}</p>
        <div className="px-4 py-2 bg-black text-white text-sm tracking-wide">
          {status}
        </div>
      </div>
    </div>
  );
}
