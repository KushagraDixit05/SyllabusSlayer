"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Suspense } from "react"

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "Access denied. You do not have permission to sign in.",
  Verification: "The verification link has expired or has already been used.",
  Default: "An unexpected error occurred. Please try again.",
  OAuthSignin: "Error constructing the OAuth authorization URL.",
  OAuthCallback: "Error handling the OAuth callback.",
  OAuthCreateAccount: "Could not create OAuth provider user.",
  Callback: "Error in the OAuth callback handler.",
  OAuthAccountNotLinked:
    "This email is already associated with another account.",
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Default"
  const message = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#09090b] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] flex flex-col items-center"
      >
        {/* Error icon */}
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(239 68 68)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3 text-center">
          Authentication Error
        </h1>
        <p className="text-white/50 text-sm text-center mb-8 max-w-[320px]">
          {message}
        </p>

        <Link
          href="/auth/signin"
          className="h-[46px] px-8 flex items-center justify-center rounded-lg bg-white text-[#09090b] text-sm font-semibold transition-all duration-200 hover:bg-white/90 active:scale-[0.98]"
        >
          Try again
        </Link>
      </motion.div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]" />}>
      <AuthErrorContent />
    </Suspense>
  )
}
