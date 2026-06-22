import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PixelTransition.css';

export const PixelTransition = ({ 
  isActive, 
  children, 
  className = '',
  pixelSize = 10,
  duration = 0.8 
}) => {
  const [pixels, setPixels] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isActive && !isAnimating) {
      setIsAnimating(true);
      generatePixels();
    }
  }, [isActive, isAnimating]);

  const generatePixels = () => {
    const newPixels = [];
    const cols = Math.ceil(400 / pixelSize);
    const rows = Math.ceil(400 / pixelSize);
    
    for (let i = 0; i < cols * rows; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const delay = (col + row) * 0.01;
      
      newPixels.push({
        id: i,
        col,
        row,
        delay,
        size: pixelSize,
      });
    }
    
    setPixels(newPixels);
  };

  return (
    <div className={`pixel-transition-container ${className}`}>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="pixel-transition-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration }}
          >
            {pixels.map((pixel) => (
              <motion.div
                key={pixel.id}
                className="pixel"
                style={{
                  position: 'absolute',
                  width: pixel.size,
                  height: pixel.size,
                  left: pixel.col * pixel.size,
                  top: pixel.row * pixel.size,
                  backgroundColor: '#7700ff',
                }}
                initial={{ 
                  scale: 0,
                  opacity: 0,
                }}
                animate={{ 
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.4,
                  delay: pixel.delay,
                  ease: 'easeOut',
                }}
              />
            ))}
            <div className="pixel-content">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PixelTransition;