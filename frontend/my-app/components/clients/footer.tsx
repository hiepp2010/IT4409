import Link from 'next/link'
import { Facebook, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About GREY.B</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About Us</Link></li>
              <li><Link href="/stores" className="text-gray-600 hover:text-gray-900">Our Stores</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link></li>
              <li><Link href="/returns" className="text-gray-600 hover:text-gray-900">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="text-gray-600 hover:text-gray-900">Shipping Information</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/new-arrivals" className="text-gray-600 hover:text-gray-900">New Arrivals</Link></li>
              <li><Link href="/sale" className="text-gray-600 hover:text-gray-900">Sale</Link></li>
              <li><Link href="/gift-cards" className="text-gray-600 hover:text-gray-900">Gift Cards</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com/greyb" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
                <Facebook className="w-6 h-6 text-gray-600 hover:text-gray-900" />
              </a>
              <a href="https://instagram.com/greyb" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
                <Instagram className="w-6 h-6 text-gray-600 hover:text-gray-900" />
              </a>
              <a href="https://youtube.com/greyb" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to our YouTube channel">
                <Youtube className="w-6 h-6 text-gray-600 hover:text-gray-900" />
              </a>
            </div>
            <p className="text-sm text-gray-600">Sign up for our newsletter to receive updates and exclusive offers.</p>
            <form className="mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                required
              />
              <button
                type="submit"
                className="mt-2 w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} GREY.B. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

