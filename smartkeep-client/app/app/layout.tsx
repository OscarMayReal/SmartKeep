import { Sidebar } from "@/components/sidebar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div style={{ display: "flex", flexDirection: "row" }}>
        <Sidebar />
        {children}
    </div>;
}