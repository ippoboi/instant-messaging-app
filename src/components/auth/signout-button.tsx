"use client";

import { signOutAction } from "@/actions/auth";
import { LogOut } from "lucide-react";

export function SignOut() {
  return (
    <form action={signOutAction}>
      <div className="w-full">
        <button className="w-full flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent">
          <LogOut className="mr-2 size-4" />
          Log out
        </button>
      </div>
    </form>
  );
}
