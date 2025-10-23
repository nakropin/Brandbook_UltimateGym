import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

interface AuthButtonProps {
  session: Session | null;
}

export default function AuthButton({ session }: AuthButtonProps) {
  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        aria-label="Abmelden"
      >
        Abmelden
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        aria-label="Mit Google anmelden"
      >
        Mit Google anmelden
      </button>
    </div>
  );
}
