import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Droplet, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-white to-primary/5 py-16 lg:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Heart className="w-4 h-4" fill="currentColor" />
            <span>Every Drop Saves Lives</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Donate Blood.
            <br />
            <span className="text-primary">Save Lives.</span>
          </h1>

          {/* Description */}
          <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of life-savers. Your single blood donation can
            save up to three lives. Register today and be a hero to someone in
            need.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/donate">
                <Heart className="w-5 h-5 mr-2" />
                Become a Donor
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/request-blood">
                <Droplet className="w-5 h-5 mr-2" />
                Request Blood
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200">
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-primary">500+</p>
              <p className="text-sm text-gray-600 mt-1">Registered Donors</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-primary">200+</p>
              <p className="text-sm text-gray-600 mt-1">Lives Saved</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-primary">50+</p>
              <p className="text-sm text-gray-600 mt-1">Partner Hospitals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="container mx-auto px-4 lg:px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
          Your blood donation can give someone another chance at life. Join our
          community of donors today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            <Link href="/donate">
              Register as Donor
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10"
          >
            <Link href="/about">Learn More About Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
