import { signIn } from "@/auth";
import { Button } from "../ui/button";
import Image from "next/image";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/" });
      }}
    >
      <Button type="submit" className="flex items-center gap-2">
        <Image
          src="/icons/github-mark.svg"
          alt="GitHub"
          width={16}
          height={16}
        />
        Sign in with GitHub
      </Button>
    </form>
  );
}
