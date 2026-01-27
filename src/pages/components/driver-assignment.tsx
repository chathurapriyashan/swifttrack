import { useState } from 'react';
import { Truck, Phone, Search, Check } from 'lucide-react';
import type { Driver } from '../App';

interface DriverAssignmentProps {
  drivers: Driver[];
  selectedDriver: Driver;
  onSelectDriver: (driver: Driver) => void;
  currentDriverId: number;
}

export function DriverAssignment({ drivers, selectedDriver, onSelectDriver, currentDriverId }: DriverAssignmentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (driver: Driver) => {
    onSelectDriver(driver);
    setShowSearch(false);
    setSearchTerm('');
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-4 h-4" strokeWidth={1.5} />
        <h2 className="text-sm uppercase tracking-wider text-gray-600">Assign Driver</h2>
      </div>

      {/* Current Selection */}
      <div className="border border-gray-300 p-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium">{selectedDriver.name}</p>
              {selectedDriver.id === currentDriverId && (
                <span className="text-xs px-2 py-0.5 bg-black text-white">Current</span>
              )}
              {!selectedDriver.available && (
                <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600">Unavailable</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{selectedDriver.vehicle}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-3 h-3" strokeWidth={1.5} />
              <span>{selectedDriver.phone}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className="text-sm underline hover:no-underline"
          >
            Change
          </button>
        </div>
      </div>

      {/* Driver Search */}
      {showSearch && (
        <div className="border border-black mb-4">
          <div className="relative border-b border-gray-200">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search drivers..."
              className="w-full pl-12 pr-4 py-3 focus:outline-none"
              autoFocus
            />
          </div>

          <div className="max-h-80 overflow-y-auto">
            {filteredDrivers.length > 0 ? (
              <div>
                {filteredDrivers.map((driver) => (
                  <button
                    key={driver.id}
                    type="button"
                    onClick={() => handleSelect(driver)}
                    disabled={!driver.available}
                    className="w-full px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm">{driver.name}</p>
                          {driver.id === selectedDriver.id && (
                            <Check className="w-4 h-4" strokeWidth={2} />
                          )}
                          {driver.id === currentDriverId && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100">Current</span>
                          )}
                          {!driver.available && (
                            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600">Unavailable</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{driver.vehicle}</p>
                        <p className="text-xs text-gray-500">{driver.phone}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                No drivers found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
