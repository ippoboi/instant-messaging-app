import { signIn } from "@/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";

interface SignInButtonProps {
  provider: "github" | "resend" | "google";
}

export default function SignInButton({ provider }: SignInButtonProps) {
  async function handleResendSignIn(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    await signIn("resend", { email, redirectTo: "/" });
  }

  async function handleGithubSignIn() {
    "use server";
    await signIn("github", { redirectTo: "/" });
  }

  async function handleGoogleSignIn() {
    "use server";
    await signIn("google", { redirectTo: "/" });
  }

  if (provider === "resend") {
    return (
      <form action={handleResendSignIn} className="flex flex-col gap-2 w-full">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
        />
        <Button
          variant="outline"
          type="submit"
          className="flex items-center gap-2 w-full"
        >
          Magic link
        </Button>
      </form>
    );
  }

  if (provider === "google") {
    return (
      <form action={handleGoogleSignIn} className="w-full">
        <Button type="submit" className="flex items-center gap-2 w-full">
          <Image src="/icons/google.svg" alt="Google" width={16} height={16} />
        </Button>
      </form>
    );
  }

  return (
    <form action={handleGithubSignIn} className="w-full">
      <Button type="submit" className="flex items-center gap-2 w-full">
        <Image
          src="/icons/github-mark.svg"
          alt="GitHub"
          width={16}
          height={16}
        />
      </Button>
    </form>
  );
}
