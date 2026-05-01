'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Package, Bell, Mail, TrendingDownIcon, TrendingUpIcon, BarChart3, Shield, Zap, ArrowRight, Monitor, ShoppingCart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-[#00ff88]" />,
      title: 'Real-Time Monitoring',
      description: '24/7 automated price tracking across 100+ e-commerce platforms',
    },
    {
      icon: <Bell className="w-8 h-8 text-[#00ff88]" />,
      title: 'Instant Alerts',
      description: 'Discord and email notifications when prices hit your target',
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-[#00ff88]" />,
      title: 'Price History',
      description: 'Interactive charts showing price trends and savings opportunities',
    },
    {
      icon: <Shield className="w-8 h-8 text-[#00ff88]" />,
      title: 'Secure & Private',
      description: 'Bank-grade encryption with zero data selling',
    },
  ];

  const supportedSites = [
    { name: 'eBay', color: '#0064D6' },
    { name: 'Best Buy', color: '#0044CC' },
    { name: 'Amazon', color: '#FF9900' },
    { name: 'Steam', color: '#191817' },
    { name: 'Walmart', color: '#0072DD' },
    { name: 'Target', color: '#CC0000' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center">
              <Package className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">PricePulse</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
            <a href="#supported" className="text-gray-400 hover:text-white transition-colors">Supported</a>
          </div>
          <Button variant="outline" className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-black">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.15)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6 bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20">
              <Zap className="w-3 h-3 mr-2" />
              BETA NOW LIVE
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Stop <span className="text-[#00ff88]">Overpaying</span>. Start
              <br />
              <span className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">Smart Tracking</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Monitor prices across eBay, Best Buy, Steam and more. Get instant alerts 
              when items drop below your target price. Save money, effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
              <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 rounded-xl px-6 py-3 w-full sm:w-96">
                <Input
                  placeholder="Enter product URL or name..."
                  className="border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 px-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button size="icon" className="bg-[#00ff88] hover:bg-[#00cc6a] text-black border-0">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                Live tracking
              </div>
              <div>1,247 products monitored</div>
              <div>$42,850 saved this month</div>
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 60 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <Card className="bg-[#1a1a1a] border-white/10 rounded-3xl overflow-hidden">
              <div className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#00ff88] animate-pulse" />
                  <span className="text-sm text-gray-400">pricepulse.dev/monitor</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#444]" />
                  <div className="w-3 h-3 rounded-full bg-[#444]" />
                  <div className="w-3 h-3 rounded-full bg-[#444]" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img src="https://i.ebayimg.com/images/g/test/s-l1600.jpg" alt="Product" className="w-20 h-20 rounded-xl object-cover bg-[#222]" />
                  <div>
                    <h3 className="font-semibold text-lg">iPhone 15 Pro Max 256GB</h3>
                    <p className="text-gray-500 text-sm">eBay • Electronics</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#0a0a0a] rounded-xl p-4">
                    <p className="text-gray-500 text-sm">Current Price</p>
                    <p className="text-2xl font-bold text-[#00ff88]">$899</p>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-xl p-4">
                    <p className="text-gray-500 text-sm">Your Target</p>
                    <p className="text-2xl font-bold text-[#00cc6a]">$850</p>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-xl p-4">
                    <p className="text-gray-500 text-sm">You Save</p>
                    <p className="text-2xl font-bold text-[#00ff88]">$50</p>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] w-4/5 rounded-full" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful tools to help you save money without lifting a finger
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-[#00ff88]/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-4 group-hover:bg-[#00ff88]/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Sites */}
      <section id="supported" className="py-24 relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20">
              Supported
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Major Retailers</h2>
            <p className="text-xl text-gray-400">
              Track prices across the biggest online stores
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {supportedSites.map((site) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-[#1a1a1a] border border-white/5 rounded-xl px-6 py-3"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: site.color }} />
                <span className="font-medium">{site.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#00ff88]" />
              </div>
              <div>
                <h3 className="font-semibold">Price History Visualizations</h3>
                <p className="text-sm text-gray-400">Interactive charts showing price trends</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              See how prices have changed over time with beautiful, interactive charts. 
              Set custom alerts and never miss a deal.
            </p>
            <Badge variant="outline" className="bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30">
              Real-time updates
            </Badge>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge variant="secondary" className="mb-6 bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20">
            Ready to start saving?
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join thousands of smart shoppers
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Start monitoring prices today. No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button size="lg" className="bg-[#00ff88] hover:bg-[#00cc6a] text-black px-8 py-6 text-lg">
              Start For Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-6">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center">
                <Package className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight">PricePulse</span>
            </div>
            <p className="text-gray-500 text-sm">
              2026 PricePulse. Build with 💚 for smart shoppers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
