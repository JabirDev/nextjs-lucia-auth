import { Metadata } from "next";
import Link from "next/link";
import SignInForm from "./components/form";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function Page() {
  return (
    <div className="w-full font-sans flex-col min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold leading-tight">Sign In</h1>
      <p>You have to signed in</p>
      <Link
        href={"/api/auth/google"}
        className={buttonVariants({ variant: "secondary" })}
      >
        Sign In with Google
      </Link>
      <SignInForm />
      <Link
        href={"/signup"}
        className="text-sm mt-10 hover:opacity-95 tracking-tighter hover:underline"
      >
        Create account
      </Link>
    </div>
  );
}
