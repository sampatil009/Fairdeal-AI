import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-12 text-muted-foreground">
            {/* Newsletter Section */}
            <div className="border-b border-border bg-secondary/30">
                <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-foreground mb-1">Stay ahead with AI Deals</h3>
                        <p className="text-sm">Get the best negotiable offers sent straight to your inbox.</p>
                    </div>
                    <div className="flex w-full md:max-w-md gap-2">
                        <Input className="rounded-full bg-background" placeholder="Email address" type="email" />
                        <Button className="rounded-full shrink-0">Subscribe</Button>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand & Contact */}
                    <div className="space-y-4">
                        <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2 text-foreground">
                            <span className="bg-primary text-primary-foreground p-1.5 rounded-lg">✨</span>
                            <span>FairDeal<span className="text-primary">AI</span></span>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Experience the future of e-commerce. Negotiate directly with our AI engine to lock in the best prices on premium products.
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> WIT Solapur</div>
                            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (800) 123-4567</div>
                            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@fairdeal.ai</div>
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="space-y-4">
                        <h4 className="text-foreground font-semibold">Shop Menu</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/products?category=Electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
                            <li><Link href="/products?category=Laptops" className="hover:text-primary transition-colors">Laptops</Link></li>
                            <li><Link href="/products?negotiationEnabled=true" className="text-primary font-medium hover:underline">Negotiable Items</Link></li>
                            <li><Link href="/cart" className="hover:text-primary transition-colors">Your Cart</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="space-y-4">
                        <h4 className="text-foreground font-semibold">My Account</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">User Dashboard</Link></li>
                            <li><Link href="/orders" className="hover:text-primary transition-colors">Order History</Link></li>
                            <li><Link href="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
                            <li><Link href="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h4 className="text-foreground font-semibold">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
                <div className="container mx-auto px-4">
                    <p>© {new Date().getFullYear()} FairDeal AI. Built for the modern e-commerce experience.</p>
                </div>
            </div>
        </footer>
    );
}
