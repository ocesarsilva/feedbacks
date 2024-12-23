"use client"

import { AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"

import { CreateSite } from "./create-site"
import { Intro } from "./intro"

interface OnboardingProps {
  userId: string
}

export function Onboarding({ userId }: OnboardingProps) {
  const search = useSearchParams()
  const step = search.get("step")

  return (
    <AnimatePresence mode="wait">
      {!step && <Intro key="intro" />}
      {step === "create" && <CreateSite userId={userId} />}
    </AnimatePresence>
  )
}
