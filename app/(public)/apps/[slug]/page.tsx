"use client";

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  doc, 
  updateDoc, 
  addDoc, 
  increment 
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useLanguage } from '@/context/LanguageContext';
import { AppItem } from '@/types';
import TelegramModal from '@/components/TelegramModal';
import { getValidImageUrl } from '@/utils/image';
import { 
  FaAndroid, 
  FaDownload, 
  FaInfoCircle, 
  FaChevronLeft, 
  FaChevronRight, 
  FaStar, 
  FaShieldAlt, 
  FaCalendarAlt, 
  FaCodeBranch, 
  FaUser, 
  FaTag, 
  FaFolder,
  FaSpinner,
  FaGithub,
  FaGooglePlay,
  FaGlobe,
  FaPlus,
  FaMinus
} from 'react-icons/fa';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AppDetailsPage({ params }: PageProps) {
  const { slug } = use(params);
  const { t } = useLanguage();
  
  const [app, setApp] = useState<AppItem | null>(null);
  const [relatedApps, setRelatedApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);

  // Download Trigger State
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Fetch App details, related apps, and log page view
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const appQuery = query(
          collection(db, 'apps'), 
          where('slug', '==', slug), 
          where('published', '==', true),
          limit(1)
        );
        const appSnap = await getDocs(appQuery);
        
        if (!appSnap.empty) {
          const appDoc = appSnap.docs[0];
          const appData = { id: appDoc.id, ...appDoc.data() } as AppItem;
          setApp(appData);

          // Log View Analytics & Increment viewsCount
          try {
            const appRef = doc(db, 'apps', appDoc.id);
            await updateDoc(appRef, {
              viewsCount: increment(1)
            });

            await addDoc(collection(db, 'analytics'), {
              type: 'view',
              appId: appDoc.id,
              appName: appData.name,
              timestamp: new Date(),
              userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
            });
          } catch (err) {
            console.error('Failed to log view analytics:', err);
          }

          // Fetch Related Apps (same category, excluding current)
          const relatedQuery = query(
            collection(db, 'apps'),
            where('published', '==', true),
            where('category', '==', appData.category),
            limit(4)
          );
          const relatedSnap = await getDocs(relatedQuery);
          const relatedList = relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as AppItem))
            .filter(item => item.id !== appDoc.id);
          setRelatedApps(relatedList.slice(0, 3));
        } else {
          setApp(null);
        }
      } catch (err) {
        console.error('Error fetching app details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  // Navigate screenshots
  const handlePrevScreenshot = () => {
    if (!app?.screenshots || app.screenshots.length === 0) return;
    setActiveScreenshotIdx((prev) => (prev === 0 ? app.screenshots.length - 1 : prev - 1));
  };

  const handleNextScreenshot = () => {
    if (!app?.screenshots || app.screenshots.length === 0) return;
    setActiveScreenshotIdx((prev) => (prev === app.screenshots.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <FaSpinner className="text-4xl text-primary animate-spin mx-auto" />
          <p className="text-sm font-semibold text-customText-mutedLight dark:text-customText-mutedDark">
            {t('Loading app details...', 'অ্যাপ বিবরণ লোড হচ্ছে...')}
          </p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-2xl font-bold">{t('Application Not Found', 'অ্যাপ্লিকেশনটি পাওয়া যায়নি')}</h2>
        <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark">
          {t('The application you are looking for does not exist or has been unpublished.', 'আপনি যে অ্যাপ্লিকেশনটি খুঁজছেন সেটি ডিলিট করা হয়েছে অথবা ড্রাফট অবস্থায় রয়েছে।')}
        </p>
        <Link 
          href="/apps" 
          className="inline-block px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm"
        >
          {t('Back to Directory', 'ডিরেক্টরিতে ফিরে যান')}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative pb-24">
      
      {/* 1. Header Banner & Info Block */}
      <div className="relative w-full h-56 sm:h-80 bg-slate-900 overflow-hidden">
        <Image
          src={getValidImageUrl(app.bannerUrl)}
          alt={app.name}
          fill
          className="object-cover opacity-60 filter blur-xs"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-customBg-light dark:from-customBg-dark via-transparent to-transparent" />
      </div>

      {/* Main Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10 space-y-10">
        <div className="p-6 sm:p-8 rounded-2xl glass-effect border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          
          {/* Logo */}
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex-shrink-0 shadow-lg">
            <Image
              src={getValidImageUrl(app.logoUrl)}
              alt={app.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Core Info */}
          <div className="flex-grow space-y-4 text-center md:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-white">
                  {app.category}
                </span>
                {app.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center space-x-1">
                    <FaStar />
                    <span>{t('Featured', 'নির্বাচিত')}</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{app.name}</h1>
              <p className="text-sm font-semibold text-customText-mutedLight dark:text-customText-mutedDark mt-1">
                {t('Developed by:', 'ডেভেলপার:')} {app.developer}
              </p>
            </div>

            <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark max-w-3xl leading-relaxed">
              {app.shortDescription}
            </p>

            {/* Quick Metadata list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-customText-mutedLight dark:text-customText-mutedDark block font-semibold mb-0.5">{t('Current Version', 'বর্তমান সংস্করণ')}</span>
                <span className="font-extrabold text-sm flex items-center justify-center md:justify-start space-x-1">
                  <FaCodeBranch className="text-xs text-primary" />
                  <span>{app.version}</span>
                </span>
              </div>
              <div>
                <span className="text-customText-mutedLight dark:text-customText-mutedDark block font-semibold mb-0.5">{t('App Size', 'অ্যাপ সাইজ')}</span>
                <span className="font-extrabold text-sm flex items-center justify-center md:justify-start space-x-1">
                  <FaInfoCircle className="text-xs text-primary" />
                  <span>{app.appSize}</span>
                </span>
              </div>
              <div>
                <span className="text-customText-mutedLight dark:text-customText-mutedDark block font-semibold mb-0.5">{t('Android Version', 'অ্যান্ড্রয়েড সংস্করণ')}</span>
                <span className="font-extrabold text-sm flex items-center justify-center md:justify-start space-x-1">
                  <FaAndroid className="text-xs text-primary" />
                  <span>Android {app.androidVersion}+</span>
                </span>
              </div>
              <div>
                <span className="text-customText-mutedLight dark:text-customText-mutedDark block font-semibold mb-0.5">{t('Downloads Logged', 'ডাউনলোড সংখ্যা')}</span>
                <span className="font-extrabold text-sm flex items-center justify-center md:justify-start space-x-1">
                  <FaDownload className="text-xs text-primary" />
                  <span>{app.downloadsCount || 0}</span>
                </span>
              </div>
            </div>

            {/* External Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => setIsDownloadOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
              >
                <FaDownload />
                <span>{t('Download Latest APK', 'সর্বশেষ এপিকে ডাউনলোড')}</span>
              </button>

              {app.githubLink && (
                <a href={app.githubLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 glass-effect hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-xs flex items-center space-x-2 transition-all">
                  <FaGithub />
                  <span>GitHub</span>
                </a>
              )}
              {app.playStoreLink && (
                <a href={app.playStoreLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 glass-effect hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-xs flex items-center space-x-2 transition-all text-amber-500">
                  <FaGooglePlay />
                  <span>Play Store</span>
                </a>
              )}
              {app.websiteLink && (
                <a href={app.websiteLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 glass-effect hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-xs flex items-center space-x-2 transition-all">
                  <FaGlobe />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 2. Grid Sections (Screenshots, Description, Technical specs) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Specs Left Column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Screenshots Slider */}
            {app.screenshots && app.screenshots.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="text-lg font-bold mb-4">{t('Application Screenshots', 'অ্যাপ্লিকেশন স্ক্রিনশট')}</h3>
                
                <div className="relative aspect-[16/9] w-full bg-slate-950 rounded-xl overflow-hidden group">
                  <Image
                    src={getValidImageUrl(app.screenshots[activeScreenshotIdx])}
                    alt={`${app.name} Screenshot ${activeScreenshotIdx + 1}`}
                    fill
                    className="object-contain"
                  />

                  {/* Left / Right Nav controls */}
                  <button
                    onClick={handlePrevScreenshot}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-900/60 backdrop-blur hover:bg-slate-900 text-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous screenshot"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={handleNextScreenshot}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-900/60 backdrop-blur hover:bg-slate-900 text-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next screenshot"
                  >
                    <FaChevronRight />
                  </button>

                  {/* Dot counters */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {app.screenshots.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveScreenshotIdx(idx)}
                        className={`h-2 w-2 rounded-full transition-all ${
                          idx === activeScreenshotIdx ? 'bg-primary w-4' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Description */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
              <h3 className="text-lg font-bold mb-4">{t('Description', 'অ্যাপের বিবরণ')}</h3>
              <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark leading-relaxed whitespace-pre-line">
                {app.longDescription}
              </p>
            </div>

            {/* Features list */}
            {app.features && app.features.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="text-lg font-bold mb-4">{t('Core Features', 'প্রধান বৈশিষ্ট্যসমূহ')}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {app.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-sm text-customText-mutedLight dark:text-customText-mutedDark">
                      <FaShieldAlt className="text-green-500 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs Dropdowns */}
            {app.faqs && app.faqs.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="text-lg font-bold mb-4">{t('Application FAQ', 'অ্যাপ্লিকেশন সংক্রান্ত জিজ্ঞাসা')}</h3>
                <div className="space-y-3">
                  {app.faqs.map((faq, idx) => {
                    const isActive = activeFaq === idx;
                    return (
                      <div key={idx} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 overflow-hidden">
                        <button
                          onClick={() => setActiveFaq(isActive ? null : idx)}
                          className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-left"
                        >
                          <span>{faq.question}</span>
                          {isActive ? <FaMinus className="text-xs" /> : <FaPlus className="text-xs" />}
                        </button>
                        {isActive && (
                          <div className="px-4 pb-4 pt-1 text-xs text-customText-mutedLight dark:text-customText-mutedDark border-t border-slate-100 dark:border-slate-900 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Specs / Tags Right Side Panel */}
          <div className="space-y-8">
            
            {/* Technical tags */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark">
                {t('Technologies Used', 'ব্যবহৃত প্রযুক্তিসমূহ')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {app.technologies.map((tech, idx) => (
                  <span
                    key={tech || idx}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Changelog What's New */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark flex items-center space-x-1.5">
                <FaCodeBranch className="text-primary text-xs" />
                <span>{t("What's New", 'নতুন কী আছে')}</span>
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary dark:text-secondary">v{app.version}</span>
                  <span className="text-customText-mutedLight dark:text-customText-mutedDark">{t('Latest update', 'সর্বশেষ আপডেট')}</span>
                </div>
                <p className="text-xs text-customText-mutedLight dark:text-customText-mutedDark leading-relaxed">
                  {t('General performance improvements, database security rule adjustments, package dependency checks, and user feedback bugs resolution.', 'সাধারণ কর্মক্ষমতা বৃদ্ধি, ডেটাবেস সিকিউরিটি পলিসি অ্যাডজাস্টমেন্ট, লাইব্রেরি আপডেট এবং ইউজার ফিডব্যাক বাগ ফিক্স।')}
                </p>
              </div>
            </div>

            {/* Privacy & Permissions */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark flex items-center space-x-1.5">
                <FaShieldAlt className="text-green-500 text-xs" />
                <span>{t('App Permissions', 'অ্যাপ পারমিশনস')}</span>
              </h3>
              <ul className="space-y-2 text-xs text-customText-mutedLight dark:text-customText-mutedDark">
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>Internet access (`android.permission.INTERNET`)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>Network state access (`ACCESS_NETWORK_STATE`)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>Storage access (`READ_EXTERNAL_STORAGE`)</span>
                </li>
              </ul>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link href="#" className="text-xs text-primary hover:underline font-semibold">
                  {t('Read Privacy Policy', 'প্রাইভেসি পলিসি পড়ুন')}
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Related Apps Section */}
        {relatedApps.length > 0 && (
          <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-6">{t('Related Applications', 'সম্পর্কিত অন্যান্য অ্যাপ')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedApps.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/apps/${rel.slug}`}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0 border border-slate-200/60 dark:border-slate-800 animate-fade">
                    <Image
                      src={getValidImageUrl(rel.logoUrl)}
                      alt={rel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm hover:text-primary transition-colors leading-snug">{rel.name}</h4>
                    <p className="text-xs text-customText-mutedLight dark:text-customText-mutedDark line-clamp-1">{rel.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Sticky Bottom Download Banner (For mobile CTA) */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-850 px-4 py-3 shadow-2xl flex items-center justify-between max-w-md mx-auto md:max-w-none md:px-12">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-slate-800 hidden sm:block animate-fade">
            <Image
              src={getValidImageUrl(app.logoUrl)}
              alt={app.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base leading-none">{app.name}</h4>
            <span className="text-xs text-customText-mutedLight dark:text-customText-mutedDark">
              v{app.version} | {app.appSize}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsDownloadOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-light text-white font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-md active:scale-95"
        >
          <FaDownload />
          <span>{t('Download APK', 'এপিকে ডাউনলোড')}</span>
        </button>
      </div>

      {/* Redirection Modal */}
      <TelegramModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        appId={app.id}
        appName={app.name}
        telegramLink={app.telegramLink}
      />
    </div>
  );
}
