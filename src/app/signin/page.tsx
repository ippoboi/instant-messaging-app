import SignInButton from "@/components/auth/sign-in-button";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)] bg-[#f5f5f5]">
      <div className="bg-white flex flex-col items-center justify-center">
        <div className="flex items-center justify-center border border-gray-200 w-full p-5">
          <Image
            src="/icons/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="bg-blue-500 p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 border border-gray-200 w-full p-5 border-t-0">
          <h1 className="text-lg font-medium max-w-56 text-center">
            Instant messages for instant vibes.
          </h1>
          <div className="flex items-center justify-center gap-2 w-full">
            <SignInButton provider="github" />
            <SignInButton provider="google" />
          </div>
          <div className="text-sm text-muted-foreground flex items-center w-full gap-2">
            <div className="h-[1px] w-full bg-zinc-200" />
            or
            <div className="h-[1px] w-full bg-zinc-200" />
          </div>

          <SignInButton provider="resend" />
        </div>
      </div>
    </div>
  );
}
