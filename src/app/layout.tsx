"use client";

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { jersey, akzidenz } from "@/fonts";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${akzidenz.variable} ${jersey.variable}`}>
      <body className="h-screen w-screen font-akzidenz font-normal">
        <Header />
        <div className="flex flex-row">
          <Sidebar />
          <main className="flex-4 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
