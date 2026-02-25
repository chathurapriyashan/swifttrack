import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/pages/components/ui/table';
import { Badge } from '@/pages/components/ui/badge';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/pages/components/ui/dialog';

export interface Product {
  id: number;
  name: string;

  price: number | string;
  quantity: number;
  status: 'active' | 'inactive' | 'discontinued';
}

const initialProducts: Product[] = [];




async function loadInitialProducts(){
    try{

        const user = await fetch("http://10.23.1.254:3000/api/products");
        if(user.ok){
            const data = await user.json();
            console.log(data)
            return data as Product[];
        }else{
            throw new Error("Failed to fetch products: " + user.statusText);
        }               
    }catch(error){
        console.error("Error fetching products:", error);
        return [];
    }
}
async function deleteProduct({productId}: {productId: number}){
    try{

        const user = await fetch(`http://10.23.1.254:3000/api/products/${productId}` , {
            method:"DELETE"
        });
        if(user.ok){

            return [];
        }else{
            throw new Error("Failed to delete products: " + user.statusText);
        }               
    }catch(error){
        console.error("Error deleting products:", error);
        return [];
    }
}


async function createProduct(productData: Omit<Product, 'id'>) {
    console.log('Creating product:', productData);
  
    try {
      const response = await fetch("http://10.23.1.254:3000/api/products/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Product created successfully:", data);
        return data as Product;
      } else {
        const errorData = await response.json();
        console.error("Failed to create product:", errorData);
        throw new Error("Failed to create product: " + response.statusText);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }



export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    sku: '',
    category: '',
    price: 0,
    quantity: 0,
    supplier: '',
    status: 'active',
    dateAdded: new Date().toISOString().split('T')[0],
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      quantity: 0,
      status: 'active',
    });
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      status: product.status,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData }
          : p
      ));
    } else {
        const newProduct: Product = {
        ...formData,
        id: Math.max(...products.map(p => p.id), 0) + 1,
      };
      setProducts([...products, newProduct]);
      const { name, price, quantity} = newProduct;
      createProduct({
          name, price : String(price), quantity,
          status: 'active'
      }).catch(error => {   
        alert("Failed to create product: " + error.message);
      });
    
    
    }
    setShowForm(false);
  };

  const handleDelete = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
    deleteProduct({productId}).catch(error => {
        alert("Failed to delete product: " + error.message);
      });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: 'text-red-600', label: 'Out of Stock' };
    if (quantity < 20) return { color: 'text-orange-600', label: 'Low Stock' };
    return { color: 'text-green-600', label: 'In Stock' };
  };

  // Calculate stats
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    lowStock: products.filter(p => p.quantity < 20 && p.quantity > 0).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
  };

  useEffect(() => {
    loadInitialProducts().then(fetchedProducts => {
        console.log("Fetched products:", fetchedProducts);
      setProducts(fetchedProducts);
    });
  }, []);


  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage all products and inventory</CardDescription>
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeProducts}</div>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
              <p className="text-sm text-gray-600">Out of Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Rs.{stats.totalValue.toFixed(2)}</div>
              <p className="text-sm text-gray-600">Inventory Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by product name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => {
                  const stockStatus = getStockStatus(product.quantity);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>Rs. {product.price}</TableCell>
                        <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="flex items-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
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

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product information' : 'Create a new product'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product Name"
              />
            </div>
            
            
            
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            
            
            
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Product['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div> */}
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingProduct ? 'Update Product' : 'Create Product'}
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
