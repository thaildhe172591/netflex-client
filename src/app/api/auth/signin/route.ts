import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password, deviceId } = await req.json();
    const res = await fetch(`${process.env.API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, deviceId }),
    });

    if (!res.ok) return res;

    const { accessToken, refreshToken } = await res.json();

    const cookie = await cookies();
    cookie.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    cookie.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return Response.json({ success: true });
  } catch {
    return Response.json({ message: "Some thing wrong" }, { status: 500 });
  }
}
