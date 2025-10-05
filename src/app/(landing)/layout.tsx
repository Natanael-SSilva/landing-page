// src/app/(landing)/layout.tsx
import { Navbar } from "@/components/Navbar";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}