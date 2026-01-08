'use client'
import React, { useState } from 'react';

const alertStore = {
    listeners: [],
    alerts: [],
    subscribe: (listener) => {
        alertStore.listeners.push(listener);
        return () => {
            alertStore.listeners = alertStore.listeners.filter((l) => l !== listener);
        };
    },
    notify: (alert) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newAlert = { ...alert, id };
        alertStore.alerts.push(newAlert);
        alertStore.listeners.forEach((listener) => listener([...alertStore.alerts]));

        if (alert.duration !== false) {
            setTimeout(() => {
                alertStore.removeAlert(id);
            }, alert.duration || 5000);
        }

        return id;
    },
    removeAlert: (id) => {
        alertStore.alerts = alertStore.alerts.filter((a) => a.id !== id);
        alertStore.listeners.forEach((listener) => listener([...alertStore.alerts]));
    },
};

export const useAlert = () => {
    const [alerts, setAlerts] = useState([]);

    React.useEffect(() => {
        return alertStore.subscribe(setAlerts);
    }, []);

    const showAlert = React.useCallback(
        (message, options = {}) => {
            const {
                type = 'info',
                position = 'top-center',
                duration = 5000,
                title = '',
                custom = {},
            } = options;

            return alertStore.notify({
                message,
                type,
                position,
                duration,
                title,
                custom,
            });
        },
        []
    );

    const removeAlert = React.useCallback((id) => {
        alertStore.removeAlert(id);
    }, []);

    return { alerts, showAlert, removeAlert };
};

export const useAlertMessage = () => {
    const { showAlert } = useAlert();

    return {
        success: (message, options = {}) =>
            showAlert(message, { type: 'success', ...options }),
        error: (message, options = {}) =>
            showAlert(message, { type: 'error', ...options }),
        warning: (message, options = {}) =>
            showAlert(message, { type: 'warning', ...options }),
        info: (message, options = {}) =>
            showAlert(message, { type: 'info', ...options }),
        custom: (message, customConfig = {}, options = {}) =>
            showAlert(message, { type: 'custom', custom: customConfig, ...options }),
    };
};