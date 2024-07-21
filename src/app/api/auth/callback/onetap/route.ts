import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = req.body;
    console.log("body:", body);
    return NextResponse.json({ message: "mantap" });
  } catch (e) {
    return new NextResponse(null, {
      status: 500,
    });
  }
}
