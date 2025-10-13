"use client";

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { jersey, akzidenz } from "@/fonts";
import SubHeader from "@/components/SubHeader";
import { usePathname } from "next/navigation";
import brandbook from "@/brandbook.json";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = brandbook.sections.find((s) => s.url === pathname);

  return (
    <html lang="de" className={`${akzidenz.variable} ${jersey.variable}`}>
      <body className="h-screen w-screen font-akzidenz font-normal flex flex-col">
        <Header />
        <div className="flex flex-row flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-4 overflow-y-auto">
            <div className="p-4 pr-8">
              <SubHeader title={title?.title} />
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
