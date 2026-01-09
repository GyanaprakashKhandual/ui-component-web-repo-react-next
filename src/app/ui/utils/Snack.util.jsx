import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react';

const variantStyles = {
  success: {
    bg: 'bg-emerald-50 border-l-4 border-emerald-600',
    text: 'text-emerald-900',
    icon: 'text-emerald-600',
    action: 'hover:bg-emerald-100'
  },
  error: {
    bg: 'bg-red-50 border-l-4 border-red-600',
    text: 'text-red-900',
    icon: 'text-red-600',
    action: 'hover:bg-red-100'
  },
  warning: {
    bg: 'bg-amber-50 border-l-4 border-amber-600',
    text: 'text-amber-900',
    icon: 'text-amber-600',
    action: 'hover:bg-amber-100'
  },
  info: {
    bg: 'bg-blue-50 border-l-4 border-blue-600',
    text: 'text-blue-900',
    icon: 'text-blue-600',
    action: 'hover:bg-blue-100'
  }
};

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: InfoIcon
};

const snackbarVariants = {
  initial: { 
    opacity: 0, 
    y: 100,
    scale: 0.9
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    y: 100,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
};

const progressVariants = {
  animate: {
    scaleX: 0,
    transition: {
      duration: 4,
      ease: 'linear'
    }
  }
};

export const Snackbar = ({
  open,
  message,
  variant = 'info',
  autoHideDuration = 4000,
  onClose,
  action,
  position = 'bottom-left',
  className = ''
}) => {
  const styles = variantStyles[variant] || variantStyles.info;
  const IconComponent = iconMap[variant];

  const positionClasses = {
    'top-left': 'top-6 left-6',
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
    'top-right': 'top-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-6 right-6'
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed z-50 ${positionClasses[position]} max-w-md w-full ${className}`}
          variants={snackbarVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={() => {
            if (autoHideDuration && open) {
              const timer = setTimeout(onClose, autoHideDuration);
              return () => clearTimeout(timer);
            }
          }}
        >
          <div className={`${styles.bg} ${styles.text} rounded-lg px-4 py-3 flex items-center gap-3 relative overflow-hidden`}>
            {IconComponent && (
              <IconComponent className={`${styles.icon} w-5 h-5 flex-shrink-0`} />
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium break-words">{message}</p>
            </div>

            {action && (
              <button
                onClick={() => {
                  action.onClick?.();
                  onClose();
                }}
                className={`flex-shrink-0 ml-2 px-3 py-1 text-sm font-semibold rounded transition-colors duration-200 ${styles.action}`}
              >
                {action.label}
              </button>
            )}

            <button
              onClick={onClose}
              className={`flex-shrink-0 ml-2 ${styles.icon} hover:opacity-70 transition-opacity`}
            >
              <X className="w-5 h-5" />
            </button>

            {autoHideDuration && (
              <motion.div
                className={`absolute bottom-0 left-0 h-0.5 ${variant === 'success' ? 'bg-emerald-600' : variant === 'error' ? 'bg-red-600' : variant === 'warning' ? 'bg-amber-600' : 'bg-blue-600'}`}
                style={{ originX: 0 }}
                initial={{ scaleX: 1 }}
                animate="animate"
                variants={progressVariants}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const SnackbarContainer = ({ snackbars, onClose }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {snackbars.map((snackbar) => (
          <motion.div
            key={snackbar.id}
            className="pointer-events-auto fixed bottom-6 left-6"
            variants={snackbarVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Snackbar
              open={true}
              message={snackbar.message}
              variant={snackbar.variant}
              autoHideDuration={snackbar.autoHideDuration}
              onClose={() => onClose(snackbar.id)}
              action={snackbar.action}
              position={snackbar.position}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};