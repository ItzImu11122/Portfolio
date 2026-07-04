"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { FaFacebook, FaGithub, FaLinkedin, FaTelegram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { SocialLinks } from '@/types';

const defaultSocials: SocialLinks = {
  facebook: 'https://facebook.com',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  telegram: 'https://t.me',
  whatsapp: 'https://wa.me',
  email: 'mailto:developer@example.com',
};

export default function Footer() {
  const { t } = useLanguage();
  const [socials, setSocials] = useState<SocialLinks>(defaultSocials);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const docRef = doc(db, 'settings', 'socials');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSocials(docSnap.data() as SocialLinks);
        }
      } catch (err) {
        console.error('Failed to fetch socials for footer:', err);
      }
    };
    fetchSocials();
  }, []);

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              IMRAN HOSSEN
            </Link>
            <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark max-w-sm">
              {t(
                'Premium software solutions and Android applications designed with modern Material Design architectures, seamless UX transitions, and high-performance algorithms.',
                'আধুনিক মেটেরিয়াল ডিজাইন আর্কিটেকচার, মসৃণ ইউজার এক্সপেরিয়েন্স ট্রানজিশন এবং উচ্চ-ক্ষমতাসম্পন্ন অ্যালগরিদম দিয়ে তৈরি প্রিমিয়াম সফটওয়্যার সলিউশন এবং অ্যান্ড্রয়েড অ্যাপ্লিকেশন।'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-customText-light dark:text-customText-dark">
              {t('Quick Links', 'লিংকসমূহ')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#about" className="hover:text-primary dark:hover:text-secondary text-customText-mutedLight dark:text-customText-mutedDark transition-colors">
                  {t('About Me', 'সম্পর্কে')}
                </Link>
              </li>
              <li>
                <Link href="/#apps" className="hover:text-primary dark:hover:text-secondary text-customText-mutedLight dark:text-customText-mutedDark transition-colors">
                  {t('Featured Apps', 'নির্বাচিত অ্যাপস')}
                </Link>
              </li>
              <li>
                <Link href="/apps" className="hover:text-primary dark:hover:text-secondary text-customText-mutedLight dark:text-customText-mutedDark transition-colors">
                  {t('All Apps', 'সব অ্যাপস')}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-primary dark:hover:text-secondary text-customText-mutedLight dark:text-customText-mutedDark transition-colors">
                  {t('Contact Info', 'যোগাযোগ')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials Link List */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-customText-light dark:text-customText-dark">
              {t('Connect With Me', 'যোগাযোগের মাধ্যম')}
            </h4>
            <div className="flex flex-wrap gap-3">
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg glass-effect hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1" aria-label="GitHub">
                  <FaGithub className="text-lg" />
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg glass-effect hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1" aria-label="Facebook">
                  <FaFacebook className="text-lg" />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg glass-effect hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1" aria-label="LinkedIn">
                  <FaLinkedin className="text-lg" />
                </a>
              )}
              {socials.telegram && (
                <a href={socials.telegram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg glass-effect hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1" aria-label="Telegram">
                  <FaTelegram className="text-lg" />
                </a>
              )}
              {socials.whatsapp && (
                <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg glass-effect hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1" aria-label="WhatsApp">
                  <FaWhatsapp className="text-lg" />
                </a>
              )}
              {socials.email && (
                <a href={socials.email.startsWith('mailto:') ? socials.email : `mailto:${socials.email}`} className="p-2.5 rounded-lg glass-effect hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1" aria-label="Email">
                  <FaEnvelope className="text-lg" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-customText-mutedLight dark:text-customText-mutedDark">
          <p>
            &copy; {new Date().getFullYear()} IMRAN HOSSEN. {t('All Rights Reserved.', 'সর্বস্বত্ব সংরক্ষিত।')}
          </p>
        </div>
      </div>
    </footer>
  );
}
