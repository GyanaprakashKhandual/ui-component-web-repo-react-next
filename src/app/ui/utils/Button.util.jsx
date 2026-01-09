'use client'
import { motion } from 'framer-motion';
import { ChevronRight, Plus, Check, X, Save, Trash2, Edit, Search, LogOut, Bell, Settings, ArrowRight } from 'lucide-react';

const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  initial: { scale: 1 }
};

const rippleVariants = {
  initial: { scale: 0, opacity: 0.6 },
  animate: { scale: 4, opacity: 0 }
};

const buttonStyles = {
  primary: {
    base: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
    hover: 'hover:from-blue-700 hover:to-blue-800'
  },
  secondary: {
    base: 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900',
    hover: 'hover:from-slate-200 hover:to-slate-300'
  },
  success: {
    base: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white',
    hover: 'hover:from-emerald-700 hover:to-emerald-800'
  },
  danger: {
    base: 'bg-gradient-to-r from-red-600 to-red-700 text-white',
    hover: 'hover:from-red-700 hover:to-red-800'
  },
  warning: {
    base: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
    hover: 'hover:from-amber-600 hover:to-amber-700'
  },
  info: {
    base: 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white',
    hover: 'hover:from-cyan-700 hover:to-cyan-800'
  },
  ghost: {
    base: 'bg-transparent text-slate-700 border border-slate-300',
    hover: 'hover:bg-slate-50 hover:border-slate-400'
  },
  outline: {
    base: 'bg-transparent text-blue-600 border border-blue-600',
    hover: 'hover:bg-blue-50'
  }
};

const sizeStyles = {
  small: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-1.5'
  },
  medium: {
    padding: 'px-4 py-2',
    text: 'text-base',
    icon: 'w-5 h-5',
    gap: 'gap-2'
  },
  large: {
    padding: 'px-6 py-3',
    text: 'text-lg',
    icon: 'w-6 h-6',
    gap: 'gap-2.5'
  }
};

const iconMap = {
  add: Plus,
  check: Check,
  close: X,
  save: Save,
  delete: Trash2,
  edit: Edit,
  search: Search,
  logout: LogOut,
  notification: Bell,
  settings: Settings,
  arrow: ArrowRight,
  chevron: ChevronRight
};

const buttonTypeConfigs = {
  primary: { style: 'primary', icon: null, text: 'Button' },
  save: { style: 'success', icon: 'save', text: 'Save' },
  cancel: { style: 'ghost', icon: 'close', text: 'Cancel' },
  clear: { style: 'secondary', icon: 'close', text: 'Clear' },
  delete: { style: 'danger', icon: 'delete', text: 'Delete' },
  add: { style: 'success', icon: 'add', text: 'Add' },
  submit: { style: 'primary', icon: 'check', text: 'Submit' },
  edit: { style: 'info', icon: 'edit', text: 'Edit' },
  search: { style: 'outline', icon: 'search', text: 'Search' },
  logout: { style: 'danger', icon: 'logout', text: 'Logout' },
  next: { style: 'primary', icon: 'arrow', text: 'Next' },
  previous: { style: 'secondary', icon: 'chevron', text: 'Previous' },
  settings: { style: 'ghost', icon: 'settings', text: 'Settings' },
  notification: { style: 'info', icon: 'notification', text: 'Notify' },
  secondary: { style: 'secondary', icon: null, text: 'Button' },
  tertiary: { style: 'outline', icon: null, text: 'Button' }
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  fullWidth = false,
  isLoading = false,
  ...props
}) => {
  const variantStyle = buttonStyles[variant] || buttonStyles.primary;
  const sizeStyle = sizeStyles[size] || sizeStyles.medium;

  const baseClasses = `
    relative inline-flex items-center justify-center
    ${sizeStyle.padding} ${sizeStyle.text} ${sizeStyle.gap}
    ${variantStyle.base} ${variantStyle.hover}
    rounded-lg font-medium transition-all duration-200
    outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const IconComponent = icon ? (typeof icon === 'string' ? iconMap[icon] : icon) : null;

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={baseClasses}
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled && !isLoading ? 'hover' : 'initial'}
      whileTap={!disabled && !isLoading ? 'tap' : 'initial'}
      {...props}
    >
      <span className="relative flex items-center justify-center gap-2">
        {isLoading && (
          <motion.div
            className="absolute w-full h-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <div className={`border-2 border-current border-t-transparent rounded-full ${sizeStyle.icon}`} />
          </motion.div>
        )}
        <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
          {iconPosition === 'left' && IconComponent && <IconComponent className={sizeStyle.icon} />}
          {children}
          {iconPosition === 'right' && IconComponent && <IconComponent className={sizeStyle.icon} />}
        </span>
      </span>
    </motion.button>
  );
};

export const ButtonPreset = ({
  preset = 'primary',
  children,
  size = 'medium',
  className = '',
  disabled = false,
  isLoading = false,
  onClick,
  fullWidth = false,
  iconPosition = 'left',
  ...props
}) => {
  const config = buttonTypeConfigs[preset] || buttonTypeConfigs.primary;

  return (
    <Button
      variant={config.style}
      size={size}
      icon={config.icon}
      iconPosition={iconPosition}
      disabled={disabled}
      isLoading={isLoading}
      onClick={onClick}
      fullWidth={fullWidth}
      className={className}
      {...props}
    >
      {children || config.text}
    </Button>
  );
};

export const ButtonGroup = ({ children, className = '', orientation = 'horizontal', ...props }) => {
  const baseClasses = `
    flex gap-2
    ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}
    ${className}
  `;

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export const LoadingButton = ({ isLoading = false, children, ...props }) => {
  return (
    <Button isLoading={isLoading} disabled={isLoading} {...props}>
      {children}
    </Button>
  );
};

export const IconButton = ({ icon, size = 'medium', variant = 'ghost', ...props }) => {
  const sizeMap = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon;

  return (
    <motion.button
      className={`
        flex items-center justify-center rounded-lg
        ${sizeMap[size]}
        ${buttonStyles[variant].base} ${buttonStyles[variant].hover}
        transition-all duration-200 outline-none focus-visible:ring-2
      `}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {IconComponent && <IconComponent className="w-5 h-5" />}
    </motion.button>
  );
};