import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookie = await cookies();

    const res = await fetch(
      `${process.env.API_URL}/api/v1/auth/confirm-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: await req.text(),
      }
    );

    if (!res.ok) return res;

    cookie.set("access_token", "", {
      maxAge: 0,
      path: "/",
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ message: "Some thing wrong" }, { status: 500 });
  }
}
