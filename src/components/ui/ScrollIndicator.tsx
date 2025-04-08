import React from 'react';
import { motion } from 'framer-motion';

const ScrollIndicator: React.FC = () => {
  return (
    <motion.div
      className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full max-w-[120px] mx-auto z-10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <span className="text-white text-sm font-medium mb-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Scroll Down</span>
      <motion.div
        className="w-7 h-12 border-2 border-white rounded-full flex justify-center p-1 bg-black/30 backdrop-blur-sm"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        <motion.div
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            y: [0, 14, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;
