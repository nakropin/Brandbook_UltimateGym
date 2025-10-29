"use client";

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import { usePathname } from "next/navigation";
import brandbook from "@/brandbook.json";
import { useState } from "react";
import {
  akzidenz,
  akzidenzCondensed,
  akzidenzCondensedAlt,
  akzidenzExtended,
  akzidenzLight,
  akzidenzXBoldAlt
} from "@/fonts";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = brandbook.sections.find((s) => s.url === pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html
      lang="de"
      className={`
        ${akzidenz.variable} 
        ${akzidenzCondensed.variable} 
        ${akzidenzCondensedAlt.variable}
        ${akzidenzExtended.variable}
        ${akzidenzLight.variable}
        ${akzidenzXBoldAlt.variable}
      `}
    >
      <body className="h-screen w-screen font-akzidenz font-normal flex flex-col">
        <Header />
        <div className="flex flex-row flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <main className="flex-1 overflow-y-auto transition-all duration-300">
            <div className="p-4 pr-8 overflow-x-hidden">
              <SubHeader title={title?.title} />
              <SessionProvider>{children}</SessionProvider>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
