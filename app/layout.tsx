import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import { NotificationProvider } from "./components/NotificationProvider";

export const metadata: Metadata = {
    title: "ECommerce",
    description: "Frontend del ecommerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                <AuthProvider>
                    <NotificationProvider>
                        {children}
                    </NotificationProvider>
                </AuthProvider>
            </body>
        </html>
    );
}