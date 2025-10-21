import React from 'react';

const Carousel = ({ children, className = '', speed = 'slow' }) => {
  const speedClass = speed === 'very-slow' ? 'animate-scroll-very-slow' : 
                     speed === 'slow' ? 'animate-scroll-slow' : 
                     speed === 'fast' ? 'animate-scroll-fast' : 'animate-scroll-slow';
  
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`flex ${speedClass}`}>
        <div className="flex">
          {children}
        </div>
        <div className="flex">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
