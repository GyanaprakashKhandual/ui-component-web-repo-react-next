'use client';

import { motion } from 'framer-motion';

export const Loader = ({
  size = 48,
  color = '#3b82f6',
  fullScreen = false,
  text = 'Loading...',
  showText = true,
  borderWidth = 4,
}) => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
  };

  const textVariants = {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const loaderContent = (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center gap-4"
    >
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        style={{
          width: size,
          height: size,
          borderWidth: borderWidth,
          borderColor: `${color}40`,
          borderTopColor: color,
          borderRadius: '50%',
        }}
      />

      {showText && (
        <motion.p
          variants={textVariants}
          animate="animate"
          className="text-sm font-medium"
          style={{ color }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;