import { cookies } from "next/headers";
import { buildApiUrl } from "../_utils";

export async function POST(req: Request) {
  try {
    const { email, password, deviceId } = await req.json();
    const res = await fetch(buildApiUrl("/api/v1/auth/signin"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, deviceId }),
    });

    if (!res.ok) return res;

    const payload = await res.json();
    const accessToken = payload?.data?.accessToken ?? payload?.accessToken;
    const refreshToken = payload?.data?.refreshToken ?? payload?.refreshToken;

    if (!accessToken || !refreshToken) {
      return Response.json(
        { message: "Invalid signin response payload" },
        { status: 502 }
      );
    }

    const cookie = await cookies();
    cookie.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    cookie.set("refresh_token", refreshToken, {
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
