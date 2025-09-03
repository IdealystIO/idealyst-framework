export const getDimensions = () => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  
  return { width: 1024, height: 768 }; // Default desktop size
};

export const addEventListener = (callback: (data: { window: { width: number; height: number } }) => void) => {
  if (typeof window !== 'undefined') {
    const handleResize = () => {
      callback({
        window: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return {
      remove: () => window.removeEventListener('resize', handleResize),
    };
  }
  
  return {
    remove: () => {},
  };
};