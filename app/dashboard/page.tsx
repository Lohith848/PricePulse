'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Plus, BarChart3, ShoppingCart, AlertCircle, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PriceChart } from '@/components/PriceChart';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/components/PriceChart';

interface DbProduct {
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
}

function dbProductToChartProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name || 'Unknown',
    target_price: p.target_price,
    price_history: [],
  };
}

export default function DashboardPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ url: '', targetPrice: '' });
  const [adding, setAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }
      fetchProducts();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const fetchProducts = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const targetPrice = newProduct.targetPrice ? parseFloat(newProduct.targetPrice) : null;

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: newProduct.url, 
          targetPrice,
          userId: user.id 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add product');
      }

      setNewProduct({ url: '', targetPrice: '' });
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError('Not authenticated');
      return;
    }

    const response = await fetch(`/api/products?productId=${id}&userId=${user.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchProducts();
    } else {
      const result = await response.json();
      setError(result.error || 'Failed to delete product');
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#666666]" />
      </div>
    );
  }

  const activeProducts = products.filter(p => p.is_active);
  const atTargetProducts = products.filter(p => p.current_price && p.target_price && p.current_price <= p.target_price);
  const selectedProduct = selectedId ? products.find(p => p.id === selectedId) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ffffff]">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#222222] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#666666]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#ffffff]">PricePulse</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-[#666666] hover:text-[#aaaaaa] hover:bg-[#1a1a1a] border border-[#222222]"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-[#ffffff] mb-2">Dashboard</h1>
            <p className="text-[#666666]">Monitor your product prices and track savings</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111111] border border-[#222222] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-[#666666]" />
                </div>
                <span className="text-[#666666] text-sm">Active Tracking</span>
              </div>
              <p className="text-3xl font-bold text-[#ffffff]">{activeProducts.length}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#111111] border border-[#222222] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-[#00ff88]" />
                </div>
                <span className="text-[#666666] text-sm">At Target Price</span>
              </div>
              <p className="text-3xl font-bold text-[#00ff88]">{atTargetProducts.length}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#111111] border border-[#222222] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#666666]" />
                </div>
                <span className="text-[#666666] text-sm">Total Monitored</span>
              </div>
              <p className="text-3xl font-bold text-[#ffffff]">{products.length}</p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#111111] border border-[#222222] rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-5 h-5 text-[#666666]" />
              <h2 className="text-lg font-semibold text-[#ffffff]">Add New Product</h2>
            </div>
            <form onSubmit={handleAddProduct} className="flex flex-col sm:flex-row gap-3">
              <Input type="url" placeholder="https://example.com/product-url" value={newProduct.url} onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })} className="bg-[#1a1a1a] border-[#2a2a2a] text-[#ffffff] placeholder-[#444444] h-12" required />
              <Input type="number" placeholder="Target price (optional)" value={newProduct.targetPrice} onChange={(e) => setNewProduct({ ...newProduct, targetPrice: e.target.value })} className="bg-[#1a1a1a] border-[#2a2a22] text-[#ffffff] placeholder-[#444444] h-12 w-40" step="0.01" min="0" />
              <Button type="submit" disabled={adding || !newProduct.url.trim()} className="h-12 bg-[#ffffff] hover:bg-[#e6e6e6] text-black px-6 font-medium whitespace-nowrap">
                {adding ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Adding...</> : 'Add Product'}
              </Button>
            </form>
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-red-400 text-sm mt-3 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="space-y-4">
            {products.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111111] border border-[#222222] rounded-xl p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-[#333333] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#666666] mb-2">No products yet</h3>
                <p className="text-[#444444] text-sm">Add a product URL above to start tracking prices</p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {products.map((product, i) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <ProductCard product={{ ...product, price_history: undefined }} onDelete={handleDelete} onViewChart={(p) => { setSelectedId(p.id); }} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedProduct && <PriceChart product={dbProductToChartProduct(selectedProduct)} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </div>
  );
}