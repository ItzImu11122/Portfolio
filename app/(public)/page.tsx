"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  doc, 
  getDoc, 
  addDoc 
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useLanguage } from '@/context/LanguageContext';
import { AppItem, Skill, Service, Testimonial, HeroSettings, AboutSettings } from '@/types';
import { getValidImageUrl } from '@/utils/image';
import { 
  FaAndroid, 
  FaCode, 
  FaDatabase, 
  FaPalette, 
  FaCheckCircle, 
  FaStar, 
  FaPaperPlane, 
  FaPlus, 
  FaMinus,
  FaSpinner,
  FaQuoteLeft
} from 'react-icons/fa';

// Default static fallbacks to ensure immediate premium styling
const defaultHero: HeroSettings = {
  titleEn: 'Crafting Premium Android Apps & Software Systems',
  titleBn: 'প্রিমিয়াম অ্যান্ড্রয়েড অ্যাপস এবং সফটওয়্যার সিস্টেমস তৈরি করছি',
  subtitleEn: 'Senior Full-Stack Developer & UI/UX Architect',
  subtitleBn: 'সিনিয়র ফুল-স্ট্যাক ডেভেলপার এবং ইউআই/ইউএক্স আর্কিটেক্ট',
  bioEn: 'I design, build, and publish high-performance Android applications and modern web systems. Specializing in clean architecture, sleek Material Design, and pixel-perfect responsiveness.',
  bioBn: 'আমি হাই-পারফরম্যান্স অ্যান্ড্রয়েড অ্যাপ্লিকেশন এবং আধুনিক ওয়েব সিস্টেম ডিজাইন, তৈরি এবং প্রকাশ করি। ক্লিন আর্কিটেকচার, স্লিক মেটেরিয়াল ডিজাইন এবং নিখুঁত রেসপন্সিভনেসে আমি পারদর্শী।',
  resumeUrl: '#',
  primaryBtnTextEn: 'View My Apps',
  primaryBtnTextBn: 'আমার অ্যাপস দেখুন',
  secondaryBtnTextEn: 'Hire Me',
  secondaryBtnTextBn: 'যোগাযোগ করুন',
};

const defaultAbout: AboutSettings = {
  titleEn: 'Designing the Future of Mobile & Web Experiences',
  titleBn: 'মোবাইল এবং ওয়েব অভিজ্ঞতার ভবিষ্যৎ রূপদান',
  textEn: 'I am a passionate software engineer with 5+ years of experience building native Android apps (Kotlin/Java) and full-stack web solutions (React/Next.js/Node). I believe in clean code, automated testing, and crafting interfaces that wow users at first glance.',
  textBn: 'আমি ৫+ বছরের অভিজ্ঞতাসম্পন্ন একজন সফটওয়্যার ইঞ্জিনিয়ার যিনি নেটিভ অ্যান্ড্রয়েড অ্যাপস (কোটলিন/জাভা) এবং ফুল-স্ট্যাক ওয়েব সলিউশন (রিয়্যাক্ট/নেক্সট.জেএস/নোড) তৈরিতে দক্ষ। আমি পরিচ্ছন্ন কোড, স্বয়ংক্রিয় টেস্টিং এবং চমৎকার ইন্টারফেস তৈরিতে বিশ্বাসী।',
  imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mock-portfolio.appspot.com/o/developer.jpg?alt=media&token=placeholder',
  experience: 5,
  projects: 40,
  clients: 25,
};

const defaultServices: Service[] = [
  { id: '1', title: 'Android App Development', description: 'Native & cross-platform high-performance Android applications optimized for batteries and devices.', icon: 'FaAndroid' },
  { id: '2', title: 'Full-Stack Web Systems', description: 'Highly scalable web apps built with Next.js, React, Node, and real-time cloud databases.', icon: 'FaCode' },
  { id: '3', title: 'UI/UX & Product Design', description: 'Premium wireframes, high-fidelity prototypes, and modern Material Design systems.', icon: 'FaPalette' },
];

