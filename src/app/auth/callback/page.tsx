"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting your Instagram account...");

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // This is the userId passed by the backend
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      console.error("Meta OAuth error:", error, errorDescription);
      setStatus("error");
      setMessage(errorDescription || "Meta denied the connection. Please try again.");
      setTimeout(() => router.push("/dashboard"), 3000);
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("No authorization code received from Meta.");
      setTimeout(() => router.push("/dashboard"), 3000);
      return;
    }

    const exchangeToken = async () => {
      try {
        // Call the correct backend endpoint: POST /api/instagram
        const { data } = await api.post("/instagram", {
          code,
          state: state || user?.id,
        });

        if (data.success) {
          setStatus("success");
          setMessage(`Successfully connected @${data.ig_username}!`);
          setTimeout(() => router.push("/dashboard"), 2000);
        } else {
          throw new Error("Token exchange returned unsuccessful.");
        }
      } catch (err: any) {
        console.error("Failed to exchange token:", err?.response?.data || err);
        setStatus("error");
        setMessage(
          err?.response?.data?.details?.error_description ||
          err?.response?.data?.error ||
          "Failed to authenticate. Please try again."
        );
        setTimeout(() => router.push("/dashboard"), 3000);
      }
    };

    exchangeToken();
  }, [searchParams, router, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-10 h-10 border-4 border-white/10 border-t-pink-500 rounded-full animate-spin" />
            </div>
            <h2 className="text-white text-lg font-semibold">Instagram Authentication</h2>
            <p className="text-gray-400 text-sm mt-2">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-white text-lg font-semibold">Connected!</h2>
            <p className="text-gray-400 text-sm mt-2">{message}</p>
            <p className="text-gray-600 text-xs mt-3">Redirecting to dashboard...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-white text-lg font-semibold">Instagram Authentication</h2>
            <p className="text-gray-400 text-sm mt-2">{message}</p>
            <p className="text-gray-600 text-xs mt-3">Redirecting back to dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-white/10 border-t-pink-500 rounded-full animate-spin" />
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
