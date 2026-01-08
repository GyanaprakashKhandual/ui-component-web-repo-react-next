'use client';

import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const variants = {
    primary: {
      bg: 'bg-blue-600 hover:bg-blue-700',
      gradient: 'linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6)',
      text: 'text-white',
      shadow: 'shadow-lg hover:shadow-blue-500/50',
    },
    secondary: {
      bg: 'bg-transparent border-2 border-emerald-500 hover:bg-emerald-500/10',
      gradient: 'linear-gradient(90deg, #10b981, #6366f1, #10b981)',
      text: 'text-emerald-500 hover:text-emerald-600',
      shadow: '',
    },
    danger: {
      bg: 'bg-red-600 hover:bg-red-700',
      gradient: 'linear-gradient(90deg, #ef4444, #f97316, #ef4444)',
      text: 'text-white',
      shadow: 'shadow-lg hover:shadow-red-500/50',
    },
    success: {
      bg: 'bg-green-600 hover:bg-green-700',
      gradient: 'linear-gradient(90deg, #16a34a, #22c55e, #16a34a)',
      text: 'text-white',
      shadow: 'shadow-lg hover:shadow-green-500/50',
    },
    warning: {
      bg: 'bg-amber-600 hover:bg-amber-700',
      gradient: 'linear-gradient(90deg, #d97706, #f59e0b, #d97706)',
      text: 'text-white',
      shadow: 'shadow-lg hover:shadow-amber-500/50',
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
    xl: 'px-12 py-5 text-xl',
  };

  const selectedVariant = variants[variant] || variants.primary;
  const selectedSize = sizes[size] || sizes.md;

  const borderVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading || disabled}
      variants={borderVariants}
      animate={isLoading ? 'animate' : 'initial'}
      style={
        isLoading
          ? {
              background: selectedVariant.gradient,
              backgroundSize: '200% 200%',
            }
          : {}
      }
      className={`relative font-semibold rounded-lg transition-all duration-300 overflow-hidden active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed ${selectedSize} ${selectedVariant.text} ${
        isLoading
          ? 'cursor-not-allowed'
          : `${selectedVariant.bg} ${selectedVariant.shadow}`
      } ${className}`}
      {...props}
    >
      <div
        className={`absolute inset-0 rounded-lg ${
          isLoading ? 'block' : 'hidden'
        }`}
        style={
          isLoading
            ? {
                background: selectedVariant.gradient,
                backgroundSize: '200% 200%',
                animation: 'shimmer 2s infinite',
              }
            : {}
        }
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 rounded-full"
            style={{
              borderColor: 'currentColor',
              borderTopColor: 'transparent',
            }}
          />
        )}
        {children}
      </span>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.button>
  );
};

export default Button;