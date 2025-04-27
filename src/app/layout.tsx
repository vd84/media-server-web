import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";

const geistSans = Geist({
    variable: "--font-geist-sans", subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono", subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MediaServer", description: "Self-hosted media platform",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (<html lang="en" className="bg-gray-950 text-white">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header/>
        <main className="min-h-screen">
            {children}
        </main>
        <footer className="text-center text-gray-500 py-4 text-sm">
            © 2025 MediaServer.
        </footer>
        </body>
        </html>);
}
