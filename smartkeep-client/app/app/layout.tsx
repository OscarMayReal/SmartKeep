"use client";
import { Sidebar } from "@/components/sidebar";
import { useWindowSize } from "@/lib/screensize";
import { TabBar } from "@/components/sidebar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const size = useWindowSize();
    return <div style={{ display: "flex", flexDirection: size.width >= 650 ? "row" : "column", height: "100dvh", width: "100vw", background: "var(--qu-background)", position: "absolute", top: 0, left: 0 }}>
        {size.width >= 650 && <Sidebar />}
        <div style={{ flex: 1 }}>{children}</div>
        {size.width < 650 && <TabBar />}
    </div>;
}