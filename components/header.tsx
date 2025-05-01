"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Menu, X, ShoppingCart, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/apollo247-generic-logo.png" alt="Apollo 247" width={120} height={40} className="h-10" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Doctors
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Pharmacy
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Lab Tests
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Health Records
            </Link>
          </nav>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors, medicines..."
                className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
              <Phone className="h-4 w-4 mr-2" />
              <span>Contact</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Doctors
            </Link>
            <Link href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Pharmacy
            </Link>
            <Link href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Lab Tests
            </Link>
            <Link href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Health Records
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search doctors, medicines..."
                  className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                <Phone className="h-4 w-4 mr-2" />
                <span>Contact</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
