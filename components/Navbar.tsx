"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Dark/Light Mode Sync
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme as 'light' | 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Scroll detection for Navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (pathname !== '/') {
      e.preventDefault();
      router.push(`/${hash}`);
    }
    setIsOpen(false);
  };

  const navLinks = [
    { nameEn: 'Home', nameBn: 'হোম', hash: '#hero' },
    { nameEn: 'About', nameBn: 'সম্পর্কে', hash: '#about' },
    { nameEn: 'Skills', nameBn: 'দক্ষতা', hash: '#skills' },
    { nameEn: 'Apps', nameBn: 'অ্যাপস', hash: '#apps' },
    { nameEn: 'Services', nameBn: 'সেবাসমূহ', hash: '#services' },
    { nameEn: 'Testimonials', nameBn: 'মতামত', hash: '#testimonials' },
    { nameEn: 'FAQ', nameBn: 'জিজ্ঞাসা', hash: '#faq' },
    { nameEn: 'Contact', nameBn: 'যোগাযোগ', hash: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-effect py-3 shadow-lg' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
                IMRAN HOSSEN
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.hash}
                  href={link.hash}
                  onClick={(e) => handleNavClick(e, link.hash)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary dark:hover:text-secondary text-customText-mutedLight dark:text-customText-mutedDark"
                >
                  {language === 'en' ? link.nameEn : link.nameBn}
                </a>
              ))}
              <Link
                href="/apps"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:text-primary dark:hover:text-secondary ${
                  pathname === '/apps'
                    ? 'text-primary dark:text-secondary font-bold'
                    : 'text-customText-mutedLight dark:text-customText-mutedDark'
                }`}
              >
                {t('All Apps', 'সব অ্যাপ')}
              </Link>
            </div>

            {/* Icons / Switches */}
            <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-6">
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider glass-effect hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Switch Language"
              >
                <FaGlobe className="text-sm" />
                <span>{language === 'en' ? 'BN' : 'EN'}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg glass-effect hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <FaSun className="text-amber-500 text-lg" />
                ) : (
                  <FaMoon className="text-slate-700 text-lg" />
                )}
              </button>


            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="p-2 rounded-lg text-xs font-bold uppercase tracking-wider glass-effect"
            >
              {language === 'en' ? 'BN' : 'EN'}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass-effect"
            >
              {theme === 'dark' ? (
                <FaSun className="text-amber-500 text-sm" />
              ) : (
                <FaMoon className="text-slate-700 text-sm" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg glass-effect hover:text-primary transition-colors"
              aria-label="Open Menu"
            >
              {isOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-effect border-t border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.hash}
                  href={link.hash}
                  onClick={(e) => handleNavClick(e, link.hash)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {language === 'en' ? link.nameEn : link.nameBn}
                </a>
              ))}
              <Link
                href="/apps"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  pathname === '/apps' ? 'text-primary dark:text-secondary font-bold' : ''
                }`}
              >
                {t('All Apps', 'সব অ্যাপ')}
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
