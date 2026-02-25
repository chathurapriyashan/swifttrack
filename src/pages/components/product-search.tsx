import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Product } from '../App';

interface ProductSearchProps {
  products: Product[];
  onSelect: (product: Product) => void;
  selectedProductIds: number[];
}

export function ProductSearch({ products, onSelect, selectedProductIds }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div className="border border-black">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 focus:outline-none"
          autoFocus
        />
      </div>

      {/* Results */}
      {searchTerm && (
        <div className="border-t border-gray-200 max-h-80 overflow-y-auto">
          {filteredProducts.length > 0 ? (
            <div>
              {filteredProducts.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => onSelect(product)}
                    className="w-full px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">
                          {product.name}
                          {isSelected && (
                            <span className="ml-2 text-xs text-gray-500">
                              (Added)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                      </div>
                      <p className="text-sm">Rs. {product.price}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
