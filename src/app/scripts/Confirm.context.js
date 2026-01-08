"use client";
import { createContext, useContext, useState, useCallback } from "react";
import ConfirmModal from "../ui/utils/Confirm.util";

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
    const [confirmConfig, setConfirmConfig] = useState(null);
    const [resolveRef, setResolveRef] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const showConfirm = useCallback(
        ({
            title = "Confirm Action",
            message = "Are you sure you want to proceed?",
            confirmText = "Confirm",
            cancelText = "Cancel",
            type = "default",
            showCancelButton = true,
            modalClassName = '',
            titleClassName = '',
            messageClassName = '',
            confirmButtonClassName = '',
            cancelButtonClassName = '',
            iconSize = 28,
            iconWrapperSize = 'w-14 h-14',
            onConfirm = null
        }) => {
            return new Promise((resolve) => {
                setResolveRef(() => resolve);
                setConfirmConfig({
                    isOpen: true,
                    title,
                    message,
                    confirmText,
                    cancelText,
                    type,
                    showCancelButton,
                    modalClassName,
                    titleClassName,
                    messageClassName,
                    confirmButtonClassName,
                    cancelButtonClassName,
                    iconSize,
                    iconWrapperSize,
                    onConfirm
                });
            });
        },
        []
    );

    const hideConfirm = useCallback(() => {
        if (!isLoading) {
            if (resolveRef) resolveRef(false);
            setResolveRef(null);
            setConfirmConfig(null);
            setIsLoading(false);
        }
    }, [resolveRef, isLoading]);

    const handleConfirm = useCallback(async () => {
        if (confirmConfig?.onConfirm) {
            setIsLoading(true);
            try {
                await confirmConfig.onConfirm();
                if (resolveRef) resolveRef(true);
            } catch (error) {
                console.error('Confirm action failed:', error);
                if (resolveRef) resolveRef(false);
            } finally {
                setIsLoading(false);
                setResolveRef(null);
                setConfirmConfig(null);
            }
        } else {
            if (resolveRef) resolveRef(true);
            setResolveRef(null);
            setConfirmConfig(null);
            setIsLoading(false);
        }
    }, [resolveRef, confirmConfig]);

    return (
        <ConfirmContext.Provider value={{ showConfirm, hideConfirm }}>
            {children}
            {confirmConfig && (
                <ConfirmModal
                    isOpen={confirmConfig.isOpen}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    confirmText={confirmConfig.confirmText}
                    cancelText={confirmConfig.cancelText}
                    type={confirmConfig.type}
                    showCancelButton={confirmConfig.showCancelButton}
                    modalClassName={confirmConfig.modalClassName}
                    titleClassName={confirmConfig.titleClassName}
                    messageClassName={confirmConfig.messageClassName}
                    confirmButtonClassName={confirmConfig.confirmButtonClassName}
                    cancelButtonClassName={confirmConfig.cancelButtonClassName}
                    iconSize={confirmConfig.iconSize}
                    iconWrapperSize={confirmConfig.iconWrapperSize}
                    isLoading={isLoading}
                    onClose={hideConfirm}
                    onConfirm={handleConfirm}
                />
            )}
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};