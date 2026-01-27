import { MapPin } from 'lucide-react';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface DeliveryFormProps {
  address: Address;
  onChange: (address: Address) => void;
}

export function DeliveryForm({ address, onChange }: DeliveryFormProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4" strokeWidth={1.5} />
        <h2 className="text-sm uppercase tracking-wider text-gray-600">Delivery Address</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={address.street}
            onChange={(e) => onChange({ ...address, street: e.target.value })}
            placeholder="Street Address"
            required
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={address.city}
            onChange={(e) => onChange({ ...address, city: e.target.value })}
            placeholder="City"
            required
            className="px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
          />
          <input
            type="text"
            value={address.state}
            onChange={(e) => onChange({ ...address, state: e.target.value })}
            placeholder="State"
            required
            className="px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
          />
          <input
            type="text"
            value={address.zip}
            onChange={(e) => onChange({ ...address, zip: e.target.value })}
            placeholder="ZIP Code"
            required
            className="px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors col-span-2 md:col-span-1"
          />
        </div>
      </div>
    </div>
  );
}
