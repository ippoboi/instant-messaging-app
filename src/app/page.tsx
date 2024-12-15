import { auth } from "@/auth";
import { SignOut } from "@/components/auth/signout-button";

export default async function Home() {
  const session = await auth();
  if (!session)
    return (
      <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)] bg-[#f5f5f5]">
        Not authenticated
      </div>
    );
  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)] bg-[#f5f5f5]">
      <div>
        <h1>Welcome, {session.user?.name}</h1>
        <SignOut />
      </div>
    </div>
  );
}
