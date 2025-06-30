import { Auth } from "@/components/common";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Auth>
      <div className="min-h-screen">{children}</div>
    </Auth>
  );
}
