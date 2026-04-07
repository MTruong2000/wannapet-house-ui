import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiRes = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: data.message || "Login failed" },
        { status: apiRes.status }
      );
    }

    if (!data?.token) {
      return NextResponse.json(
        { message: "Token không tồn tại từ backend." },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { success: true, user: data.user ?? null },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("admin_token", data.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
