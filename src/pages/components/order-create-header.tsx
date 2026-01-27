import { FilePlus } from 'lucide-react';

export function OrderCreateHeader() {
  return (
    <div className="border-b border-black pb-8">
      <div className="flex items-center gap-3">
        <a href='/users' className='p-2 bg-black  rounded-full text-white'>&larr; Back</a>
        <FilePlus className="w-8 h-8" strokeWidth={1.5} />
        <h1 className="text-4xl tracking-tight">Create Order</h1>
      </div>
      <p className="text-sm text-gray-600 mt-3 tracking-wide">
        Add products and delivery details to create a new order
      </p>
    </div>
  );
}
