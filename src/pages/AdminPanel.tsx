import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/components/ui/tabs';
import AdminUsers from './components/admin-users';
import AdminWarehouses from './components/admin-warehouses';
import AdminOrders from './components/admin-orders';
import AdminProducts from './components/admin-products';
import AdminSidebar from './components/AdminSidebar';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex flex-col w-full">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, warehouses, products, and track all orders</p>
            </div>

            {/* Tabs */}
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-6">
                <AdminUsers />
              </TabsContent>

              <TabsContent value="warehouses" className="mt-6">
                <AdminWarehouses />
              </TabsContent>

              <TabsContent value="products" className="mt-6">
                <AdminProducts />
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <AdminOrders />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
