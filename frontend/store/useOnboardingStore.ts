import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnboardingStore {
  hasCompletedOnboarding: boolean
  currentStep: number

  completeOnboarding: () => void
  setStep: (step: number) => void
  resetOnboarding: () => void
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      currentStep: 0,

      completeOnboarding: () =>
        set({ hasCompletedOnboarding: true, currentStep: 0 }),

      setStep: (step) => set({ currentStep: step }),

      resetOnboarding: () =>
        set({ hasCompletedOnboarding: false, currentStep: 0 }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
)
