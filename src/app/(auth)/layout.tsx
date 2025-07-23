export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {children}
    </div>
  );
}
