import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function TopProgressBar() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    const handleStart = () => {
      setIsNavigating(true);
      setProgress(15);
      
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 90) {
            clearInterval(timer);
            return 90;
          }
          // Increment progress slightly slower towards the end
          const inc = (100 - oldProgress) / 10;
          return oldProgress + inc;
        });
      }, 200);
    };

    const handleComplete = () => {
      setProgress(100);
      clearInterval(timer);
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 400); // Allow time for full width before hiding
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      clearInterval(timer);
    };
  }, [router]);

  return (
    <div
      className={`fixed top-0 left-0 h-[1px] bg-white z-[9999] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,255,255,0.7)] ${
        isNavigating ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        width: `${progress}%`,
        pointerEvents: 'none' // Don't block clicking
      }}
    />
  );
}
