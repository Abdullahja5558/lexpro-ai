"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LexProFinal from './dashboard/page';
import InitialLoader from '@/components/InitialLoader';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
  
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
     
      <AnimatePresence mode="wait">
        {isPageLoading && <InitialLoader key="loader" />}
      </AnimatePresence>

      {!isPageLoading && (
        <LexProFinal />
      )}
    </>
  );
};

export default Page;