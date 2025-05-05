"use client";

import { useState, useEffect } from "react";
import DateCounter from "./components/date-counter";
import Onboarding from "./components/onboarding";
import { ThemeToggle } from "./components/theme-toggle";
import { LanguageToggle } from "./components/language-toggle";
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has seen onboarding before
    const onboardingSeen = localStorage.getItem("onboardingSeen");
    if (onboardingSeen === "true") {
      setShowOnboarding(false);
      setHasSeenOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
    localStorage.setItem("onboardingSeen", "true");
  };

  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };

  return (
    <main className="min-h-dvh grid place-items-center p-4 bg-primitive-gray-50 dark:bg-primitive-gray-900">
      <div className="fixed top-0 right-0 p-4 flex gap-2 z-10">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6 text-primitive-gray-950 dark:text-primitive-gray-100">
            {t("app.title")}
          </h1>
          <p className="text-center mb-8 text-primitive-gray-600 dark:text-primitive-gray-300">
            {t("app.description")}
          </p>
          <DateCounter />

          {hasSeenOnboarding && (
            <div className="mt-8 text-center">
              <button
                onClick={handleShowOnboarding}
                className="text-sm text-primitive-gray-500 hover:text-primitive-gray-700 dark:text-primitive-gray-400 dark:hover:text-primitive-gray-200 underline"
              >
                {t("app.showIntro")}
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
