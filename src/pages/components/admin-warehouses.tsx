import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/pages/components/ui/table';
import { Badge } from '@/pages/components/ui/badge';
import { Edit2, Trash2, Plus, Search, MapPin, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/pages/components/ui/dialog';

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  address: string;
  capacity: number;
  currentInventory: number;
  manager: string;
  status: 'active' | 'inactive';
  phone: string;
}

const initialWarehouses: Warehouse[] = [
  {
    id: 1,
    name: 'Downtown Warehouse',
    location: 'New York',
    address: '123 Main St, New York, NY 10001',
    capacity: 5000,
    currentInventory: 3500,
    manager: 'John Manager',
    status: 'active',
    phone: '+1 (555) 111-1111',
  },
  {
    id: 2,
    name: 'West Side Hub',
    location: 'Los Angeles',
    address: '456 West Ave, Los Angeles, CA 90001',
    capacity: 8000,
    currentInventory: 6200,
    manager: 'Jane Supervisor',
    status: 'active',
    phone: '+1 (555) 222-2222',
  },
  {
    id: 3,
    name: 'Central Storage',
    location: 'Chicago',
    address: '789 Central Blvd, Chicago, IL 60601',
    capacity: 4500,
    currentInventory: 2100,
    manager: 'Mike Director',
    status: 'active',
    phone: '+1 (555) 333-3333',
  },
];

export default function AdminWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Warehouse, 'id'>>({
    name: '',
    location: '',
    address: '',
    capacity: 0,
    currentInventory: 0,
    manager: '',
    status: 'active',
    phone: '',
  });

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingWarehouse(null);
    setFormData({
      name: '',
      location: '',
      address: '',
      capacity: 0,
      currentInventory: 0,
      manager: '',
      status: 'active',
      phone: '',
    });
    setShowForm(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      location: warehouse.location,
      address: warehouse.address,
      capacity: warehouse.capacity,
      currentInventory: warehouse.currentInventory,
      manager: warehouse.manager,
      status: warehouse.status,
      phone: warehouse.phone,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingWarehouse) {
      setWarehouses(warehouses.map(w => 
        w.id === editingWarehouse.id 
          ? { ...w, ...formData }
          : w
      ));
    } else {
      const newWarehouse: Warehouse = {
        ...formData,
        id: Math.max(...warehouses.map(w => w.id), 0) + 1,
      };
      setWarehouses([...warehouses, newWarehouse]);
    }
    setShowForm(false);
  };

  const handleDelete = (warehouseId: number) => {
    setWarehouses(warehouses.filter(w => w.id !== warehouseId));
  };

  const getCapacityStatus = (current: number, total: number) => {
    const percentage = (current / total) * 100;
    if (percentage >= 90) return { color: 'bg-red-100 text-red-800', label: 'Critical' };
    if (percentage >= 70) return { color: 'bg-yellow-100 text-yellow-800', label: 'High' };
    return { color: 'bg-green-100 text-green-800', label: 'Normal' };
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Warehouse Management</CardTitle>
              <CardDescription>Manage all warehouse locations and inventory</CardDescription>
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Warehouse
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by warehouse name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.reduce((sum, w) => sum + w.currentInventory, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouses Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.map(warehouse => {
                  const capStatus = getCapacityStatus(warehouse.currentInventory, warehouse.capacity);
                  const utilization = Math.round((warehouse.currentInventory / warehouse.capacity) * 100);
                  return (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">{warehouse.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {warehouse.location}
                        </div>
                      </TableCell>
                      <TableCell>{warehouse.manager}</TableCell>
                      <TableCell>{warehouse.capacity.toLocaleString()} units</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>{warehouse.currentInventory} / {warehouse.capacity}</span>
                          </div>
                          <Badge className={capStatus.color}>
                            {utilization}%
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={warehouse.status === 'active' ? 'default' : 'secondary'}>
                          {warehouse.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(warehouse)}
                            className="flex items-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(warehouse.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Warehouse Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
            <DialogDescription>
              {editingWarehouse ? 'Update warehouse information' : 'Create a new warehouse location'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warehouse Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Warehouse Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City/Region"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full Address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manager Name
              </label>
              <Input
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                placeholder="Manager Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Capacity (units)
              </label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                placeholder="5000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Inventory
              </label>
              <Input
                type="number"
                value={formData.currentInventory}
                onChange={(e) => setFormData({ ...formData, currentInventory: parseInt(e.target.value) || 0 })}
                placeholder="Current Inventory"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingWarehouse ? 'Update Warehouse' : 'Create Warehouse'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
