"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-black_blue h-22 p-4 flex items-center flex-row text-white gap-2">
      <Link href={`/`} className="pb-0.5">
        <Image
          src="/ultimateGym_logo.png"
          alt="Ultimate Gym Logo"
          width={232}
          height={45}
          priority
        />
      </Link>
      <div className="flex flex-row flex-1">
        <h1 className="font-akzidenz-condensed text-3xl">
          BRAND BOOK <span className="font-akzidenz font-bold">- </span>INTERNAL
          USE ONLY
        </h1>
      </div>
      <div className="ml-auto">
        {session ? (
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            Abmelden
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-4 py-2 text-sm bg-ultimate_blue hover:bg-ultimate_blue/80 rounded-lg transition"
          >
            Anmelden
          </button>
        )}
      </div>
    </header>
  );
}
