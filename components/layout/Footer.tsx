// components/layout/Footer.tsx

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const quickLinks = [
  { name: "Search RVs", href: "/inventory" },
  { name: "Today's Deals", href: "/inventory?deals=true" },
  { name: "Financing", href: "/financing" },
  { name: "Trade-In", href: "/contact?subject=trade-in" },
  { name: "Service", href: "/service" },
  { name: "Parts", href: "/parts" },
];

const rvTypes = [
  { name: "Travel Trailers", href: "/inventory?type=Travel+Trailer" },
  { name: "Fifth Wheels", href: "/inventory?type=Fifth+Wheel" },
  { name: "Class A Motorhomes", href: "/inventory?type=Class+A" },
  { name: "Class C Motorhomes", href: "/inventory?type=Class+C" },
  { name: "Toy Haulers", href: "/inventory?type=Toy+Hauler" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
  { name: "Testimonials", href: "/about#testimonials" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Terry Town RV</h3>
            <p className="text-gray-300 mb-4">
              The World&apos;s Largest Indoor RV Showroom
            </p>
            <div className="space-y-2">
              <a
                href="tel:6166258037"
                className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4" />
                (616) 625-8037
              </a>
              <a
                href="mailto:sales@terrytownrv.com"
                className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
                sales@terrytownrv.com
              </a>
              <div className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>
                  7817 US-131<br />
                  Grand Rapids, MI 49548
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RV Types */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">RV Types</h3>
            <ul className="space-y-2">
              {rvTypes.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-light">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Terry Town RV. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
