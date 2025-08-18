import { useEffect } from 'react';

export const CSSReset = () => {
  useEffect(() => {
    // Ensure CSS custom properties are applied
    const root = document.documentElement;
    
    // Force style recalculation to ensure CSS variables are applied
    const forceReflow = () => {
      root.style.display = 'none';
      root.offsetHeight; // Trigger reflow
      root.style.display = '';
    };
    
    // Apply on mount
    forceReflow();
    
    // Also apply when theme changes
    const observer = new MutationObserver(() => {
      forceReflow();
    });
    
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  return null;
};