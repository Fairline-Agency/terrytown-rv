// app/blog/page.tsx

import Link from "next/link";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Terry Town RV",
  description:
    "RV tips, travel guides, maintenance advice, and more from the Terry Town RV team. Stay informed and inspired for your next adventure.",
};

const blogPosts = [
  {
    id: 1,
    title: "10 Essential RV Maintenance Tips for New Owners",
    excerpt:
      "Keep your RV in top shape with these essential maintenance tips. From checking seals to monitoring tire pressure, learn what every new RV owner needs to know.",
    date: "January 15, 2026",
    category: "Maintenance",
    image: "/images/blog/maintenance-tips.jpg",
  },
  {
    id: 2,
    title: "Top 5 RV Destinations in Michigan for 2026",
    excerpt:
      "Discover the best RV camping spots in the Great Lakes State. From scenic lakeshores to peaceful forests, Michigan has something for every RV enthusiast.",
    date: "January 10, 2026",
    category: "Travel",
    image: "/images/blog/michigan-destinations.jpg",
  },
  {
    id: 3,
    title: "Winterizing Your RV: A Complete Guide",
    excerpt:
      "Protect your investment from cold weather damage. Our comprehensive winterization guide covers everything from plumbing to batteries.",
    date: "January 5, 2026",
    category: "Maintenance",
    image: "/images/blog/winterization.jpg",
  },
  {
    id: 4,
    title: "Choosing Between a Travel Trailer and Fifth Wheel",
    excerpt:
      "Not sure which RV type is right for you? We break down the pros and cons of travel trailers and fifth wheels to help you make the best decision.",
    date: "December 28, 2025",
    category: "Buying Guide",
    image: "/images/blog/trailer-vs-fifth-wheel.jpg",
  },
];

const categories = ["All", "Maintenance", "Travel", "Buying Guide", "Lifestyle"];

export default function BlogPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary-dark to-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Terry Town RV Blog
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Tips, guides, and inspiration for your RV adventures. Learn from our
              experts and fellow RV enthusiasts.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="card overflow-hidden group">
                {/* Placeholder Image */}
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-sm">Featured Image</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-primary font-medium hover:underline"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More (placeholder) */}
          <div className="text-center mt-12">
            <button className="btn btn-outline px-8 py-3">Load More Posts</button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for the latest RV tips, travel guides, and
              exclusive deals delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1"
              />
              <button type="submit" className="btn btn-primary px-6">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
