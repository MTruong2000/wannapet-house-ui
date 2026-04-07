import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function handler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { path } = await context.params;
    const query = req.nextUrl.searchParams.toString();

    const targetUrl = `${API_BASE_URL}/api/admin/${path.join("/")}${
      query ? `?${query}` : ""
    }`;

    const contentType = req.headers.get("content-type");
    const isFormData = contentType?.includes("multipart/form-data");

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    if (contentType && !isFormData) {
      headers["Content-Type"] = contentType;
    }

    const init: RequestInit = {
      method: req.method,
      headers,
      cache: "no-store",
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      if (isFormData) {
        const formData = await req.formData();
        init.body = formData;
      } else {
        const rawBody = await req.text();
        init.body = rawBody;
      }
    }

    const apiRes = await fetch(targetUrl, init);

    const responseContentType = apiRes.headers.get("content-type") || "";

    if (responseContentType.includes("application/json")) {
      const data = await apiRes.json();
      return NextResponse.json(data, { status: apiRes.status });
    }

    const text = await apiRes.text();
    return new NextResponse(text, {
      status: apiRes.status,
      headers: {
        "Content-Type": responseContentType || "text/plain",
      },
    });
  } catch (error) {
    console.error("Admin proxy error:", error);
    return NextResponse.json(
      { message: "Internal proxy server error" },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
