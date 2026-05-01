'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { X } from 'lucide-react';

interface PriceHistoryItem {
  price: number;
  checked_at: string;
}

export interface Product {
  id: string;
  name: string;
  target_price: number | null;
  price_history: PriceHistoryItem[];
}

interface PriceChartProps {
  product: Product;
  onClose: () => void;
}

export function PriceChart({ product, onClose }: PriceChartProps) {
  const chartData = useMemo(() => {
    if (!product.price_history || product.price_history.length === 0) {
      return [];
    }
    return product.price_history
      .slice()
      .sort((a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime())
      .map((item) => ({
        date: new Date(item.checked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: item.price,
        timestamp: new Date(item.checked_at).getTime(),
      }));
  }, [product.price_history]);

  const minPrice = useMemo(() => Math.min(...chartData.map((d) => d.price)) * 0.95, [chartData]);
  const maxPrice = useMemo(() => Math.max(...chartData.map((d) => d.price)) * 1.05, [chartData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">{product.name}</h2>
            <p className="text-sm text-zinc-500">Price History</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Chart */}
        <div className="p-6 h-[400px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12}
                  tickLine={false}
                  domain={[minPrice, maxPrice]}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #3f3f46',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  labelStyle={{ color: '#a1a1aa' }}
                   formatter={(value: ValueType | undefined) => [`$${value ? Number(value).toFixed(2) : '0.00'}`, 'Price']}
                />
                <Legend />
                {product.target_price && (
                  <ReferenceLine
                    y={product.target_price}
                    stroke="#fbbf24"
                    strokeDasharray="5 5"
                    label={{ value: 'Target', fill: '#fbbf24', fontSize: 12 }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#00ff88"
                  strokeWidth={2}
                  dot={{ fill: '#00ff88', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#00ff88' }}
                  name="Price"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500">
              No price history available
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="px-6 pb-6 grid grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Current</div>
            <div className="text-xl font-bold text-white font-mono">
              ${chartData[chartData.length - 1]?.price.toFixed(2) || '--'}
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Lowest</div>
            <div className="text-xl font-bold text-[#00ff88] font-mono">
              ${Math.min(...chartData.map((d) => d.price)).toFixed(2)}
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Target</div>
            <div className="text-xl font-bold text-amber-400 font-mono">
              ${product.target_price?.toFixed(2) || '--'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}