const defaultSkills: Skill[] = [
  { id: '1', name: 'Android SDK (Kotlin/Java)', level: 95, category: 'Android' },
  { id: '2', name: 'Jetpack Compose & Material 3', level: 90, category: 'Android' },
  { id: '3', name: 'React / Next.js (TypeScript)', level: 85, category: 'Frontend' },
  { id: '4', name: 'Tailwind CSS & Framer Motion', level: 90, category: 'Frontend' },
  { id: '5', name: 'Node.js / Express / NestJS', level: 80, category: 'Backend' },
  { id: '6', name: 'Firebase & Firestore Security', level: 88, category: 'Backend' },
];

const defaultFAQs = [
  { qEn: 'How can I download your applications?', qBn: 'আপনার অ্যাপ্লিকেশনগুলো কীভাবে ডাউনলোড করতে পারি?', aEn: 'You can download all our apps by navigating to the Apps section and clicking download. This will redirect you to our secure Telegram channel containing the verified APK files.', aBn: 'আপনি অ্যাপস সেকশনে গিয়ে ডাউনলোডে ক্লিক করে আমাদের অ্যাপগুলো ডাউনলোড করতে পারেন। এটি আপনাকে ভেরিফাইড এপিকে (APK) ফাইল ধারণকারী আমাদের নিরাপদ টেলিগ্রাম চ্যানেলে রিডাইরেক্ট করবে।' },
  { qEn: 'Do you design custom software for clients?', qBn: 'আপনি কি ক্লায়েন্টদের জন্য কাস্টম সফটওয়্যার ডিজাইন করেন?', aEn: 'Yes! I collaborate with companies and individual clients globally to build custom mobile and web solutions tailored to their business needs.', aBn: 'হ্যাঁ! আমি বিশ্বব্যাপী বিভিন্ন প্রতিষ্ঠান এবং ক্লায়েন্টদের সাথে তাদের ব্যবসার প্রয়োজন অনুসারে মোবাইল এবং ওয়েব সলিউশন তৈরিতে কাজ করি।' },
  { qEn: 'What technologies do you specialize in?', qBn: 'আপনি কোন প্রযুক্তিতে পারদর্শী?', aEn: 'I specialize in Android Development (Kotlin/Java, Jetpack Compose), Frontend Web (React, Next.js, Tailwind), Backend (Node.js, Firebase, SQL/NoSQL), and UI/UX Design.', aBn: 'আমি অ্যান্ড্রয়েড ডেভেলপমেন্ট (কোটলিন/জাভা, জেটপ্যাক কম্পোজ), ফ্রন্টএন্ড ওয়েব (রিয়্যাক্ট, নেক্সট.জেএস, টেইলউইন্ড), ব্যাকএন্ড (নোড.জেএস, ফায়ারবেস, এসকিউএল/নোএসকিউএল) এবং ইউআই/ইউএক্স ডিজাইনে পারদর্শী।' },
];

