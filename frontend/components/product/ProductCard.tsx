import Link from 'next/link';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { Star, Sparkles, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="group h-full flex flex-col hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden bg-card">
            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                <Link href={`/products/${product.id}`} className="absolute inset-0">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                </Link>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
                    {product.negotiationEnabled && (
                        <Badge className="bg-gradient-to-r from-blue-600 to-primary text-white border-0 shadow-md font-bold px-2.5 py-1">
                            <Sparkles className="w-3 h-3 mr-1" /> AI Negotiable
                        </Badge>
                    )}
                    {product.stock < 10 && (
                        <Badge variant="destructive" className="shadow-md">Low Stock</Badge>
                    )}
                </div>
            </div>

            <CardContent className="p-4 flex-1 flex flex-col">
                {/* Category & Rating */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {product.category}
                    </span>
                    <div className="flex items-center gap-1">
                        <Star fill="#f59e0b" color="#f59e0b" size={14} />
                        <span className="text-xs font-semibold text-foreground">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/products/${product.id}`} className="group-hover:text-primary transition-colors">
                    <h3 className="font-bold text-foreground leading-tight line-clamp-2 mb-2 min-h-[40px] tracking-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto pt-4 flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground line-through">
                            {product.negotiationEnabled ? formatCurrency(product.price * 1.2) : ''}
                        </span>
                        <span className="text-lg font-extrabold text-foreground">
                            {formatCurrency(product.price)}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 gap-2">
                {product.negotiationEnabled ? (
                    <Link href={`/negotiate/${product.id}`} className="w-full">
                        <Button className="w-full gap-2 bg-primary text-white hover:bg-primary/90 font-bold shadow-sm">
                            <Sparkles size={16} /> Negotiate Price
                        </Button>
                    </Link>
                ) : (
                    <Link href={`/products/${product.id}`} className="w-full">
                        <Button variant="secondary" className="w-full gap-2 font-bold shadow-sm border border-border">
                            <ShoppingCart size={16} /> View Details
                        </Button>
                    </Link>
                )}
            </CardFooter>
        </Card>
    );
}
