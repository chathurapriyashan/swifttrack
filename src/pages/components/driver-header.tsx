import { Truck, Menu } from 'lucide-react';

interface DriverHeaderProps {
  driverName: string;
}

export function DriverHeader({ driverName }: DriverHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="bg-black text-white px-4 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5" strokeWidth={1.5} />
          <span className="font-medium">{driverName}</span>
        </div>
        <button className="p-2 hover:bg-gray-800 transition-colors rounded">
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
      <p className="text-xs text-gray-300 uppercase tracking-wider">{today}</p>
    </div>
  );
}
