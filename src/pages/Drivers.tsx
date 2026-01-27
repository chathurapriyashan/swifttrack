import { useState } from 'react';
import { DriversHeader } from './components/drivers-header';
import { DriversList } from './components/drivers-list';
import { DriverForm } from './components/driver-form';
import { DeleteConfirmation } from './components/delete-confirmation';
import WareHouseSidebar from './components/WareHouseSideBar';
import { SidebarProvider } from '../components/ui/sidebar';



export interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
  available: boolean;
  license: string;
  email: string;
}

// Mock initial drivers
const initialDrivers: Driver[] = [
  { 
    id: 1, 
    name: 'Michael Chen', 
    phone: '+1 (555) 123-4567', 
    vehicle: 'Toyota Prius - ABC 123', 
    available: true,
    license: 'DL-1234567',
    email: 'michael.chen@delivery.com'
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    phone: '+1 (555) 234-5678', 
    vehicle: 'Honda Civic - XYZ 789', 
    available: true,
    license: 'DL-2345678',
    email: 'sarah.johnson@delivery.com'
  },
  { 
    id: 3, 
    name: 'David Martinez', 
    phone: '+1 (555) 345-6789', 
    vehicle: 'Tesla Model 3 - DEF 456', 
    available: true,
    license: 'DL-3456789',
    email: 'david.martinez@delivery.com'
  },
  { 
    id: 4, 
    name: 'Emily Rodriguez', 
    phone: '+1 (555) 456-7890', 
    vehicle: 'Ford Transit - GHI 012', 
    available: false,
    license: 'DL-4567890',
    email: 'emily.rodriguez@delivery.com'
  },
  { 
    id: 5, 
    name: 'James Wilson', 
    phone: '+1 (555) 567-8901', 
    vehicle: 'Nissan Leaf - JKL 345', 
    available: true,
    license: 'DL-5678901',
    email: 'james.wilson@delivery.com'
  },
];

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);

  const handleCreateDriver = () => {
    setEditingDriver(null);
    setShowForm(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleSaveDriver = (driverData: Omit<Driver, 'id'>) => {
    if (editingDriver) {
      // Update existing driver
      setDrivers(drivers.map(d => 
        d.id === editingDriver.id 
          ? { ...driverData, id: editingDriver.id }
          : d
      ));
    } else {
      // Create new driver
      const newDriver: Driver = {
        ...driverData,
        id: Math.max(...drivers.map(d => d.id), 0) + 1
      };
      setDrivers([...drivers, newDriver]);
    }
    setShowForm(false);
    setEditingDriver(null);
  };

  const handleDeleteDriver = (driver: Driver) => {
    setDeletingDriver(driver);
  };

  const confirmDelete = () => {
    if (deletingDriver) {
      setDrivers(drivers.filter(d => d.id !== deletingDriver.id));
      setDeletingDriver(null);
    }
  };

  const handleToggleAvailability = (driverId: number) => {
    setDrivers(drivers.map(d =>
      d.id === driverId ? { ...d, available: !d.available } : d
    ));
  };

  return <SidebarProvider>
        <WareHouseSidebar />
        <main className="flex flex-col w-full">
          <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <DriversHeader 
          onCreateDriver={handleCreateDriver}
          totalDrivers={drivers.length}
          availableDrivers={drivers.filter(d => d.available).length}
          />
        
        <div className="mt-12">
          {showForm ? (
            <DriverForm
            driver={editingDriver}
            onSave={handleSaveDriver}
            onCancel={() => {
              setShowForm(false);
              setEditingDriver(null);
            }}
            />
          ) : (
            <DriversList
            drivers={drivers}
            onEdit={handleEditDriver}
            onDelete={handleDeleteDriver}
            onToggleAvailability={handleToggleAvailability}
            />
          )}
        </div>

        {deletingDriver && (
          <DeleteConfirmation
          driver={deletingDriver}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingDriver(null)}
          />
        )}
      </div>
    </div>
        </main>
      </SidebarProvider>

}
