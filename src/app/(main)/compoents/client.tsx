"use client";

import { signOut } from "@/app/(auth)/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "@/providers/auth";
import Image from "next/image";
import Link from "next/link";

const Client = () => {
  const session = useSession();
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <Image
        className="rounded-full"
        src={session.user?.image ?? "/vercel.svg"}
        alt="User"
        width={120}
        height={120}
      />
      <h1 className="text-2xl font-bold">
        {session.user
          ? `👋 Hello, ${session.user.name}`
          : "You are not logged in"}
      </h1>
      {session.user ? (
        <form action={signOut}>
          <Button variant="destructive" size="sm">
            Log out
          </Button>
        </form>
      ) : (
        <Link
          href={"/signin"}
          className={buttonVariants({ variant: "default" })}
        >
          Sign In
        </Link>
      )}
    </div>
  );
};

export default Client;
