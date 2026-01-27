import { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { Driver } from '../App';

interface DriverFormProps {
  driver: Driver | null;
  onSave: (driver: Omit<Driver, 'id'>) => void;
  onCancel: () => void;
}

export function DriverForm({ driver, onSave, onCancel }: DriverFormProps) {
  const [formData, setFormData] = useState({
    name: driver?.name || '',
    phone: driver?.phone || '',
    email: driver?.email || '',
    vehicle: driver?.vehicle || '',
    license: driver?.license || '',
    available: driver?.available ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="border border-black p-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-300">
        <h2 className="text-2xl tracking-tight">
          {driver ? 'Edit Driver' : 'Add New Driver'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 transition-colors"
          title="Cancel"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-600 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-600 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              required
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-600 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="driver@delivery.com"
              required
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {/* License */}
          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-600 mb-2">
              License Number *
            </label>
            <input
              type="text"
              value={formData.license}
              onChange={(e) => handleChange('license', e.target.value)}
              placeholder="DL-1234567"
              required
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {/* Vehicle */}
          <div className="md:col-span-2">
            <label className="block text-sm uppercase tracking-wider text-gray-600 mb-2">
              Vehicle Details *
            </label>
            <input
              type="text"
              value={formData.vehicle}
              onChange={(e) => handleChange('vehicle', e.target.value)}
              placeholder="Toyota Prius - ABC 123"
              required
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {/* Availability */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => handleChange('available', e.target.checked)}
                className="w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-sm uppercase tracking-wider text-gray-600">
                Mark as Available
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-300">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            <Save className="w-4 h-4" strokeWidth={2} />
            {driver ? 'Update Driver' : 'Create Driver'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 uppercase tracking-wider hover:border-black transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
