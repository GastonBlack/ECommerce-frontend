"use client";

import { useEffect } from "react";
import { useNotification } from "./NotificationProvider";
import { registerNotifier } from "@/lib/utils/globalNotifier";

export default function NotificationBridge() {
    const { showNotification } = useNotification();

    useEffect(() => {
        registerNotifier(showNotification);
    }, [showNotification]);

    return null;
}