
import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'en' | 'fa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Simple translation object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'home': 'Home',
    'about': 'About',
    'contact': 'Contact',
    'login': 'Login',
    'search': 'Search',
    'profile': 'Profile',
    'view_profile': 'View Profile',
    'logged_in_as': 'Logged in as',

    // Hero section
    'hero_title': 'Advanced Tools for Ethical Hackers',
    'hero_description': 'Equip yourself with cutting-edge penetration testing gear designed for security professionals. From wireless analyzers to custom hardware, we\'ve got the tools you need to secure networks.',
    'browse_equipment': 'Browse Equipment',
    'github': 'GitHub',

    // Footer
    'products': 'Products',
    'network_tools': 'Network Tools',
    'wireless_devices': 'Wireless Devices',
    'hardware_kits': 'Hardware Kits',
    'software_tools': 'Software Tools',
    'information': 'Information',
    'about_us': 'About Us',
    'faq': 'FAQ',
    'shipping_info': 'Shipping Info',
    'legal': 'Legal',
    'terms_of_service': 'Terms of Service',
    'privacy_policy': 'Privacy Policy',
    'refund_policy': 'Refund Policy',
    'legal_notice': 'Legal Notice',
    'all_rights_reserved': 'All rights reserved',

    // Misc
    'ethical': 'Ethical',
    'hacker': 'Hacker',
  },
  fa: {
    // Navigation
    'home': 'خانه',
    'about': 'درباره ما',
    'contact': 'تماس با ما',
    'login': 'ورود',
    'search': 'جستجو',
    'profile': 'پروفایل',
    'view_profile': 'مشاهده پروفایل',
    'logged_in_as': 'وارد شده با نام',

    // Hero section
    'hero_title': 'ابزارهای پیشرفته برای هکرهای اخلاقی',
    'hero_description': 'خود را با تجهیزات تست نفوذ پیشرفته طراحی شده برای متخصصان امنیت مجهز کنید. از تحلیلگرهای بی‌سیم گرفته تا سخت‌افزارهای سفارشی، ما ابزارهایی که برای ایمن‌سازی شبکه‌ها نیاز دارید را فراهم کرده‌ایم.',
    'browse_equipment': 'مشاهده تجهیزات',
    'github': 'گیت‌هاب',

    // Footer
    'products': 'محصولات',
    'network_tools': 'ابزارهای شبکه',
    'wireless_devices': 'دستگاه‌های بی‌سیم',
    'hardware_kits': 'کیت‌های سخت‌افزاری',
    'software_tools': 'ابزارهای نرم‌افزاری',
    'information': 'اطلاعات',
    'about_us': 'درباره ما',
    'faq': 'سوالات متداول',
    'shipping_info': 'اطلاعات ارسال',
    'legal': 'قانونی',
    'terms_of_service': 'شرایط خدمات',
    'privacy_policy': 'سیاست حفظ حریم خصوصی',
    'refund_policy': 'سیاست بازپرداخت',
    'legal_notice': 'اطلاعیه قانونی',
    'all_rights_reserved': 'تمامی حقوق محفوظ است',

    // Misc
    'ethical': 'اخلاقی',
    'hacker': 'هکر',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const isRTL = language === 'fa';

  useEffect(() => {
    // Apply RTL/LTR to the document
    if (isRTL) {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('font-mirza');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('font-mirza');
    }
  }, [isRTL]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fa' : 'en');
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
