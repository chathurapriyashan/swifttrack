import { Receipt } from 'lucide-react';

interface OrderBillProps {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

export function OrderBill({ subtotal, tax, deliveryFee, total }: OrderBillProps) {
  return (
    <div className="border-t border-black pt-8">
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="w-4 h-4" strokeWidth={1.5} />
        <h2 className="text-sm uppercase tracking-wider text-gray-600">Bill Summary</h2>
      </div>
      
      <div className="max-w-md ml-auto space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="border-t border-black pt-3 flex justify-between">
          <span className="uppercase tracking-wider">Total</span>
          <span className="text-xl">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
