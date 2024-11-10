'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Menu,
  X,
  Github,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-indigo-600 to-violet-600 border-b border-indigo-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <div className="relative h-16 w-16">
              <Image
                src="/logo.png"
                alt="Adap.AI Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="ml-4 text-3xl font-bold text-white">Adap.AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/progress">
              <Button variant="ghost" className="text-white hover:bg-indigo-500">
                Progress
              </Button>
            </Link>
            <Link href="/resources">
              <Button variant="ghost" className="text-white hover:bg-indigo-500">
                Resources
              </Button>
            </Link>
            <div className="h-6 w-px bg-indigo-400 mx-2" />
            <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-500">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-500">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-500">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-indigo-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden bg-indigo-700"
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          <Link href="/progress" className="block">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-indigo-600"
            >
              Progress
            </Button>
          </Link>
          <Link href="/resources" className="block">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-indigo-600"
            >
              Resources
            </Button>
          </Link>
          <div className="h-px bg-indigo-500 my-2" />
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-indigo-600"
          >
            <Github className="h-5 w-5 mr-2" />
            GitHub
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-indigo-600"
          >
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-indigo-600"
          >
            <HelpCircle className="h-5 w-5 mr-2" />
            Help
          </Button>
          <div className="h-px bg-indigo-500 my-2" />
          <Button
            variant="ghost"
            className="w-full justify-start text-red-300 hover:bg-red-900/50"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.div>
    </nav>
  )
} 