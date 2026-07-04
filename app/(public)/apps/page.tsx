"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useLanguage } from '@/context/LanguageContext';
import { useDebounce } from '@/hooks/useDebounce';
import { AppItem, Category } from '@/types';
import { FaAndroid, FaSearch, FaFilter, FaSortAmountDown, FaSpinner } from 'react-icons/fa';
import { getValidImageUrl } from '@/utils/image';

const fallbackCategories: Category[] = [
  { id: '1', name: 'Education', slug: 'education' },
  { id: '2', name: 'Marketplace', slug: 'marketplace' },
  { id: '3', name: 'Business', slug: 'business' },
  { id: '4', name: 'NGO', slug: 'ngo' },
  { id: '5', name: 'Islamic', slug: 'islamic' },
  { id: '6', name: 'Health', slug: 'health' },
  { id: '7', name: 'Utility', slug: 'utility' },
  { id: '8', name: 'Productivity', slug: 'productivity' },
  { id: '9', name: 'Finance', slug: 'finance' },
];

export default function AppsPage() {
  const { t } = useLanguage();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'featured' | 'popular'>('latest');

  // Fetch categories and published apps from Firestore
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch Categories
        const catSnap = await getDocs(collection(db, 'categories'));
        if (!catSnap.empty) {
          setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
        }

        // Fetch Published Apps (sorted by createdAt initially)
        const appsQuery = query(
          collection(db, 'apps'), 
          where('published', '==', true)
        );
        const appsSnap = await getDocs(appsQuery);
        setApps(appsSnap.docs.map(d => ({ id: d.id, ...d.data() } as AppItem)));
      } catch (err) {
        console.error('Failed to fetch apps library:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Filter & Sort logic (performed client-side for rapid interactive response)
  const filteredAndSortedApps = React.useMemo(() => {
    let result = [...apps];

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        app => app.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter (Case-insensitive matching name/description)
    if (debouncedSearch.trim() !== '') {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        app => app.name.toLowerCase().includes(q) || 
               app.shortDescription.toLowerCase().includes(q) ||
               app.technologies.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'featured') {
        // Featured first, then fallback to newest
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt).getTime() -
               new Date(a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt).getTime();
      }
      if (sortBy === 'popular') {
        // Most downloads first
        return b.downloadsCount - a.downloadsCount;
      }
      // Latest: newest createdAt first
      const dateA = new Date(a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt).getTime();
      const dateB = new Date(b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt).getTime();
      return dateB - dateA;
    });

    return result;
  }, [apps, selectedCategory, debouncedSearch, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t('Software & Mobile Directory', 'সফটওয়্যার ও মোবাইল ডিরেক্টরি')}
        </h1>
        <p className="text-sm sm:text-base text-customText-mutedLight dark:text-customText-mutedDark max-w-xl mx-auto">
          {t(
            'Search and filter through all our Android APKs, web systems, NGO tools, and productivity packages.',
            'আমাদের তৈরি সমস্ত অ্যান্ড্রয়েড এপিকে (APK), ওয়েব সিস্টেম, এনজিও টুলস এবং প্রোডাক্টিভিটি প্যাকেজগুলো এখানে খুঁজুন।'
          )}
        </p>
      </div>

      {/* Control panel (Search, Category, Sorting) */}
      <div className="p-4 rounded-2xl glass-effect border border-slate-200 dark:border-slate-800 shadow-lg grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
        
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <FaSearch className="absolute left-4 top-3.5 text-customText-mutedLight dark:text-customText-mutedDark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Search by name, tags, description...', 'নাম বা ট্যাগ দিয়ে খুঁজুন...')}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all"
          />
        </div>

        {/* Category selector */}
        <div className="relative">
          <FaFilter className="absolute left-4 top-3.5 text-customText-mutedLight dark:text-customText-mutedDark text-xs" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none appearance-none"
          >
            <option value="all">{t('All Categories', 'সকল ক্যাটাগরি')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug || cat.name.toLowerCase()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting selector */}
        <div className="relative">
          <FaSortAmountDown className="absolute left-4 top-3.5 text-customText-mutedLight dark:text-customText-mutedDark text-xs" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none appearance-none"
          >
            <option value="latest">{t('Sort: Latest', 'সাজান: সর্বশেষ')}</option>
            <option value="featured">{t('Sort: Featured', 'সাজান: ফিচার্ড')}</option>
            <option value="popular">{t('Sort: Popular', 'সাজান: জনপ্রিয়')}</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="text-center space-y-4">
            <FaSpinner className="text-4xl text-primary animate-spin mx-auto" />
            <p className="text-sm font-semibold text-customText-mutedLight dark:text-customText-mutedDark">
              {t('Loading applications...', 'অ্যাপ্লিকেশন লোড হচ্ছে...')}
            </p>
          </div>
        </div>
      ) : filteredAndSortedApps.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/20">
          <p className="text-base font-bold text-customText-mutedLight dark:text-customText-mutedDark mb-1">
            {t('No applications found', 'কোনো অ্যাপ্লিকেশন পাওয়া যায়নি')}
          </p>
          <p className="text-xs text-customText-mutedLight dark:text-customText-mutedDark">
            {t('Try adjusting your search terms or filters.', 'আপনার সার্চের শব্দ কিংবা ক্যাটাগরি ফিল্টার পরিবর্তন করে দেখুন।')}
          </p>
        </div>
      ) : (
        /* Grid list of Apps */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredAndSortedApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden glow-card"
            >
              {/* App banner image */}
              <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-950">
                <Image
                  src={getValidImageUrl(app.bannerUrl)}
                  alt={app.name}
                  fill
                  className="object-cover"
                  sizes="(max-w-768px) 100vw, 33vw"
                />
                {/* Featured indicator tag */}
                {app.featured && (
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow">
                    {t('Featured', 'নির্বাচিত')}
                  </span>
                )}
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white shadow">
                  {app.category}
                </span>
              </div>

              {/* Logo / details */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                      <Image
                        src={getValidImageUrl(app.logoUrl)}
                        alt={app.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg leading-tight hover:text-primary transition-colors">
                        {app.name}
                      </h3>
                      <span className="text-xs text-customText-mutedLight dark:text-customText-mutedDark">
                        v{app.version} | {app.appSize || 'Unknown size'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark line-clamp-3">
                    {app.shortDescription}
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    href={`/apps/${app.slug}`}
                    className="block text-center w-full py-2.5 rounded-xl bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-850 dark:hover:bg-primary transition-all font-bold text-xs"
                  >
                    {t('View Details', 'বিস্তারিত বিবরণ')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
