import Image from "next/image";
import Link from "next/link";
export default function Header() {
  return (
    <header className="bg-black_blue h-22 p-4 flex items-center flex-row text-white gap-2">
      <Link href={`/`} className="pb-0.5">
        <Image
          src="/ultimateGym_logo.png" // <-- kein import, sondern Pfad ab public/
          alt="Ultimate Gym Logo"
          width={232}
          height={45}
          priority
        />
      </Link>
      <div className="flex flex-row">
        <h1 className="font-akzidenz-condensed text-3xl">
          BRAND BOOK <span className="font-akzidenz font-bold">- </span>INTERNAL
          USE ONLY
        </h1>
      </div>
    </header>
  );
}
