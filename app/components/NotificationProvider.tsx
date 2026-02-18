"use client";

import { createContext, useContext, useState, useCallback } from "react";
import Notification from "./Notification";

type NotificationType = "success" | "error";

type ContextType = {
    showNotification: (message: string, type?: NotificationType) => void;
};

const NotificationContext = createContext<ContextType>({
    showNotification: () => { },
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<NotificationType>("success");

    const showNotification = useCallback((msg: string, t: NotificationType = "success") => {
        setMessage(msg);
        setType(t);

        setTimeout(() => {
            setMessage(null);
        }, 2100);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {message && (
                <div className="fixed top-6 right-0 z-[9999]">
                    <Notification message={message} type={type} />
                </div>
            )}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}