import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Zap, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingProduct from '@/components/3d/FloatingProduct';

const EnhancedHero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="bg-gradient-primary text-white px-4 py-2 text-sm font-medium border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Skincare Revolution
              </Badge>
            </motion.div>

            {/* Main Headlines */}
            <div className="space-y-4">
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-gradient-primary block">Discover Your</span>
                <span className="text-foreground block">Perfect Glow</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience the future of skincare with our AI-powered recommendations, 
                premium formulations, and personalized beauty solutions.
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-xl border border-border/50">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Analysis</h3>
                  <p className="text-xs text-muted-foreground">Smart recommendations</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-xl border border-border/50">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Premium Quality</h3>
                  <p className="text-xs text-muted-foreground">Clinical-grade formulas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-xl border border-border/50">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Dermatologist Tested</h3>
                  <p className="text-xs text-muted-foreground">Safe & effective</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-xl border border-border/50">
                <div className="w-10 h-10 bg-gradient-serum rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Visible Results</h3>
                  <p className="text-xs text-muted-foreground">30-day guarantee</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/analysis">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity group px-8 py-4 text-lg">
                  Start AI Analysis
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/products">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-primary/30 hover:bg-primary/5 px-8 py-4 text-lg"
                >
                  Shop Products
                </Button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              className="flex items-center gap-6 pt-8 border-t border-border/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
            </motion.div>
          </motion.div>

          {/* 3D Product Showcase */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative z-10">
              <FloatingProduct color="#e91e63" text="GLOW" />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
            
            {/* Product Highlights */}
            <motion.div 
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Live AI Analysis
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="text-sm font-medium">
                <div className="text-primary font-bold">96% Match</div>
                <div className="text-xs text-muted-foreground">For your skin</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="text-sm font-medium">Scroll to explore</div>
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-current to-transparent animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
};

export default EnhancedHero;