import React, { useState, useEffect } from 'react';
import './DecryptedText.css';

export const DecryptedText = ({ 
  text, 
  className = '', 
  speed = 50,
  delay = 0,
  as: Component = 'h1' 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsDecrypting(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!isDecrypting) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsDecrypting(false);
      }

      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isDecrypting]);

  return (
    <Component className={`decrypted-text ${className} ${isDecrypting ? 'decrypting' : 'decrypted'}`}>
      {displayText}
    </Component>
  );
};

export default DecryptedText;