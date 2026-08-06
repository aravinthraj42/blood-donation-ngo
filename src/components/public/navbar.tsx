"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Menu, X } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Donate Blood", href: "/donate" },
  { name: "Request Blood", href: "/request-blood" },
  { name: "Health Awareness", href: "/health-awareness" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b">
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">Blood Connect</span>
              <span className="text-xs text-gray-500 block -mt-1">InfoPark News Initiate</span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === item.href
                    ? "text-primary bg-primary/5"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Button asChild>
              <Link href="/donate">Become a Donor</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                  <span className="font-bold text-xl">Blood Connect</span>
                </div>

                <nav className="flex flex-col gap-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                        pathname === item.href
                          ? "text-primary bg-primary/5"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pt-6 border-t">
                  <Button asChild className="w-full">
                    <Link href="/donate" onClick={() => setMobileMenuOpen(false)}>
                      Become a Donor
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
