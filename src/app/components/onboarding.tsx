/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { t } = useLanguage();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Auto-complete animation after 5 seconds
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto">
      <motion.div
        className="flex flex-col items-center justify-center space-y-8 text-center"
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-2"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-primitive-gray-950 dark:text-primitive-gray-100 lover:text-primitive-rose-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {t("onboarding.title")}
          </motion.h1>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 1.5, delay: 1.5 }}
        >
          <p className="text-xl text-primitive-gray-600 dark:text-primitive-gray-300 max-w-sm lover:text-primitive-rose-600">
            {t("onboarding.description")}{" "}
            <motion.span
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                repeatDelay: 1,
              }}
              className="inline-block"
            >
              <Heart className="h-10 w-10 inline text-primitive-red-500 fill-primitive-red-500" />
            </motion.span>
          </p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 1, delay: 3 }}
        >
          <Button
            size={"lg"}
            onClick={onComplete}
            className="mt-8 px-20 py-12 text-lg bg-theme-link-foreground text-primitive-gray-50 dark:text-primitive-gray-50 rounded-full border border-(--color-heading-foreground)"
          >
            {t("onboarding.next")}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
