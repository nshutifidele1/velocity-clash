'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';

const images = [
  "https://i.pinimg.com/736x/d4/9e/c5/d49ec5ce9ca9e6007bab4272c1fbd934.jpg",
  "https://i.pinimg.com/736x/7d/9b/86/7d9b86953aeac518e96317c9aeef9a21.jpg",
  "https://i.pinimg.com/736x/9e/2b/3f/9e2b3fe786fdc83d3bbe7d1718db33d7.jpg",
  "https://i.pinimg.com/736x/51/26/8d/51268def327b98a67bb5f174e2b28bab.jpg",
];

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="absolute top-0 left-0 w-full h-full z-0"
      opts={{ loop: true }}
    >
      <CarouselContent className="h-full">
        {images.map((src, index) => (
          <CarouselItem key={index} className="relative">
            <Image
              src={src}
              alt={`Drifting Car ${index + 1}`}
              fill
              className="object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
