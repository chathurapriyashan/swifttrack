import { Edit3 } from 'lucide-react';

interface OrderUpdateHeaderProps {
  orderId: string;
}

export function OrderUpdateHeader({ orderId }: OrderUpdateHeaderProps) {
  return (
    <div className="border-b border-black pb-8">
      <div className="flex items-center gap-3 mb-4">
        <a href="/warehouse" className='p-2 bg-black rounded-full text-white'>&larr; back</a>
        <Edit3 className="w-8 h-8" strokeWidth={1.5} />
        <h1 className="text-4xl tracking-tight">Update Order</h1>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm tracking-wider uppercase text-gray-600">{orderId}</p>
      </div>
    </div>
  );
}
