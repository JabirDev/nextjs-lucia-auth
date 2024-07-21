"use server";

import { lucia } from "@/lib/lucia/auth";
import prismadb from "@/lib/prisma";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

export const onetapAction = async (token: string) => {
  try {
    const googleUser: GoogleUser = parseJwt(token);

    console.log("onetap user:", googleUser);

    const existingUser = await prismadb.user.findFirst({
      where: {
        email: googleUser.email,
      },
    });

    const account = await prismadb.account.findFirst({
      where: {
        provider: "google",
        providerId: googleUser.sub,
      },
    });

    if (existingUser) {
      if (!account) {
        await prismadb.account.create({
          data: {
            id: generateIdFromEntropySize(10),
            provider: "google",
            providerId: googleUser.sub,
            userId: existingUser.id,
          },
        });
      }
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    const userId = generateIdFromEntropySize(10);
    await prismadb.user.create({
      data: {
        id: userId,
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
        username: getUsernameFromEmail(googleUser.email),
        accounts: {
          create: {
            id: generateIdFromEntropySize(10),
            provider: "google",
            providerId: googleUser.sub,
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.log("onetap:", error);
  }
};

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function getUsernameFromEmail(email: string): string {
  const match = email.match(/^([^@]+)@/);
  return match ? match[1] : "";
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
