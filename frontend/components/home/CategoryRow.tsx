import Link from 'next/link';
import { Laptop, Headphones, Watch, Camera, Smartphone, Gamepad, Sparkles } from 'lucide-react';

const categories = [
    { name: 'AI Deals', icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10', link: '/products?negotiationEnabled=true' },
    { name: 'Laptops', icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-500/10', link: '/products?category=Laptops' },
    { name: 'Audio', icon: Headphones, color: 'text-purple-500', bg: 'bg-purple-500/10', link: '/products?category=Electronics' },
    { name: 'Smartwatches', icon: Watch, color: 'text-teal-500', bg: 'bg-teal-500/10', link: '/products' },
    { name: 'Cameras', icon: Camera, color: 'text-orange-500', bg: 'bg-orange-500/10', link: '/products' },
    { name: 'Phones', icon: Smartphone, color: 'text-pink-500', bg: 'bg-pink-500/10', link: '/products' },
    { name: 'Gaming', icon: Gamepad, color: 'text-red-500', bg: 'bg-red-500/10', link: '/products' },
];

export function CategoryRow() {
    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-xl font-bold mb-6 text-foreground tracking-tight">Shop by Category</h2>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {categories.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                        <Link
                            key={i}
                            href={cat.link}
                            className="flex flex-col items-center gap-3 min-w-[100px] snap-start group"
                        >
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-border ${cat.bg}`}>
                                <Icon className={`w-8 h-8 ${cat.color}`} />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
}
