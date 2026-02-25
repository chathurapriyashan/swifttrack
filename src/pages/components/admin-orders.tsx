import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/pages/components/ui/table';
import { Badge } from '@/pages/components/ui/badge';
import { Eye, Search, Filter, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/pages/components/ui/dialog';

export interface Order {
  order_id: number;
  client_id: number;
  client_name: string;
  delivery_address: string;
//   deliveryDate: string;
//   items: number;
//   totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   destination: string;
//   warehouse: string;
//   driver?: string;
}



async function loadInitialOrders(){
    try{

        const user = await fetch("http://10.23.1.254:3000/api/orders");
        if(user.ok){
            const data = await user.json();
            console.log(data)
            return data as Order[];
        }else{
            throw new Error("Failed to fetch orders: " + user.statusText);
        }               
    }catch(error){
        console.error("Error fetching orders:", error);
        return [];
    }
}





export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);




    useEffect(() => {
        loadInitialOrders().then(data => {
            setOrders(data);
        });
    }, [])






  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.order_id === parseInt(searchTerm) ||
      order.client_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      order.delivery_address?.toLowerCase()?.includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <TrendingUp className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats
  const stats = {
    total: orders?.length,
    pending: orders?.filter(o => o.status === 'pending').length,
    processing: orders?.filter(o => o.status === 'processing').length,
    shipped: orders?.filter(o => o.status === 'shipped').length,
    delivered: orders?.filter(o => o.status === 'delivered').length,
    cancelled: orders?.filter(o => o.status === 'cancelled').length,
    // totalRevenue: orders?.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o?.totalAmount || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>View and manage all orders across the system</CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.processing}</div>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.shipped}</div>
              <p className="text-sm text-gray-600">Shipped</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">${stats?.totalRevenue?.toFixed(2) || 0}</div>
              <p className="text-sm text-gray-600">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by order ID, client name, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              <Button
                variant={statusFilter === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'processing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('processing')}
              >
                Processing
              </Button>
              <Button
                variant={statusFilter === 'shipped' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('shipped')}
              >
                Shipped
              </Button>
              <Button
                variant={statusFilter === 'delivered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('delivered')}
              >
                Delivered
              </Button>
              <Button
                variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('cancelled')}
              >
                Cancelled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Client</TableHead>
                  {/* <TableHead>Items</TableHead> */}
                  {/* <TableHead>Amount</TableHead> */}
                  {/* <TableHead>Order Date</TableHead> */}
                  {/* <TableHead>Delivery Date</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders?.map(order => (
                  <TableRow key={order.order_id}>
                    <TableCell className="font-medium">{order.order_id}</TableCell>
                    <TableCell>{order.client_name}</TableCell>
                    {/* <TableCell>{order.items}</TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>{order.order_date}</TableCell>
                    <TableCell>{order.delivery_date}</TableCell> */}
                    <TableCell>
                      <Badge className={getStatusColor(order.status)} variant="outline">
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedOrder?.id}</DialogTitle>
            <DialogDescription>Order Details</DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-semibold">{selectedOrder.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{selectedOrder.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delivery Date</p>
                  <p className="font-semibold">{selectedOrder.deliveryDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Items</p>
                  <p className="font-semibold">{selectedOrder.items}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold">${selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-semibold">{selectedOrder.destination}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Warehouse</p>
                <p className="font-semibold">{selectedOrder.warehouse}</p>
              </div>

              {selectedOrder.driver && (
                <div>
                  <p className="text-sm text-gray-600">Driver</p>
                  <p className="font-semibold">{selectedOrder.driver}</p>
                </div>
              )}

              <Button onClick={() => setShowDetails(false)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
