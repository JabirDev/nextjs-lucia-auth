"use server";

import { lucia } from "@/lib/lucia/auth";
import { signInSchema, SignInValues } from "@/lib/lucia/validation";
import prismadb from "@/lib/prisma";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(
  credentials: SignInValues
): Promise<{ error: string }> {
  try {
    const { username, password } = signInSchema.parse(credentials);

    const existingUser = await prismadb.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.password) {
      return {
        error: "Incorrect username or password",
      };
    }

    const validatePassword = await verify(existingUser.password, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validatePassword) {
      return {
        error: "Incorrect username or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
