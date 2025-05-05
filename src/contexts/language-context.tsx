"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Language = "en" | "vi";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    // App
    "app.title": "The Day Our Story Began",
    "app.description": "Keep your precious memories close, forever ❤️",
    "app.showIntro": "Show introduction again",

    // Onboarding
    "onboarding.title": "The Day Our Story Began",
    "onboarding.description": "Keep your precious memories close, forever",
    "onboarding.next": "Next",

    // Date Counter
    "dateCounter.selectDate": "Select a date",
    "dateCounter.pickDate": "Pick a date",
    "dateCounter.addLabel": "Add a label (optional)",
    "dateCounter.saveDate": "Save Date",
    "dateCounter.timeUntil": "Time until selected date:",
    "dateCounter.timeSince": "Time since selected date:",
    "dateCounter.currentTime": "Current time:",
    "dateCounter.savedDates": "Saved Dates",
    "dateCounter.years": "years",
    "dateCounter.months": "months",
    "dateCounter.days": "days",
    "dateCounter.hours": "hours",
    "dateCounter.minutes": "minutes",
    "dateCounter.seconds": "seconds",
    "dateCounter.ago": "ago",
    "dateCounter.fromNow": "from now",
    "dateCounter.past": "Past",
    "dateCounter.future": "Future",

    // Theme
    "theme.dark": "Dark",
    "theme.light": "Light",
    "theme.lover": "Lover",

    // Language
    "language.en": "English",
    "language.vi": "Tiếng Việt",
  },
  vi: {
    // App
    "app.title": "Ngày Câu Chuyện Của Chúng Ta Bắt Đầu",
    "app.description": "Giữ những kỷ niệm quý giá bên mình, mãi mãi ❤️",
    "app.showIntro": "Xem lại giới thiệu",

    // Onboarding
    "onboarding.title": "Ngày Câu Chuyện Của Chúng Ta Bắt Đầu",
    "onboarding.description": "Giữ những kỷ niệm quý giá bên mình, mãi mãi",
    "onboarding.next": "Tiếp tục",

    // Date Counter
    "dateCounter.selectDate": "Chọn một ngày",
    "dateCounter.pickDate": "Chọn ngày",
    "dateCounter.addLabel": "Thêm nhãn (tùy chọn)",
    "dateCounter.saveDate": "Lưu Ngày",
    "dateCounter.timeUntil": "Thời gian đến ngày đã chọn:",
    "dateCounter.timeSince": "Thời gian từ ngày đã chọn:",
    "dateCounter.currentTime": "Thời gian hiện tại:",
    "dateCounter.savedDates": "Ngày Đã Lưu",
    "dateCounter.years": "năm",
    "dateCounter.months": "tháng",
    "dateCounter.days": "ngày",
    "dateCounter.hours": "giờ",
    "dateCounter.minutes": "phút",
    "dateCounter.seconds": "giây",
    "dateCounter.ago": "trước",
    "dateCounter.fromNow": "từ bây giờ",
    "dateCounter.past": "Quá khứ",
    "dateCounter.future": "Tương lai",

    // Theme
    "theme.dark": "Tối",
    "theme.light": "Sáng",
    "theme.lover": "Tình yêu",

    // Language
    "language.en": "English",
    "language.vi": "Tiếng Việt",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "vi")) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
