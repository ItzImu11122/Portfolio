"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTelegramPlane, FaTimes, FaSpinner } from 'react-icons/fa';
import { doc, updateDoc, addDoc, collection, increment } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useLanguage } from '@/context/LanguageContext';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
  appId: string;
  appName: string;
  telegramLink: string;
}

export default function TelegramModal({ isOpen, onClose, appId, appName, telegramLink }: TelegramModalProps) {
  const { t } = useLanguage();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleContinue = async () => {
    setIsRedirecting(true);
    try {
      // 1. Increment app download counter in firestore
      const appRef = doc(db, 'apps', appId);
      await updateDoc(appRef, {
        downloadsCount: increment(1),
      });

      // 2. Add an event to analytics collection
      await addDoc(collection(db, 'analytics'), {
        type: 'download',
        appId,
        appName,
        timestamp: new Date(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      });
    } catch (err) {
      console.error('Failed to log download click:', err);
    } finally {
      setIsRedirecting(false);
      onClose();
      // 3. Open Telegram Link in a new tab
      if (typeof window !== 'undefined') {
        window.open(telegramLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl glass-effect shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-10 text-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-customText-mutedLight hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-customText-mutedDark transition-colors"
              aria-label="Close Modal"
            >
              <FaTimes className="text-base" />
            </button>

            {/* Telegram Icon Circle */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-500 mb-5 border border-sky-100 dark:border-sky-900">
              <FaTelegramPlane className="text-3xl animate-bounce" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-customText-light dark:text-customText-dark mb-2">
              {t('Download Confirmation', 'ডাউনলোড কনফার্মেশন')}
            </h3>

            {/* Body Text */}
            <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mb-6 leading-relaxed">
              {t(
                `This application ("${appName}") is distributed through our official Telegram Channel. Click Continue to open Telegram and download the latest version.`,
                `এই অ্যাপ্লিকেশনটি ("${appName}") আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেলে বিতরণ করা হচ্ছে। টেলিগ্রাম থেকে সর্বশেষ সংস্করণটি পেতে "চালিয়ে যান" বোতামে ক্লিক করুন।`
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isRedirecting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t('Cancel', 'বাতিল')}
              </button>
              
              <button
                type="button"
                onClick={handleContinue}
                disabled={isRedirecting}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-sky-500/20 active:scale-98"
              >
                {isRedirecting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    <span>{t('Processing...', 'প্রক্রিয়াধীন...')}</span>
                  </>
                ) : (
                  <>
                    <FaTelegramPlane className="text-sm" />
                    <span>{t('Continue', 'চালিয়ে যান')}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
