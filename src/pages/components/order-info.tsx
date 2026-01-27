import { MapPin, Phone, Truck, Clock } from 'lucide-react';

interface OrderInfoProps {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  driver: {
    name: string;
    phone: string;
    vehicle: string;
  };
  dispatchedTime: string;
  estimatedArrival: string;
}

export function OrderInfo({ name, address, driver, dispatchedTime, estimatedArrival }: OrderInfoProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm uppercase tracking-wider text-gray-600 mb-2">Order Name</h2>
          <p className="text-xl">{name}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" strokeWidth={1.5} />
            <h2 className="text-sm uppercase tracking-wider text-gray-600">Delivery Address</h2>
          </div>
          <p className="text-base leading-relaxed">
            {address.street}<br />
            {address.city}, {address.state} {address.zip}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" strokeWidth={1.5} />
            <h2 className="text-sm uppercase tracking-wider text-gray-600">Timeline</h2>
          </div>
          <div className="space-y-1 text-sm">
            <p>Dispatched: {formatTime(dispatchedTime)}</p>
            <p>Estimated Arrival: {formatTime(estimatedArrival)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4" strokeWidth={1.5} />
            <h2 className="text-sm uppercase tracking-wider text-gray-600">Driver Information</h2>
          </div>
          <p className="text-base mb-1">{driver.name}</p>
          <p className="text-sm text-gray-600">{driver.vehicle}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4" strokeWidth={1.5} />
            <h2 className="text-sm uppercase tracking-wider text-gray-600">Contact Driver</h2>
          </div>
          <a 
            href={`tel:${driver.phone}`}
            className="text-base underline hover:no-underline transition-all"
          >
            {driver.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
