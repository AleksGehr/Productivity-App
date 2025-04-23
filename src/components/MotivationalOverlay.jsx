import React from 'react';
import { motion } from 'framer-motion';

const MotivationalOverlay = () => (
  <div className="motivational-overlay">
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="motivational-message"
    >
      <img src="/productive.jpg" alt="Motivational" className="motivational-image" />
      <p>🎉 You’ve been super productive today!<br />I’m proud of you!</p>
    </motion.div>
  </div>
);

export default MotivationalOverlay;
