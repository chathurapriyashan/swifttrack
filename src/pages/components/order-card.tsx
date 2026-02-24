import { useState } from 'react';
import { MapPin, Phone, Package, DollarSign, Clock, ChevronDown, ChevronUp, Navigation, CheckCircle2, Camera } from 'lucide-react';
import type { Order } from './DriverApp';

interface OrderCardProps {
  order: Order;
  onStartDelivery: (orderId: string) => void;
  onCaptureSignature: (orderId: string) => void;
  onCall: (phone: string) => void;
  onNavigate: (address: Order['address']) => void;
}

export function OrderCard({ order, onStartDelivery, onCaptureSignature, onCall, onNavigate }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    switch (order.status) {
      case 'delivered':
        return 'bg-black text-white';
      case 'in-progress':
        return 'bg-gray-800 text-white';
      case 'pending':
        return 'bg-white border border-gray-300';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case 'delivered':
        return 'Delivered';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return order.status;
    }
  };

  return (
    <div className={`border transition-all ${
      order.status === 'in-progress' ? 'border-black' : 'border-gray-300'
    }`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{order.customerName}</h3>
              {order.status === 'delivered' && (
                <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
              )}
            </div>
            <p className="text-xs text-gray-600 uppercase tracking-wider">{order.id}</p>
          </div>
          <div className={`px-3 py-1 text-xs uppercase tracking-wider ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-600" strokeWidth={1.5} />
            <span className="text-gray-600">{order.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3 text-gray-600" strokeWidth={1.5} />
            <span className="text-gray-600">{order.items} items</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-gray-600" strokeWidth={1.5} />
            <span className="text-gray-600">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm mb-3">
          <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-gray-700">
            {order.address.street}, {order.address.city}, {order.address.zip}
          </p>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 py-2 border-t border-gray-200 text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors"
        >
          {expanded ? 'Show Less' : 'Show More'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
          {/* Notes */}
          {order.notes && (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Notes</p>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Customer Phone</p>
            <p className="text-sm">{order.phone}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => onCall(order.phone)}
              className="flex items-center justify-center gap-2 py-3 border border-gray-300 hover:border-black transition-colors"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-wider">Call</span>
            </button>
            <button
              onClick={() => onNavigate(order.address)}
              className="flex items-center justify-center gap-2 py-3 border border-gray-300 hover:border-black transition-colors"
            >
              <Navigation className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-wider">Navigate</span>
            </button>
          </div>

          {/* Status Actions */}
          {order.status === 'pending' && (
            <button
              onClick={() => onStartDelivery(order.id)}
              className="w-full bg-black text-white py-3 uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
            >
              Start Delivery
            </button>
          )}

          {order.status === 'in-progress' && (
            <button
              onClick={() => onCaptureSignature(order.id)}
              className="w-full bg-black text-white py-3 flex items-center justify-center gap-2 uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
            >
              <Camera className="w-4 h-4" strokeWidth={2} />
              Capture Signature
            </button>
          )}

          {order.status === 'delivered' && order.signatureImage && (
            <div className="text-center py-2 text-sm text-gray-600">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-1" strokeWidth={1.5} />
              Signature Captured
            </div>
          )}
        </div>
      )}
    </div>
  );
}
