import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold">Forbidden</h1>
      <p className="mt-4 text-sm">
        You are not authorized to access this resource.{" "}
        <Link href="/" className="text-blue-500 hover:underline">
          Return Home
        </Link>
      </p>
    </div>
  );
}
