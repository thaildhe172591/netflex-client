import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold font-mono">404 - Not Found</h1>
      <p className="mt-4 text-sm">
        Could not find requested resource.{" "}
        <Link href="/" className="text-blue-500 hover:underline">
          Return Home
        </Link>
      </p>
    </div>
  );
}
