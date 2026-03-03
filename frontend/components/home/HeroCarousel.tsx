'use client';

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Link from 'next/link';

const banners = [
    {
        id: 1,
        title: "Negotiate like a Pro",
        subtitle: "AI-Powered Premium Deals",
        description: "Experience e-commerce of the future. Why pay retail when you can negotiate directly?",
        image: "https://images.unsplash.com/photo-1550009158-9fffc59ae7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta: "Start Negotiating",
        link: "/products?negotiationEnabled=true",
        color: "from-blue-900/90 to-blue-900/40"
    },
    {
        id: 2,
        title: "MacBook Pro M3",
        subtitle: "Deal of the Day",
        description: "Unprecedented power. Unbelievable savings. Secure your unit before stock runs out.",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta: "Shop Laptops",
        link: "/products?category=Laptops",
        color: "from-slate-900/90 to-slate-900/40"
    },
    {
        id: 3,
        title: "Premium Audio",
        subtitle: "Save up to 30%",
        description: "Immerse yourself in high-fidelity sound. Use our AI agent to lock in the absolute best price today.",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta: "Shop Electronics",
        link: "/products?category=Electronics",
        color: "from-indigo-900/90 to-indigo-900/40"
    }
];

export function HeroCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 6000, stopOnInteraction: true })
    )

    return (
        <div className="w-full max-w-[1600px] mx-auto pt-6 px-4">
            <Carousel
                plugins={[plugin.current]}
                className="w-full relative rounded-2xl overflow-hidden group shadow-lg"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id}>
                            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center">
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} z-10`} />

                                {/* Content */}
                                <div className="relative z-20 w-full container mx-auto px-8 md:px-16 text-white">
                                    <div className="max-w-2xl animate-fade-in">
                                        <span className="inline-block px-3 py-1 mb-4 text-sm font-bold tracking-wider rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                                            {banner.subtitle}
                                        </span>
                                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-md">
                                            {banner.title}
                                        </h1>
                                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl font-medium drop-shadow">
                                            {banner.description}
                                        </p>
                                        <Link href={banner.link}>
                                            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-xl shadow-xl hover:scale-105 transition-transform">
                                                {banner.cta}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation Arrows inside the container */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-blue-900 transition-colors" />
                    <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-blue-900 transition-colors" />
                </div>
            </Carousel>
        </div>
    )
}
