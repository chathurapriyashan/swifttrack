import { Minus, Plus, X } from 'lucide-react';
import type { SelectedProduct } from '../App';

interface SelectedProductsProps {
  products: SelectedProduct[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export function SelectedProducts({ products, onUpdateQuantity, onRemove }: SelectedProductsProps) {
  return (
    <div className="border border-gray-200">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`flex items-center gap-4 p-4 ${
            index < products.length - 1 ? 'border-b border-gray-200' : ''
          }`}
        >
          {/* Product Info */}
          <div className="flex-1">
            <p className="text-sm mb-1">{product.name}</p>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}
              className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-3 h-3" strokeWidth={2} />
            </button>
            <span className="w-8 text-center text-sm">{product.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
              className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-3 h-3" strokeWidth={2} />
            </button>
          </div>

          {/* Price */}
          <div className="w-24 text-right text-sm">
            ${(product.price * product.quantity).toFixed(2)}
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(product.id)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            title="Remove product"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      ))}
    </div>
  );
}
