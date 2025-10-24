"use client";
import { Sidebar } from "@/components/sidebar";
import { useWindowSize } from "@/lib/screensize";
import { TabBar } from "@/components/sidebar";
import { useAuth } from "keystone-lib";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const size = useWindowSize();
    const auth = useAuth({
        appId: process.env.NEXT_PUBLIC_KEYSTONE_APP_ID!,
        keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL!,
    });
    const router = useRouter();
    useEffect(() => {
        if (!auth.loaded) {
            return;
        }
        if (auth.error) {
            router.push(process.env.NEXT_PUBLIC_KEYSTONE_URL! + "/auth/signin?redirectTo=" + encodeURIComponent(window.location.href));
        }
    }, [auth]);
    return <div style={{ display: "flex", flexDirection: size.width >= 650 ? "row" : "column", height: "100dvh", width: "100vw", background: "var(--qu-background)", position: "absolute", top: 0, left: 0 }}>
        {size.width >= 650 && <Sidebar />}
        <div style={{ flex: 1 }}>{children}</div>
        {size.width < 650 && <TabBar />}
    </div>;
}