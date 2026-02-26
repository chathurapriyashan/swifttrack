import { useState } from 'react';
import { MapPin, Navigation, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import type { Order } from '../App';

interface DailyRouteProps {
  orders: Order[];
  onNavigateRoute: () => void;
}

export function DailyRoute({ orders, onNavigateRoute }: DailyRouteProps) {
  const [expanded, setExpanded] = useState(true);
  
  const sortedOrders = [...orders].sort((a, b) => a.stopNumber - b.stopNumber);
  const activeOrders = sortedOrders.filter(o => o.status !== 'delivered');
  const currentStop = sortedOrders.find(o => o.status === 'in-progress');
  
  return (
    <div className="border border-black">
      {/* Header */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" strokeWidth={1.5} />
            <h2 className="font-medium">Today's Route</h2>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <ChevronDown className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-300">
          {sortedOrders.length} stops • {activeOrders.length} remaining
        </p>
      </div>

      {/* Route Stops */}
      {expanded && (
        <div className="bg-white">
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {sortedOrders.map((order, index) => {
              const isCompleted = order.status === 'delivered';
              const isCurrent = order.status === 'in-progress';
              const isNext = !isCompleted && !isCurrent && index === sortedOrders.findIndex(o => o.status !== 'delivered');
              
              return (
                <div key={order.id} className="relative flex gap-3">
                  {/* Connector Line */}
                  {index < sortedOrders.length - 1 && (
                    <div className={`absolute left-[15px] top-[32px] w-[2px] h-[calc(100%+12px)] ${
                      isCompleted ? 'bg-black' : 'bg-gray-200'
                    }`} />
                  )}
                  
                  {/* Stop Number / Status Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${
                        isCurrent 
                          ? 'border-black bg-black text-white font-medium' 
                          : isNext
                          ? 'border-black bg-white font-medium'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}>
                        {order.stopNumber}
                      </div>
                    )}
                  </div>

                  {/* Stop Details */}
                  <div className="flex-1 pb-3">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className={`text-sm ${isCompleted ? 'line-through text-gray-400' : 'font-medium'}`}>
                          {order.customerName}
                        </p>
                        <p className={`text-xs ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                          {order.estimatedTime}
                        </p>
                      </div>
                      {isCurrent && (
                        <span className="text-xs px-2 py-0.5 bg-black text-white uppercase tracking-wider">
                          Current
                        </span>
                      )}
                      {isNext && (
                        <span className="text-xs px-2 py-0.5 border border-gray-300 uppercase tracking-wider">
                          Next
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                      {order.delivery_address}
                    </p>
                    {/* <p className={`text-xs ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                      {order.address.city}, {order.address.zip}
                    </p> */}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigate Button */}
          {activeOrders.length > 0 && (
            <div className="border-t border-gray-200 p-3">
              <button
                onClick={onNavigateRoute}
                className="w-full bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <Navigation className="w-4 h-4" strokeWidth={2} />
                <span className="text-xs uppercase tracking-wider">Navigate Full Route</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
