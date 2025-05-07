
import React, { createContext, useState, useContext, useEffect } from 'react';

// Language types
export type Language = 'en' | 'fa';

// Translation record with language support flag
export interface TranslationEntry {
  en: string;
  fa: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  toggleLanguage: () => void;
  t: (key: string) => string;
  translations: Record<string, TranslationEntry>;
  updateTranslation: (key: string, translations: { en: string; fa: string }) => void;
}

// Simple translation object
const defaultTranslations: Record<string, TranslationEntry> = {
  // Navigation
  'home': { en: 'Home', fa: 'خانه' },
  'about': { en: 'About', fa: 'درباره ما' },
  'contact': { en: 'Contact', fa: 'تماس با ما' },
  'login': { en: 'Login', fa: 'ورود' },
  'search': { en: 'Search', fa: 'جستجو' },
  'profile': { en: 'Profile', fa: 'پروفایل' },
  'view_profile': { en: 'View Profile', fa: 'مشاهده پروفایل' },
  'logged_in_as': { en: 'Logged in as', fa: 'وارد شده با نام' },

  // Hero section
  'hero_title': { en: 'Advanced Tools for Ethical Hackers', fa: 'ابزارهای پیشرفته برای هکرهای اخلاقی' },
  'hero_description': { 
    en: 'Equip yourself with cutting-edge penetration testing gear designed for security professionals. From wireless analyzers to custom hardware, we\'ve got the tools you need to secure networks.', 
    fa: 'خود را با تجهیزات تست نفوذ پیشرفته طراحی شده برای متخصصان امنیت مجهز کنید. از تحلیلگرهای بی‌سیم گرفته تا سخت‌افزارهای سفارشی، ما ابزارهایی که برای ایمن‌سازی شبکه‌ها نیاز دارید را فراهم کرده‌ایم.'
  },
  'browse_equipment': { en: 'Browse Equipment', fa: 'مشاهده تجهیزات' },
  'github': { en: 'GitHub', fa: 'گیت‌هاب' },

  // Footer
  'products': { en: 'Products', fa: 'محصولات' },
  'network_tools': { en: 'Network Tools', fa: 'ابزارهای شبکه' },
  'wireless_devices': { en: 'Wireless Devices', fa: 'دستگاه‌های بی‌سیم' },
  'hardware_kits': { en: 'Hardware Kits', fa: 'کیت‌های سخت‌افزاری' },
  'software_tools': { en: 'Software Tools', fa: 'ابزارهای نرم‌افزاری' },
  'information': { en: 'Information', fa: 'اطلاعات' },
  'about_us': { en: 'About Us', fa: 'درباره ما' },
  'faq': { en: 'FAQ', fa: 'سوالات متداول' },
  'shipping_info': { en: 'Shipping Info', fa: 'اطلاعات ارسال' },
  'legal': { en: 'Legal', fa: 'قانونی' },
  'terms_of_service': { en: 'Terms of Service', fa: 'شرایط خدمات' },
  'privacy_policy': { en: 'Privacy Policy', fa: 'سیاست حفظ حریم خصوصی' },
  'refund_policy': { en: 'Refund Policy', fa: 'سیاست بازپرداخت' },
  'legal_notice': { en: 'Legal Notice', fa: 'اطلاعیه قانونی' },
  'all_rights_reserved': { en: 'All rights reserved', fa: 'تمامی حقوق محفوظ است' },

  // Misc
  'ethical': { en: 'Ethical', fa: 'اخلاقی' },
  'hacker': { en: 'Hacker', fa: 'هکر' },
};

// Set up local storage key
const TRANSLATIONS_STORAGE_KEY = 'cyberpunk_translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, TranslationEntry>>(defaultTranslations);
  const isRTL = language === 'fa';

  // Load translations from localStorage on initial load
  useEffect(() => {
    const savedTranslations = localStorage.getItem(TRANSLATIONS_STORAGE_KEY);
    if (savedTranslations) {
      try {
        setTranslations(JSON.parse(savedTranslations));
      } catch (error) {
        console.error('Error loading translations from localStorage:', error);
      }
    }
  }, []);

  // Apply RTL/LTR to the document
  useEffect(() => {
    if (isRTL) {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('font-mirza');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('font-mirza');
    }
    
    // Important: Don't modify logo fonts or button positions
    const logoElements = document.querySelectorAll('.site-logo');
    logoElements.forEach(el => {
      if (isRTL) {
        // Remove font-mirza from logo when in Persian
        el.classList.remove('font-mirza');
      }
    });
    
    // Ensure buttons maintain their position in RTL mode
    const buttonContainers = document.querySelectorAll('.fixed-button-container');
    buttonContainers.forEach(container => {
      if (isRTL) {
        // Don't reorder buttons, just fix the styles
        container.classList.add('rtl-fixed-position');
        container.querySelectorAll('button, a').forEach(btn => {
          btn.classList.add('rtl-preserve-position');
        });
      } else {
        container.classList.remove('rtl-fixed-position');
        container.querySelectorAll('button, a').forEach(btn => {
          btn.classList.remove('rtl-preserve-position');
        });
      }
    });
    
  }, [isRTL]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fa' : 'en');
  };

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || key;
  };

  // Function to update translations
  const updateTranslation = (key: string, newTranslations: { en: string; fa: string }) => {
    const updatedTranslations = {
      ...translations,
      [key]: newTranslations
    };
    
    // Update state
    setTranslations(updatedTranslations);
    
    // Save to localStorage
    localStorage.setItem(TRANSLATIONS_STORAGE_KEY, JSON.stringify(updatedTranslations));
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      isRTL, 
      toggleLanguage, 
      t, 
      translations,
      updateTranslation
    }}>
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
