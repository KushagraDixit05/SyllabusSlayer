"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Suspense } from "react"
import { XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
    <div className="brutal-dots flex min-h-screen w-full items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px]"
      >
        <Card variant="elevated" className="flex flex-col items-center p-8">
          <div className="rounded-full mb-6 flex h-12 w-12 items-center justify-center border-[3px] border-ink bg-destructive text-destructive-foreground">
            <XCircle className="h-6 w-6" />
          </div>

          <h1 className="text-center font-display text-3xl font-black leading-none tracking-tight">
            Authentication Error
          </h1>
          <p className="mb-8 mt-3 max-w-[320px] text-center text-sm font-medium text-muted-foreground">
            {message}
          </p>

          <Button asChild size="lg">
            <Link href="/auth/signin">Try again</Link>
          </Button>
        </Card>
      </motion.div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthErrorContent />
    </Suspense>
  )
}
