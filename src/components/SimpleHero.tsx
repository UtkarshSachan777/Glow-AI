import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SimpleHero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* AI Badge */}
          <Badge className="bg-rose-500 text-white px-4 py-2 text-sm font-medium border-0 mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Skincare Revolution
          </Badge>

          {/* Main Headlines */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent block">
              Discover Your
            </span>
            <span className="text-gray-900 block">Perfect Glow</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
            Experience the future of skincare with our AI-powered recommendations, 
            premium formulations, and personalized beauty solutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/analysis">
              <Button size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 text-lg">
                Start AI Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/products">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-rose-200 hover:bg-rose-50 px-8 py-4 text-lg"
              >
                Shop Products
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-500">50K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-500">4.9★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-500">100+</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleHero;