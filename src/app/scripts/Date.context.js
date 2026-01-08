'use client'
import { createContext, useContext, useState } from 'react';

const DateTimeContext = createContext(null);

export const useDateTimePicker = () => {
    const context = useContext(DateTimeContext);
    if (!context) {
        throw new Error('useDateTimePicker must be used within DateTimeProvider');
    }
    return context;
};

export const DateTimeProvider = ({ children }) => {
    const [openPickerId, setOpenPickerId] = useState(null);

    const registerPicker = (id) => {
        return {
            isOpen: openPickerId === id,
            open: () => setOpenPickerId(id),
            close: () => setOpenPickerId(null),
            toggle: () => setOpenPickerId(openPickerId === id ? null : id),
        };
    };

    return (
        <DateTimeContext.Provider value={{ registerPicker, openPickerId }}>
            {children}
        </DateTimeContext.Provider>
    );
};