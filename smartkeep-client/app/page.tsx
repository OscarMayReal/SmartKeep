import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw", gap: "1rem" }}>
      <h1 className="text-4xl" style={{ color: "var(--qu-text)" }}>SmartKeep</h1>
      <p style={{ color: "var(--qu-text-secondary)" }}>Don't fall into the trap of losing things. Use SmartKeep to keep track of where your assets are and who has them.</p>
      <a href="/app"><Button variant="outline" style={{color: "var(--qu-text)"}}><SparklesIcon />Get Started</Button></a>
    </div>
  );
}
