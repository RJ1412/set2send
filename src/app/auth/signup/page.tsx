"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/signup");
  }, [router]);

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-purple-550 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">Redirecting to Sign Up...</p>
      </div>
    </div>
  );
}
