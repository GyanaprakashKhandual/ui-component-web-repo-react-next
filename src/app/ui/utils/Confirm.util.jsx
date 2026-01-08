'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'default',
    isLoading = false,
    showCancelButton = true,
    modalClassName = '',
    titleClassName = '',
    messageClassName = '',
    confirmButtonClassName = '',
    cancelButtonClassName = '',
    iconSize = 28,
    iconWrapperSize = 'w-14 h-14'
}) => {
    const typeConfig = {
        default: {
            icon: Info,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-100',
            confirmBtn: 'bg-blue-600 hover:bg-blue-700'
        },
        success: {
            icon: CheckCircle,
            iconColor: 'text-green-500',
            iconBg: 'bg-green-100',
            confirmBtn: 'bg-green-600 hover:bg-green-700'
        },
        danger: {
            icon: AlertCircle,
            iconColor: 'text-red-500',
            iconBg: 'bg-red-100',
            confirmBtn: 'bg-red-600 hover:bg-red-700'
        },
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-100',
            confirmBtn: 'bg-amber-600 hover:bg-amber-700'
        },
        info: {
            icon: Info,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-100',
            confirmBtn: 'bg-blue-600 hover:bg-blue-700'
        }
    };

    const config = typeConfig[type] || typeConfig.default;
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={isLoading ? undefined : onClose}
                    />

                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden pointer-events-auto ${modalClassName}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                                    className={`${iconWrapperSize} rounded-full ${config.iconBg} flex items-center justify-center mx-auto mb-4`}
                                >
                                    <Icon className={config.iconColor} size={iconSize} />
                                </motion.div>

                                <h3 className={`text-xl font-semibold text-gray-900 text-center mb-2 ${titleClassName}`}>
                                    {title}
                                </h3>

                                <p className={`text-gray-600 text-center mb-6 ${messageClassName}`}>
                                    {message}
                                </p>

                                <div className="flex gap-3">
                                    {showCancelButton && (
                                        <button
                                            onClick={onClose}
                                            disabled={isLoading}
                                            className={`flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${cancelButtonClassName}`}
                                        >
                                            {cancelText}
                                        </button>
                                    )}
                                    <button
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        className={`${showCancelButton ? 'flex-1' : 'w-full'} px-4 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmBtn} ${confirmButtonClassName}`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Loading...</span>
                                            </span>
                                        ) : (
                                            confirmText
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;