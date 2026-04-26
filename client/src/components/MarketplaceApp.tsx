import { useState } from 'react';
import { ShoppingCart, Heart, Search, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  seller: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  liked: boolean;
}

export default function MarketplaceApp() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 79.99,
      seller: 'TechStore',
      rating: 4.5,
      reviews: 234,
      image: '🎧',
      category: 'Electronics',
      liked: false,
    },
    {
      id: '2',
      name: 'Laptop Stand',
      price: 34.99,
      seller: 'OfficeGear',
      rating: 4.8,
      reviews: 156,
      image: '💻',
      category: 'Accessories',
      liked: false,
    },
    {
      id: '3',
      name: 'USB-C Cable',
      price: 12.99,
      seller: 'CableHub',
      rating: 4.3,
      reviews: 512,
      image: '🔌',
      category: 'Cables',
      liked: false,
    },
    {
      id: '4',
      name: 'Mechanical Keyboard',
      price: 129.99,
      seller: 'KeyMaster',
      rating: 4.7,
      reviews: 389,
      image: '⌨️',
      category: 'Electronics',
      liked: false,
    },
    {
      id: '5',
      name: 'Mouse Pad',
      price: 19.99,
      seller: 'OfficeGear',
      rating: 4.4,
      reviews: 267,
      image: '🖱️',
      category: 'Accessories',
      liked: false,
    },
    {
      id: '6',
      name: 'Monitor Arm',
      price: 49.99,
      seller: 'TechStore',
      rating: 4.6,
      reviews: 198,
      image: '📺',
      category: 'Accessories',
      liked: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = ['All', 'Electronics', 'Accessories', 'Cables'];

  const filteredProducts = products.filter(product =>
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLike = (productId: string) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, liked: !p.liked } : p
    ));
  };

  const handleAddToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">🛍️ Marketplace</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCart(!showCart)}
            className="relative"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {showCart ? (
          // Shopping Cart View
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Shopping Cart</h3>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-foreground/60">
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{item.image}</div>
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-foreground/60">{item.seller}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold">${item.price}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromCart(index)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90">
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          // Products Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-8 text-4xl flex items-center justify-center">
                  {product.image}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-sm">{product.name}</h3>
                    <p className="text-xs text-foreground/60">{product.seller}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span>{product.rating}</span>
                    <span className="text-foreground/60">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-bold">${product.price}</div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLike(product.id)}
                      className="flex-1"
                    >
                      <Heart className={`w-4 h-4 ${product.liked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-accent hover:bg-accent/90"
                      size="sm"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
