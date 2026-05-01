'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TrendingUp, TrendingDown, ExternalLink, Trash2, Loader2 } from 'lucide-react';

interface PriceHistoryItem {
  price: number;
  checked_at: string;
}

interface Product {
  id: string;
  url: string;
  name: string;
  image_url: string | null;
  site: string;
  target_price: number | null;
  current_price: number | null;
  last_price: number | null;
  is_active: boolean;
  created_at: string;
  last_checked: string | null;
  price_history?: Array<{ price: number; checked_at: string }>;
}

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onViewChart: (product: Product) => void;
}

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onViewChart: (product: Product) => void;
}

export function ProductCard({ product, onDelete, onViewChart }: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const priceChange = product.last_price && product.current_price
    ? product.current_price - product.last_price
    : null;
  
  const isDrop = priceChange !== null && priceChange < 0;
  const isAtTarget = product.current_price && product.target_price 
    ? product.current_price <= product.target_price 
    : false;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(product.id);
    setIsDeleting(false);
  };

  const siteBadgeColor = {
    ebay: 'bg-blue-600',
    bestbuy: 'bg-blue-500',
    steam: 'bg-gray-800',
  }[product.site] || 'bg-zinc-600';

  return (
    <div className="group relative bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-900/50">
      {/* Price Drop Indicator */}
      {isAtTarget && (
        <div className="absolute top-3 right-3 z-10 bg-[#00ff88] text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          AT TARGET
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-40 bg-zinc-800/50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name || 'Product'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600">
            No Image
          </div>
        )}
        <div className={`absolute top-3 left-3 ${siteBadgeColor} text-white text-xs font-medium px-2 py-0.5 rounded`}>
          {product.site}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name || 'Loading...'}
        </h3>

        {/* Price Display */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-white font-mono">
            ${product.current_price?.toFixed(2) || '--'}
          </span>
          {priceChange !== null && (
            <span className={`flex items-center text-sm font-medium ${isDrop ? 'text-[#00ff88]' : 'text-red-400'}`}>
              {isDrop ? <TrendingDown className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1" />}
              ${Math.abs(priceChange).toFixed(2)}
            </span>
          )}
        </div>

        {/* Target Price */}
        {product.target_price && (
          <div className="text-xs text-zinc-500 mb-3">
            Target: <span className="text-amber-400 font-mono">${product.target_price.toFixed(2)}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewChart(product)}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            Chart
          </button>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}