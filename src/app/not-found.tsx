// app/not-found.tsx
import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p className="text-gray-600">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