// Zod schema for bilingual contact form validation
const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function HomePage() {
  const { t, language } = useLanguage();
  
  // Data States
  const [hero, setHero] = useState<HeroSettings>(defaultHero);
  const [about, setAbout] = useState<AboutSettings>(defaultAbout);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [featuredApps, setFeaturedApps] = useState<AppItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form States
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  // Fetch Firestore Content
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Hero Settings
        const heroSnap = await getDoc(doc(db, 'settings', 'hero'));
        if (heroSnap.exists()) setHero(heroSnap.data() as HeroSettings);

        // Fetch About Settings
        const aboutSnap = await getDoc(doc(db, 'settings', 'about'));
        if (aboutSnap.exists()) setAbout(aboutSnap.data() as AboutSettings);

        // Fetch Services
        const servicesSnap = await getDocs(collection(db, 'services'));
        if (!servicesSnap.empty) {
          setServices(servicesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Service)));
        }

        // Fetch Skills
        const skillsSnap = await getDocs(collection(db, 'skills'));
        if (!skillsSnap.empty) {
          setSkills(skillsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Skill)));
        }

        // Fetch Featured Apps
        const appsQuery = query(collection(db, 'apps'), where('featured', '==', true), where('published', '==', true), limit(3));
        const appsSnap = await getDocs(appsQuery);
        setFeaturedApps(appsSnap.docs.map(d => ({ id: d.id, ...d.data() } as AppItem)));

        // Fetch Testimonials
        const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
        setTestimonials(testimonialsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));

      } catch (err) {
        console.error('Error fetching homepage data:', err);
      }
    };
    fetchData();
  }, []);

  // Contact Form Submission
  const onContactSubmit = async (data: ContactFormValues) => {
    setFormLoading(true);
    setFormSuccess(null);
    try {
      await addDoc(collection(db, 'messages'), {
        ...data,
        createdAt: new Date(),
        read: false,
      });
      setFormSuccess(t('Message sent successfully! I will get back to you shortly.', 'বার্তা সফলভাবে পাঠানো হয়েছে! আমি শীঘ্রই আপনার সাথে যোগাযোগ করব।'));
      reset();
    } catch (err) {
      console.error('Failed to send contact message:', err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-24 md:space-y-32">
      
      {/* 1. Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100/30 to-transparent dark:from-slate-900/20 dark:to-transparent z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center relative py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass-effect text-xs font-bold uppercase tracking-wider text-primary dark:text-secondary border border-primary/20">
              <FaAndroid className="text-sm animate-pulse" />
              <span>{t('Available for Projects', 'কাজের জন্য উপলব্ধ')}</span>
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">
              {language === 'en' ? hero.titleEn : hero.titleBn}
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-customText-light dark:text-customText-dark">
              {language === 'en' ? hero.subtitleEn : hero.subtitleBn}
            </p>
            <p className="text-base sm:text-lg text-customText-mutedLight dark:text-customText-mutedDark max-w-2xl mx-auto leading-relaxed">
              {language === 'en' ? hero.bioEn : hero.bioBn}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link 
                href="/#apps" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-center text-sm font-bold text-white bg-primary hover:bg-primary-light transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30"
              >
                {language === 'en' ? hero.primaryBtnTextEn : hero.primaryBtnTextBn}
              </Link>
              <Link 
                href="/#contact" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-center text-sm font-bold border border-slate-200 dark:border-slate-800 glass-effect hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
              >
                {language === 'en' ? hero.secondaryBtnTextEn : hero.secondaryBtnTextBn}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. About Me Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visual Elements / Statistics */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="col-span-2 p-6 rounded-2xl glass-effect border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 z-10 text-center">
              <span className="text-6xl font-black text-primary">{about.experience}+</span>
              <p className="text-sm font-bold tracking-wider uppercase text-customText-mutedLight dark:text-customText-mutedDark">
                {t('Years of Experience', 'বছরের অভিজ্ঞতা')}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center">
              <span className="text-4xl font-extrabold text-secondary">{about.projects}+</span>
              <p className="text-xs font-semibold uppercase text-customText-mutedLight dark:text-customText-mutedDark mt-2">
                {t('Projects Completed', 'সমাপ্ত প্রজেক্ট')}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center">
              <span className="text-4xl font-extrabold text-accent">{about.clients}+</span>
              <p className="text-xs font-semibold uppercase text-customText-mutedLight dark:text-customText-mutedDark mt-2">
                {t('Happy Clients', 'খুশি ক্লায়েন্ট')}
              </p>
            </div>
          </motion.div>

          {/* Texts */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {language === 'en' ? about.titleEn : about.titleBn}
            </h2>
            <p className="text-base text-customText-mutedLight dark:text-customText-mutedDark leading-relaxed">
              {language === 'en' ? about.textEn : about.textBn}
            </p>
            <div className="pt-4">
              <a 
                href={hero.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <span>{t('Download Resume', 'রেজুমে ডাউনলোড')}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Skills Section */}
      <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('Skills & Expertise', 'দক্ষতা ও অভিজ্ঞতা')}
          </h2>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark max-w-xl mx-auto">
            {t('My technical skill levels based on years of active architecture design and coding.', 'সক্রিয় আর্কিটেকচার ডিজাইন এবং কোডিং অভিজ্ঞতার উপর ভিত্তি করে আমার প্রযুক্তিগত দক্ষতার স্তর।')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['Android', 'Frontend', 'Backend', 'Others'].map((cat) => {
            const catSkills = skills.filter(s => s.category === cat);
            if (catSkills.length === 0) return null;
            return (
              <motion.div 
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl glass-effect border border-slate-200 dark:border-slate-800 shadow-lg space-y-5"
              >
                <h3 className="text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-2 text-primary dark:text-secondary">
                  {cat}
                </h3>
                <div className="space-y-4">
                  {catSkills.map((skill) => (
                    <div key={skill.id} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-semibold">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Apps Section */}
      <section id="apps" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('Featured Applications', 'নির্বাচিত অ্যাপ্লিকেশনসমূহ')}
            </h2>
            <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark">
              {t('Handcrafted mobile solutions and packages that deliver optimal user experiences.', 'সর্বোত্তম ইউজার এক্সপেরিয়েন্স প্রদানকারী আমার নিজের তৈরি মোবাইল সলিউশন এবং প্যাকেজসমূহ।')}
            </p>
          </div>
          <Link 
            href="/apps" 
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-primary dark:text-secondary glass-effect hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {t('View All Apps', 'সব অ্যাপ দেখুন')}
          </Link>
        </div>

        {featuredApps.length === 0 ? (
          <div className="text-center p-12 rounded-2xl border border-dashed border-slate-350 dark:border-slate-800">
            <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark">
              {t('No featured apps published yet. Visit back shortly!', 'কোনো নির্বাচিত অ্যাপ এখনো প্রকাশ করা হয়নি। অনুগ্রহ করে পরবর্তীতে চেক করুন!')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredApps.map((app) => (
              <motion.div
                key={app.id}
                whileHover={{ y: -8 }}
                className="flex flex-col h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden glow-card"
              >
                {/* Banner */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-950">
                  <Image
                    src={getValidImageUrl(app.bannerUrl)}
                    alt={app.name}
                    fill
                    className="object-cover"
                    sizes="(max-w-768px) 100vw, 33vw"
                  />
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white">
                    {app.category}
                  </span>
                </div>

                {/* Logo & Info */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-slate-800 animate-fade">
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
                          v{app.version}
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
                      {t('View App Details', 'অ্যাপ বিবরণ দেখুন')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('Services I Offer', 'আমার সেবাসমূহ')}
          </h2>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark max-w-xl mx-auto">
            {t('Providing end-to-end consulting and custom implementation for modern platforms.', 'আধুনিক প্ল্যাটফর্মের জন্য এন্ড-টু-এন্ড কনসাল্টিং এবং কাস্টম ইমপ্লিমেন্টেশন প্রদান করছি।')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv, idx) => {
            return (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary flex items-center justify-center text-xl font-bold">
                  {srv.icon === 'FaAndroid' && <FaAndroid />}
                  {srv.icon === 'FaCode' && <FaCode />}
                  {srv.icon === 'FaPalette' && <FaPalette />}
                  {!['FaAndroid', 'FaCode', 'FaPalette'].includes(srv.icon) && <FaCode />}
                </div>
                <h3 className="text-lg font-bold">{srv.title}</h3>
                <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark leading-relaxed">
                  {srv.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 6. Development Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('Development Process', 'কাজের প্রক্রিয়া')}
          </h2>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark max-w-xl mx-auto">
            {t('A systematic engineering workflow designed to build and scale software efficiently.', 'দক্ষতার সাথে সফটওয়্যার তৈরি এবং স্কেল করার জন্য একটি সুশৃঙ্খল ইঞ্জিনিয়ারিং কর্মপ্রবাহ।')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
          {[
            { step: '01', titleEn: 'Discovery', titleBn: 'পরিকল্পনা', descEn: 'Gathering requirements & specifications.', descBn: 'প্রয়োজনীয় ফিচার ও ডিজাইন নির্ধারণ।' },
            { step: '02', titleEn: 'UX Design', titleBn: 'ডিজাইন', descEn: 'Wireframing interfaces & user journeys.', descBn: 'ইউজার ইন্টারফেস ও অভিজ্ঞতার নকশা।' },
            { step: '03', titleEn: 'Architecture', titleBn: 'আর্কিটেকচার', descEn: 'Structuring scalable application layout.', descBn: 'সহজে স্কেলযোগ্য ফ্রেমওয়ার্ক গঠন।' },
            { step: '04', titleEn: 'Coding', titleBn: 'কোডিং', descEn: 'Clean modular implementation of features.', descBn: 'ক্লিন মডুলার আর্কিটেকচারে কোডিং।' },
            { step: '05', titleEn: 'QA Testing', titleBn: 'টেস্টিং', descEn: 'Automated suites & sanity validations.', descBn: 'স্বয়ংক্রিয় ও ম্যানুয়াল টেস্টিং।' },
            { step: '06', titleEn: 'Deployment', titleBn: 'প্রকাশ', descEn: 'Releasing to Vercel/Play Store/Telegram.', descBn: 'ভার্সেল/প্লে স্টোর/টেলিগ্রামে প্রকাশ।' },
          ].map((proc, idx) => (
            <motion.div 
              key={proc.step}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-2xl glass-effect border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative text-center"
            >
              <span className="absolute -top-3 left-4 text-3xl font-black text-primary/10 dark:text-secondary/15 tracking-widest">{proc.step}</span>
              <h3 className="text-base font-bold pt-2">
                {language === 'en' ? proc.titleEn : proc.titleBn}
              </h3>
              <p className="text-xs text-customText-mutedLight dark:text-customText-mutedDark">
                {language === 'en' ? proc.descEn : proc.descBn}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. Testimonials Section */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('Client Feedback', 'ক্লায়েন্টদের মতামত')}
            </h2>
            <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark max-w-xl mx-auto">
              {t('Read what my partners and clients say about building products together.', 'একত্রে প্রোডাক্ট তৈরির অভিজ্ঞতা সম্পর্কে আমার পার্টনার এবং ক্লায়েন্টদের মূল্যায়ন।')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((tst) => (
              <motion.div
                key={tst.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md relative"
              >
                <FaQuoteLeft className="text-4xl text-primary/10 dark:text-secondary/10 absolute top-4 left-4" />
                <div className="space-y-4 relative z-10 pt-4">
                  <p className="text-sm italic text-customText-mutedLight dark:text-customText-mutedDark leading-relaxed">
                    "{tst.message}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold text-sm">{tst.name}</h4>
                      <span className="text-xs text-customText-mutedLight dark:text-customText-mutedDark">{tst.role}</span>
                    </div>
                    <div className="flex items-center text-amber-500 space-x-0.5 text-xs">
                      {Array.from({ length: tst.rating }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 8. FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('Frequently Asked Questions', 'সাধারণ জিজ্ঞাসা (FAQ)')}
          </h2>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark">
            {t('Quick answers to the most common inquiries regarding my applications and service terms.', 'আমার তৈরি অ্যাপস এবং কাজের শর্তাদি সম্পর্কিত সাধারণ প্রশ্নগুলোর উত্তর।')}
          </p>
        </div>

        <div className="space-y-4">
          {defaultFAQs.map((faq, idx) => {
            const isActive = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isActive ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-sm sm:text-base text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <span>{language === 'en' ? faq.qEn : faq.qBn}</span>
                  {isActive ? <FaMinus className="text-xs" /> : <FaPlus className="text-xs" />}
                </button>
                {isActive && (
                  <div className="px-6 pb-5 pt-1 text-sm text-customText-mutedLight dark:text-customText-mutedDark border-t border-slate-200 dark:border-slate-900 leading-relaxed">
                    {language === 'en' ? faq.aEn : faq.aBn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Contact Form Section */}
      <section id="contact" className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('Get In Touch', 'যোগাযোগ করুন')}
          </h2>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark">
            {t('Have a question, feedback, or a business proposal? Submit a message below.', 'কোনো প্রশ্ন, প্রতিক্রিয়া কিংবা কাজের প্রস্তাব আছে? নিচে বার্তা পাঠিয়ে যোগাযোগ করুন।')}
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-2xl glass-effect border border-slate-200 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-5">
            {formSuccess && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-semibold flex items-center space-x-2">
                <FaCheckCircle className="flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark">
                  {t('Your Name', 'আপনার নাম')}
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark">
                  {t('Your Email', 'আপনার ইমেইল')}
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark">
                {t('Subject', 'বিষয়')}
              </label>
              <input
                type="text"
                {...register('subject')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all"
                placeholder="Collaboration Proposal"
              />
              {errors.subject && (
                <p className="text-xs text-red-500 font-semibold">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark">
                {t('Message', 'বার্তা')}
              </label>
              <textarea
                rows={5}
                {...register('message')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all resize-none"
                placeholder="Write your details here..."
              />
              {errors.message && (
                <p className="text-xs text-red-500 font-semibold">{errors.message.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-light text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-98"
              >
                {formLoading ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    <span>{t('Submitting...', 'পাঠানো হচ্ছে...')}</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm" />
                    <span>{t('Send Message', 'বার্তা পাঠান')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
