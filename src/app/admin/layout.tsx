import { Auth } from "@/components/common";
import { Roles } from "@/constants";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Auth roles={[Roles.ADMIN, Roles.MODERATOR, Roles.USER]}>
      <div className="min-h-screen">{children}</div>
    </Auth>
  );
}
