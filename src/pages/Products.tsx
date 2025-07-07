import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Heart, ShoppingCart, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import serumImage from "@/assets/product-serum.jpg";
import moisturizerImage from "@/assets/product-moisturizer.jpg";
import cleanserImage from "@/assets/product-cleanser.jpg";

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
  category: string;
  skinType: string[];
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
    image: serumImage,
    tags: ["Best Seller", "AI Recommended"],
    description: "Brightening serum with 20% Vitamin C for radiant skin",
    aiMatch: 96,
    category: "Serums",
    skinType: ["Normal", "Oily", "Combination"]
  },
  {
    id: "2",
    name: "Renewal Night Moisturizer",
    brand: "PureSkin",
    price: 5199,
    rating: 4.9,
    reviews: 856,
    image: moisturizerImage,
    tags: ["Premium", "Anti-Aging"],
    description: "Rich moisturizer with retinol and peptides",
    aiMatch: 89,
    category: "Moisturizers",
    skinType: ["Dry", "Normal", "Mature"]
  },
  {
    id: "3",
    name: "Gentle Foam Cleanser",
    brand: "CleanBeauty",
    price: 2299,
    rating: 4.7,
    reviews: 2341,
    image: cleanserImage,
    tags: ["Sensitive Skin", "Daily Use"],
    description: "pH-balanced cleanser for all skin types",
    aiMatch: 92,
    category: "Cleansers",
    skinType: ["All Types"]
  },
  {
    id: "4",
    name: "Advanced Retinol Serum",
    brand: "GlowLab",
    price: 4599,
    rating: 4.6,
    reviews: 932,
    image: serumImage,
    tags: ["Anti-Aging", "Night Use"],
    description: "Powerful retinol formula for fine lines and wrinkles",
    aiMatch: 88,
    category: "Serums",
    skinType: ["Normal", "Dry", "Mature"]
  },
  {
    id: "5",
    name: "Hydrating Face Mask",
    brand: "PureSkin",
    price: 2899,
    rating: 4.5,
    reviews: 654,
    image: moisturizerImage,
    tags: ["Hydrating", "Weekly Use"],
    description: "Intensive hydrating mask with hyaluronic acid",
    aiMatch: 91,
    category: "Treatments",
    skinType: ["Dry", "Dehydrated"]
  },
  {
    id: "6",
    name: "Exfoliating Toner",
    brand: "CleanBeauty",
    price: 1999,
    rating: 4.4,
    reviews: 1203,
    image: cleanserImage,
    tags: ["Exfoliating", "BHA"],
    description: "Gentle exfoliating toner with salicylic acid",
    aiMatch: 85,
    category: "Toners",
    skinType: ["Oily", "Combination", "Acne-Prone"]
  }
];

const categories = ["All", "Serums", "Moisturizers", "Cleansers", "Toners", "Treatments"];
const skinTypes = ["All Types", "Normal", "Oily", "Dry", "Combination", "Sensitive", "Mature", "Acne-Prone"];
const priceRanges = [
  { label: "Under ₹2,000", min: 0, max: 2000 },
  { label: "₹2,000 - ₹4,000", min: 2000, max: 4000 },
  { label: "₹4,000 - ₹6,000", min: 4000, max: 6000 },
  { label: "Above ₹6,000", min: 6000, max: Infinity }
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkinType, setSelectedSkinType] = useState("All Types");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("ai-match");

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSkinType = selectedSkinType === "All Types" || product.skinType.includes(selectedSkinType);
    const matchesPrice = selectedPriceRanges.length === 0 || 
                        selectedPriceRanges.some(range => {
                          const priceRange = priceRanges.find(r => r.label === range);
                          return priceRange && product.price >= priceRange.min && product.price <= priceRange.max;
                        });
    
    return matchesSearch && matchesCategory && matchesSkinType && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "ai-match":
      default:
        return b.aiMatch - a.aiMatch;
    }
  });

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

  const handlePriceRangeChange = (range: string, checked: boolean) => {
    setSelectedPriceRanges(prev => 
      checked ? [...prev, range] : prev.filter(r => r !== range)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Premium Skincare
              </span>
              <br />
              Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover scientifically-backed skincare solutions tailored to your unique needs
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-card shadow-elevated sticky top-24">
              <h3 className="text-xl font-semibold mb-6">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Skin Type Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Skin Type</label>
                <Select value={selectedSkinType} onValueChange={setSelectedSkinType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skinTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="space-y-3">
                  {priceRanges.map(range => (
                    <div key={range.label} className="flex items-center space-x-2">
                      <Checkbox
                        id={range.label}
                        checked={selectedPriceRanges.includes(range.label)}
                        onCheckedChange={(checked) => handlePriceRangeChange(range.label, checked as boolean)}
                      />
                      <label htmlFor={range.label} className="text-sm cursor-pointer">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedSkinType("All Types");
                  setSelectedPriceRanges([]);
                }}
              >
                Clear All Filters
              </Button>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} products
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-match">AI Match</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-elevated transition-smooth overflow-hidden bg-gradient-card animate-fade-in">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-spring"
                    />
                    
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-primary text-primary-foreground font-semibold animate-pulse-glow">
                        {product.aiMatch}% AI Match
                      </Badge>
                    </div>
                    
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
                    
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {product.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <h3 className="font-semibold leading-tight">{product.name}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => addToCart(product.id)}
                        variant={cart.has(product.id) ? "secondary" : "premium"}
                        className="gap-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        {cart.has(product.id) ? 'Added' : 'Add'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedSkinType("All Types");
                    setSelectedPriceRanges([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;