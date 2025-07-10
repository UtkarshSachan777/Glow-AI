import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";
// import serumImage from "@/assets/product-serum.jpg";
// import moisturizerImage from "@/assets/product-moisturizer.jpg";
// import cleanserImage from "@/assets/product-cleanser.jpg";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  description: string;
  aiMatch: number;
}

const products: Product[] = [
  {
    id: "1",
    name: "Hydrating Vitamin C Serum",
    brand: "GlowLab",
    price: 3999,
    originalPrice: 5399,
    rating: 4.8,
    reviews: 1247,
    image: "/api/placeholder/300/300",
    tags: ["Best Seller", "AI Recommended"],
    description: "Brightening serum with 20% Vitamin C for radiant skin",
    aiMatch: 96
  },
  {
    id: "2",
    name: "Renewal Night Moisturizer",
    brand: "PureSkin",
    price: 5199,
    rating: 4.9,
    reviews: 856,
    image: "/api/placeholder/300/300",
    tags: ["Premium", "Anti-Aging"],
    description: "Rich moisturizer with retinol and peptides",
    aiMatch: 89
  },
  {
    id: "3",
    name: "Gentle Foam Cleanser",
    brand: "CleanBeauty",
    price: 2299,
    rating: 4.7,
    reviews: 2341,
    image: "/api/placeholder/300/300",
    tags: ["Sensitive Skin", "Daily Use"],
    description: "pH-balanced cleanser for all skin types",
    aiMatch: 92
  },
  {
    id: "4",
    name: "Niacinamide Pore Refiner",
    brand: "GlowLab",
    price: 2799,
    rating: 4.6,
    reviews: 678,
    image: "/api/placeholder/300/300",
    tags: ["Pore Care", "Oil Control"],
    description: "10% Niacinamide for minimized pores",
    aiMatch: 85
  },
  {
    id: "5",
    name: "Peptide Recovery Cream",
    brand: "PureSkin",
    price: 6499,
    originalPrice: 7999,
    rating: 4.9,
    reviews: 432,
    image: "/api/placeholder/300/300",
    tags: ["Luxury", "Repair"],
    description: "Advanced peptide complex for skin repair",
    aiMatch: 94
  },
  {
    id: "6",
    name: "Micellar Water Cleanser",
    brand: "CleanBeauty",
    price: 1899,
    rating: 4.5,
    reviews: 1890,
    image: "/api/placeholder/300/300",
    tags: ["Makeup Remover", "Travel Size"],
    description: "Gentle micellar water for makeup removal",
    aiMatch: 78
  }
];

const ProductGrid = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const addToCart = (productId: string) => {
    setCart(prev => new Set(prev).add(productId));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI-Curated
            </span>{" "}
            Products for You
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI has analyzed thousands of products to find the perfect matches for your skin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-elevated transition-smooth overflow-hidden bg-gradient-card">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-spring"
                />
                
                {/* AI Match Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-primary text-primary-foreground font-semibold">
                    {product.aiMatch}% AI Match
                  </Badge>
                </div>
                
                {/* Favorite Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart 
                    className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                  />
                </Button>
                
                {/* Tags */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {product.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product.id)}
                    variant={cart.has(product.id) ? "secondary" : "premium"}
                    className="gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cart.has(product.id) ? 'Added' : 'Add to Cart'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;