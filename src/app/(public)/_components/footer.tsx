import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6 md:px-20">
      {/* Contact Section */}
      <div className="md:flex justify-between items-start mb-12">
        <div>
          <h3 className="text-sm uppercase text-gray-400 mb-2">Connect</h3>
          <h2 className="text-3xl mb-4">Reach Out</h2>
          <p className="text-gray-400 mb-15">We’d love to hear from you anytime!</p>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start space-x-3">
              <Image
                src="/icons/mail-white.svg"
                alt="Email Icon"
                width={20}
                height={20}
                className="opacity-70"
              />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-400 text-sm">Send us a message</p>
                <p className="text-gray-400">info@travelmate.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <Image
                src="/icons/phone-white.svg"
                alt="Phone Icon"
                width={20}
                height={20}
                className="opacity-70"
              />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-400 text-sm">Call us anytime</p>
                <a className="text-gray-400">+1 (555) 123-4567</a>
              </div>
            </div>

            {/* Office */}
            <div className="flex items-start space-x-3">
              <Image
                src="/icons/location-white.svg"
                alt="Office Icon"
                width={20}
                height={20}
                className="opacity-70"
              />
              <div>
                <p className="font-semibold">Office</p>
                <p className="text-gray-400 text-sm">
                  456 Travel Ave, Sydney NSW 2000 AU
                </p>
                <Link href="#" className="text-blue-400">
                  Get Directions
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-8 md:mt-0 md:ml-12 bg-gray-800 w-full md:w-96 h-60 flex items-center justify-center">
          <span className="text-gray-400">Map Placeholder</span>
        </div>
      </div>

      {/* Links + Newsletter */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 border-t border-gray-700 pt-8">
        <div>
          <Image src="/images/logo.png" alt="Logo" width={100} height={40} />
        </div>

        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="#" className="hover:text-white">About Us</Link></li>
            <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-white">FAQ</Link></li>
            <li><Link href="#" className="hover:text-white">Blog</Link></li>
            <li><Link href="#" className="hover:text-white">Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="#" className="hover:text-white">Travel Tips</Link></li>
            <li><Link href="#" className="hover:text-white">Destinations</Link></li>
            <li><Link href="#" className="hover:text-white">Guides</Link></li>
            <li><Link href="#" className="hover:text-white">Testimonials</Link></li>
            <li><Link href="#" className="hover:text-white">Travel Deals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Stay Connected</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="#" className="hover:text-white">Facebook</Link></li>
            <li><Link href="#" className="hover:text-white">Twitter</Link></li>
            <li><Link href="#" className="hover:text-white">Instagram</Link></li>
            <li><Link href="#" className="hover:text-white">LinkedIn</Link></li>
            <li><Link href="#" className="hover:text-white">YouTube</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Subscribe</h4>
          <form className="flex space-x-2">
            <input
              type="email"
              placeholder="Your Email Here"
              className="px-3 py-2 bg-gray-600 text-white w-40"
            />
            <Button
              variant="outline"
              className="bg-black text-white border border-white hover:bg-white hover:text-black px-5 py-5"
            >
              Suscribe
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
        <p>© 2024 TravelMate. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Cookie Settings</Link>
        </div>
      </div>
    </footer>
  );
}
