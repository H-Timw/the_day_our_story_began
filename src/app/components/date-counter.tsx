/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

type SavedDate = {
  id: string;
  date: Date;
  label: string;
};

type TimeDifference = {
  days: number;
  months: number;
  years: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function DateCounter() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [timeDifference, setTimeDifference] = useState<TimeDifference | null>(
    null
  );
  const [savedDates, setSavedDates] = useState<SavedDate[]>([]);
  const [customLabel, setCustomLabel] = useState<string>("");

  // Load saved dates from localStorage on component mount
  useEffect(() => {
    const savedDatesJson = localStorage.getItem("savedDates");
    if (savedDatesJson) {
      try {
        const parsed = JSON.parse(savedDatesJson);
        // Convert string dates back to Date objects
        const restored = parsed.map((item: any) => ({
          ...item,
          date: new Date(item.date),
        }));
        setSavedDates(restored);
      } catch (e) {
        console.error("Failed to parse saved dates", e);
      }
    }
  }, []);

  // Save to localStorage whenever savedDates changes
  useEffect(() => {
    if (savedDates.length > 0) {
      localStorage.setItem("savedDates", JSON.stringify(savedDates));
    }
  }, [savedDates]);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate time difference when date or current time changes
  useEffect(() => {
    if (!date) {
      setTimeDifference(null);
      return;
    }

    setTimeDifference(calculateTimeDifference(date, currentDate));
  }, [date, currentDate]);

  const calculateTimeDifference = (
    fromDate: Date,
    toDate: Date
  ): TimeDifference => {
    const days = Math.abs(differenceInDays(fromDate, toDate));
    const months = Math.abs(differenceInMonths(fromDate, toDate));
    const years = Math.abs(differenceInYears(fromDate, toDate));
    const hours = Math.abs(differenceInHours(fromDate, toDate));
    const minutes = Math.abs(differenceInMinutes(fromDate, toDate));
    const seconds = Math.abs(differenceInSeconds(fromDate, toDate));

    return { days, months, years, hours, minutes, seconds };
  };

  const saveCurrentDate = () => {
    if (!date) return;

    const label = customLabel.trim() || format(date, "PPP");
    const newSavedDate: SavedDate = {
      id: Date.now().toString(),
      date: new Date(date),
      label,
    };

    setSavedDates([...savedDates, newSavedDate]);
    setCustomLabel("");
  };

  const removeSavedDate = (id: string) => {
    setSavedDates(savedDates.filter((item) => item.id !== id));
    // If localStorage only has one item and we're removing it, clear localStorage
    if (savedDates.length === 1) {
      localStorage.removeItem("savedDates");
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-2">
        <label
          htmlFor="date-picker"
          className="text-sm font-medium text-primitive-gray-700 dark:text-primitive-gray-300"
        >
          Select a date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              captionLayout="dropdown"
              fromYear={1900}
              toYear={2100}
              className="border-none"
            />
          </PopoverContent>
        </Popover>

        {date && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Add a label (optional)"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button
              onClick={saveCurrentDate}
              className="flex-shrink-0"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Save Date
            </Button>
          </div>
        )}
      </div>

      {timeDifference && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-primitive-gray-800 dark:text-primitive-gray-100">
                Time {date && date > currentDate ? "until" : "since"} selected
                date:
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <TimeUnit
                  label="Years"
                  value={timeDifference.years}
                />
                <TimeUnit
                  label="Months"
                  value={timeDifference.months}
                />
                <TimeUnit
                  label="Days"
                  value={timeDifference.days}
                />
                <TimeUnit
                  label="Hours"
                  value={timeDifference.hours}
                />
                <TimeUnit
                  label="Minutes"
                  value={timeDifference.minutes}
                />
                <TimeUnit
                  label="Seconds"
                  value={timeDifference.seconds}
                />
              </div>
              <p className="mt-4 text-sm text-primitive-gray-500 dark:text-primitive-gray-400">
                Current time: {format(currentDate, "PPPp")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {savedDates.length > 0 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-primitive-gray-800 dark:text-primitive-gray-100">
            Saved Dates
          </h2>
          <div className="space-y-4">
            {savedDates.map((savedDate, index) => {
              const diff = calculateTimeDifference(savedDate.date, currentDate);
              const isPast = savedDate.date < currentDate;

              return (
                <motion.div
                  key={savedDate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Card>
                    <CardContent className="pt-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{savedDate.label}</h3>
                            <Badge variant={isPast ? "secondary" : "outline"}>
                              {isPast ? "Past" : "Future"}
                            </Badge>
                          </div>
                          <p className="text-sm text-primitive-gray-500 dark:text-primitive-gray-400 mt-1">
                            {format(savedDate.date, "PPP")}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="text-sm">
                              <span className="font-semibold">
                                {diff.years}
                              </span>{" "}
                              years
                            </span>
                            <span className="text-sm">
                              <span className="font-semibold">
                                {diff.months}
                              </span>{" "}
                              months
                            </span>
                            <span className="text-sm">
                              <span className="font-semibold">{diff.days}</span>{" "}
                              days
                            </span>
                            <span className="text-sm text-primitive-gray-500">
                              ({isPast ? "ago" : "from now"})
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSavedDate(savedDate.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function TimeUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center p-3 bg-primitive-gray-100 dark:bg-primitive-gray-800 rounded-lg">
      <span className="text-2xl font-bold text-primitive-gray-800 dark:text-primitive-gray-100">
        {value.toLocaleString()}
      </span>
      <span className="text-sm text-primitive-gray-600 dark:text-primitive-gray-300">
        {label}
      </span>
    </div>
  );
}
