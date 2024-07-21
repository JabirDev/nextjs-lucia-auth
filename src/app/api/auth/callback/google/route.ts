import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { google, lucia } from "@/lib/lucia/auth";
import prismadb from "@/lib/prisma";
import { generateIdFromEntropySize } from "lucia";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new NextResponse(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const googleUser: GoogleUser = await response.json();

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
      return new NextResponse(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
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
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new NextResponse(null, {
        status: 400,
      });
    }
    return new NextResponse(null, {
      status: 500,
    });
  }
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
