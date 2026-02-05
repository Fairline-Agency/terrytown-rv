// components/layout/TopBar.tsx

import { Phone } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="bg-primary-dark text-white text-sm py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <a
            href="tel:6166258037"
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Sales: (616) 625-8037</span>
          </a>
          <a
            href="tel:6166258023"
            className="hidden sm:flex items-center gap-2 hover:text-accent transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Service: (616) 625-8023</span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/about" className="hover:text-accent transition-colors">
            About Us
          </Link>
          <Link href="/careers" className="hover:text-accent transition-colors">
            Careers
          </Link>
          <Link href="/contact" className="hover:text-accent transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
