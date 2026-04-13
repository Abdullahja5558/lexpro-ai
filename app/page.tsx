"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LexProFinal from './dashboard/page';
import InitialLoader from '@/components/InitialLoader'; // Ensure path is correct

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // 2.5 seconds premium loading experience
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 1. Initial High-End Loader */}
      <AnimatePresence mode="wait">
        {isPageLoading && <InitialLoader key="loader" />}
      </AnimatePresence>

      {/* 2. Main Dashboard with smooth entry */}
      {!isPageLoading && (
        <LexProFinal />
      )}
    </>
  );
};

export default Page;