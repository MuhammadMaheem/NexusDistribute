'use client';

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/store/cart-store";

interface Product {
  id: string;
  name: string;
  description: string | null;
  unit: string;
  currentPrice: number;
  imageUrl: string | null;
  stockQuantity: number;
  minOrderQty: number;
  category: { name: string } | null;
}

export function ProductCard({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(product.minOrderQty);
  const addItem = useCart((state) => state.addItem);
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    // Success toast or feedback could be added here
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/20">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.category && (
            <Badge variant="default" className="bg-background/80 backdrop-blur-md border-border/50 text-[10px] font-bold uppercase tracking-wider">
              {product.category.name}
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="error" className="text-[10px] uppercase font-bold">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick View Button (Glassmorphism) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <Button variant="glass" size="sm" className="rounded-full bg-background/20 backdrop-blur-xl border-white/20 text-white hover:bg-background/40">
             <Info className="h-4 w-4 mr-1" />
             Details
           </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
          {product.description || "No description available."}
        </p>
        
        <div className="flex items-baseline justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground tabular-nums">
              Rs {product.currentPrice.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground">
              per {product.unit}
            </span>
          </div>
          <div className="text-right">
             <span className={cn(
               "text-[10px] font-medium",
               product.stockQuantity < 10 ? "text-warning" : "text-success"
             )}>
               {product.stockQuantity} {product.unit} left
             </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        {!isOutOfStock && (
          <div className="flex items-center justify-between w-full bg-muted/30 rounded-lg p-1 border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
              disabled={quantity <= product.minOrderQty}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-bold w-12 text-center tabular-nums">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
              disabled={quantity >= product.stockQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}

        <Button 
          className={cn(
            "w-full font-bold transition-all",
            !isOutOfStock ? "bg-primary hover:shadow-lg hover:shadow-primary/20" : "bg-muted"
          )}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
