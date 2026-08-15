import Link from "next/link";
import { Heart, Phone, Mail, MapPin } from "lucide-react";
import { getAllSettings } from "@/services/public";
import { DEFAULT_SETTINGS } from "@/config/constants";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Donate Blood", href: "/donate" },
  { name: "Request Blood", href: "/request-blood" },
  { name: "Health Awareness", href: "/health-awareness" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms" },
];

export async function PublicFooter() {
  const settings = await getAllSettings();

  const phone = settings.CONTACT_PHONE || DEFAULT_SETTINGS.CONTACT_PHONE;
  const email = settings.CONTACT_EMAIL || DEFAULT_SETTINGS.CONTACT_EMAIL;
  const address = settings.ADDRESS || DEFAULT_SETTINGS.ADDRESS;
  const city = settings.CITY || DEFAULT_SETTINGS.CITY;
  const state = settings.STATE || DEFAULT_SETTINGS.STATE;
  const ngoName = settings.NGO_NAME || DEFAULT_SETTINGS.NGO_NAME;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div>
                <span className="font-bold text-xl text-white">{ngoName}</span>
                <span className="text-xs text-gray-400 block -mt-1">InfoPark News Initiate</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connecting donors with those in need. Together, we can save lives
              through the gift of blood donation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-primary" />
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-primary" />
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span className="text-sm text-gray-400">
                  {address},
                  <br />
                  {city}, {state}
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500">
                This platform is for informational purposes only. Final
                eligibility for blood donation is determined by qualified
                healthcare professionals.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} {ngoName} – InfoPark News Initiate, {city}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Made with <Heart className="w-3 h-3 inline text-primary" fill="currentColor" /> for humanity
          </p>
        </div>
      </div>
    </footer>
  );
}
