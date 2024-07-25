import { generateCodeVerifier, generateState } from "arctic";
import { google } from "@/lib/lucia/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10,
    });

    cookies().set("google_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10,
    });

    const url = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ["profile", "email"],
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error generating authorization URL:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
