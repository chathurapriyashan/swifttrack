import { useEffect, useState } from 'react';
import { OrderCreateHeader } from './components/order-create-header';
import { ProductSearch } from './components/product-search';
import { SelectedProducts } from './components/selected-products';
import { DeliveryForm } from './components/delivery-form';
import { OrderSummary } from './components/order-summary';
import { Plus } from 'lucide-react';
import { Bounce, ToastContainer, toast } from 'react-toastify';


export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  status: 'active' | 'inactive' | 'discontinued';
  dateAdded: string;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Apple',
    sku: 'APL-001',
    category: 'Fruits',
    price: 0.5,
    quantity: 100,
    supplier: 'Fresh Farms',
    status: 'active',
    dateAdded: '2024-01-15'}
];



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

export interface SelectedProduct extends Product {
  quantity: number;
}



// Mock product database
  
export default function CreateOrderFrom() {
  const [availableProducts, setAvailableProducts] = useState<Product[]>(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [orderName, setOrderName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [showSearch, setShowSearch] = useState(false);

  // console.log(selectedProducts , orderName , deliveryAddress , showSearch);


  async function createOrder(selectedProducts , orderName , deliveryAddress , total ) {

    const response = await fetch("http://10.23.1.254:3000/api/orders/new" , {
      method:"POST" , 
      headers:{
        "Content-Type" : "application/json",
      },
      body : JSON.stringify({
          client_id : 1 , 
          products: selectedProducts.map(product=>({id: product.id , quantity: product.quantity})),
          client_name : orderName , 
          delivery_address : `${deliveryAddress.street} , ${deliveryAddress.city} , ${deliveryAddress.state} , ${deliveryAddress.zip}`,
      })
    })

    if(response.ok){
      const data = await response.json();
      if(data.status == "success"){
        alert("Order created successfully!");
        toast.success('🦄 Wow so easy!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            });
        setOrderName('');
        setDeliveryAddress({
          street: '',
          city: '',
          state: '',
          zip: ''
        });
        setSelectedProducts([]);
      }
    }else{
      alert("Failed to create order!");
      toast.error("Failed to create order!");
    }
}



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

    // createOrder(selectedProducts , orderName , deliveryAddress , total).then(()=>{
    //   setOrderName('');
    //   setDeliveryAddress({
    //     street: '',
    //     city: '',
    //     state: '',
    //     zip: ''
    //   });
    //   setSelectedProducts([]);
    // })
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await loadInitialProducts();
      setAvailableProducts(products);
    };

    fetchProducts();
  }, []);

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
              onClick={()=>createOrder(selectedProducts , orderName , deliveryAddress , total)}
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
