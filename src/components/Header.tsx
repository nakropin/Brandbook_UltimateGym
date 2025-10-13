import Image from "next/image";
import Link from "next/link";
export default function Header() {
  return (
    <header className="bg-black_blue h-22 p-4 flex items-center flex-row text-white gap-2">
      <Link href={`/`} className="flex-[1_1_0%]">
        <Image
          src="/ultimateGym_logo.png" // <-- kein import, sondern Pfad ab public/
          alt="Ultimate Gym Logo"
          width={196.3}
          height={44.4}
          priority
        />
      </Link>
      <div className="flex flex-row flex-[4_1_0%]">
        <h1 className="font-jersey text-3xl">
          BRAND BOOK <span className="font-akzidenz font-bold">- </span>INTERNAL
          USE ONLY
        </h1>
      </div>
    </header>
  );
}
