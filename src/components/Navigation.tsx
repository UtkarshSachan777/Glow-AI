import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Heart, ShoppingCart, User, Star } from "lucide-react";

const Navigation = () => {
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(7);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              GlowAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-smooth">Home</a>
            <a href="/products" className="text-foreground hover:text-primary transition-smooth">Products</a>
            <a href="/analysis" className="text-foreground hover:text-primary transition-smooth">AI Analysis</a>
            <a href="/about" className="text-foreground hover:text-primary transition-smooth">About</a>
            <a href="/contact" className="text-foreground hover:text-primary transition-smooth">Contact</a>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-muted/50 rounded-full px-4 py-2 max-w-md flex-1 mx-8">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Search products, ingredients..."
              className="bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search (Mobile) */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* User Account */}
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <div className="flex flex-col space-y-1">
                    <div className="w-4 h-0.5 bg-foreground"></div>
                    <div className="w-4 h-0.5 bg-foreground"></div>
                    <div className="w-4 h-0.5 bg-foreground"></div>
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="space-y-4">
                    <a href="#" className="block text-lg font-medium hover:text-primary transition-smooth">Home</a>
                    <a href="#" className="block text-lg font-medium hover:text-primary transition-smooth">Products</a>
                    <a href="#" className="block text-lg font-medium hover:text-primary transition-smooth">AI Analysis</a>
                    <a href="#" className="block text-lg font-medium hover:text-primary transition-smooth">Routines</a>
                    <a href="#" className="block text-lg font-medium hover:text-primary transition-smooth">About</a>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="flex items-center bg-muted/50 rounded-full px-4 py-2 mb-4">
                      <Search className="w-4 h-4 text-muted-foreground mr-2" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="bg-transparent outline-none placeholder:text-muted-foreground flex-1"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Button variant="premium" className="w-full">
                        Start AI Analysis
                      </Button>
                      <Button variant="outline" className="w-full">
                        Sign In / Register
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;