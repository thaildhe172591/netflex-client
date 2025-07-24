import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookie = await cookies();
    const refreshToken = cookie.get("refresh_token")?.value;
    if (!refreshToken) {
      return Response.json({ message: "No refresh token" }, { status: 400 });
    }

    const { deviceId } = await req.json();

    const res = await fetch(`${process.env.BASE_API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken, deviceId }),
    });

    if (!res.ok) return res;

    const { accessToken, refreshToken: newRefresh } = await res.json();

    cookie.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    cookie.set("refresh_token", newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ message: "Some thing wrong" }, { status: 500 });
  }
}
