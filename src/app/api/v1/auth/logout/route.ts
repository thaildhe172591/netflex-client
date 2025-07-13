import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get("access_token")?.value;
    const { deviceId } = await req.json();

    if (accessToken) {
      const res = await fetch(
        `${process.env.BASE_API_URL}/api/v1/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deviceId }),
        }
      );

      if (!res.ok) return res;
    }

    cookie.set("access_token", "", {
      maxAge: 0,
      path: "/",
    });

    cookie.set("refresh_token", "", {
      maxAge: 0,
      path: "/",
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ message: "Some thing wrong" }, { status: 500 });
  }
}
