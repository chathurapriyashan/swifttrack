import { useState } from 'react';
import { OrderCreateHeader } from './components/order-create-header';
import { ProductSearch } from './components/product-search';
import { SelectedProducts } from './components/selected-products';
import { DeliveryForm } from './components/delivery-form';
import { OrderSummary } from './components/order-summary';
import { Plus } from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface SelectedProduct extends Product {
  quantity: number;
}

// Mock product database
const availableProducts: Product[] = [
  { id: 1, name: 'Organic Avocados', price: 12.99, category: 'Produce' },
  { id: 2, name: 'Sourdough Bread', price: 8.50, category: 'Bakery' },
  { id: 3, name: 'Free Range Eggs (Dozen)', price: 6.99, category: 'Dairy' },
  { id: 4, name: 'Almond Milk', price: 5.33, category: 'Dairy' },
  { id: 5, name: 'Fresh Spinach', price: 3.99, category: 'Produce' },
  { id: 6, name: 'Greek Yogurt', price: 4.99, category: 'Dairy' },
  { id: 7, name: 'Whole Grain Pasta', price: 3.49, category: 'Pantry' },
  { id: 8, name: 'Olive Oil', price: 14.99, category: 'Pantry' },
  { id: 9, name: 'Cherry Tomatoes', price: 4.49, category: 'Produce' },
  { id: 10, name: 'Fresh Mozzarella', price: 6.99, category: 'Dairy' },
  { id: 11, name: 'Organic Chicken Breast', price: 12.99, category: 'Meat' },
  { id: 12, name: 'Wild Salmon Fillet', price: 18.99, category: 'Seafood' },
  { id: 13, name: 'Quinoa', price: 7.99, category: 'Pantry' },
  { id: 14, name: 'Kale', price: 3.49, category: 'Produce' },
  { id: 15, name: 'Blueberries', price: 5.99, category: 'Produce' },
];

export default function CreateOrderFrom() {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [orderName, setOrderName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [showSearch, setShowSearch] = useState(false);

  const addProduct = (product: Product) => {
    const existing = selectedProducts.find(p => p.id === product.id);
    if (existing) {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    setShowSearch(false);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
    } else {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === productId ? { ...p, quantity } : p
      ));
    }
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const subtotal = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const tax = subtotal * 0.08;
  const deliveryFee = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', {
      orderName,
      deliveryAddress,
      selectedProducts,
      total
    });
    alert('Order created successfully!');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <OrderCreateHeader />
        
        <form onSubmit={handleSubmit} className="mt-12 space-y-12">
          {/* Order Name */}
          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-600 mb-3">
              Order Name
            </label>
            <input
              type="text"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              placeholder="e.g., Weekly Groceries"
              required
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {/* Delivery Address */}
          <DeliveryForm
            address={deliveryAddress}
            onChange={setDeliveryAddress}
          />

          {/* Products Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm uppercase tracking-wider text-gray-600">Products</h2>
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Add Product
              </button>
            </div>

            {showSearch && (
              <div className="mb-6">
                <ProductSearch
                  products={availableProducts}
                  onSelect={addProduct}
                  selectedProductIds={selectedProducts.map(p => p.id)}
                />
              </div>
            )}

            {selectedProducts.length > 0 ? (
              <SelectedProducts
                products={selectedProducts}
                onUpdateQuantity={updateQuantity}
                onRemove={removeProduct}
              />
            ) : (
              <div className="border border-gray-200 p-12 text-center">
                <p className="text-gray-400">No products added yet</p>
                <p className="text-sm text-gray-400 mt-1">Click "Add Product" to start building your order</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {selectedProducts.length > 0 && (
            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              deliveryFee={deliveryFee}
              total={total}
            />
          )}

          {/* Submit Button */}
          <div className="border-t border-black pt-8">
            <button
              type="submit"
              disabled={selectedProducts.length === 0}
              className="w-full bg-black text-white py-4 uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
