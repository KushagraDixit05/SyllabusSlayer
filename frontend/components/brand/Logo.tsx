import Image from "next/image"

export interface LogoProps {
  /** Pixel size of the square mark. */
  size?: number
  className?: string
}

/**
 * SyllabusSlayer mark: the "Triumphant Green Book Mascot" — a book character
 * mid-celebration with a trophy, in the lime/mint + peach/coral brand gradients.
 */
export function Logo({ size = 32, className }: LogoProps) {
  return (
    <Image
      src="/logo-mascot.png"
      alt="SyllabusSlayer"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}
