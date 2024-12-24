import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-10">
      <Image
        width={512}
        height={512}
        src="/logo.png"
        alt="Platforms on Vercel"
        className="w-48"
      />
      <Link className="text-white" href="http://app.localhost:3000/login">
        Login
      </Link>
    </div>
  )
}
