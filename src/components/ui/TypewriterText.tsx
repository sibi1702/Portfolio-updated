import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenTexts?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  texts,
  typingSpeed = 70,
  deletingSpeed = 40,
  delayBetweenTexts = 2000,
}) => {
  const [textIndex, setTextIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlinking, setIsBlinking] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        setText(current => current.slice(0, -1));
        if (text === '') {
          setIsDeleting(false);
          setTextIndex((current) => (current + 1) % texts.length);
          setIsBlinking(true);
        }
      } else {
        setText(currentText.slice(0, text.length + 1));
        if (text === currentText) {
          setIsBlinking(true);
          setTimeout(() => {
            setIsBlinking(false);
            setIsDeleting(true);
          }, delayBetweenTexts);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, delayBetweenTexts]);

  return (
    <div className="text-2xl sm:text-3xl font-bold text-white relative inline-block">
      <span className="mr-2">{text}</span>
      <span 
        className={`
          absolute -right-[4px] top-0 h-full w-[2px] bg-white
          ${isBlinking ? 'animate-pulse' : ''}
        `}
      />
    </div>
  );
};

export default TypewriterText;
